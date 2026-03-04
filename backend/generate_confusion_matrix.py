"""
Generate Confusion Matrix for XGBoost Model
Visualizes model performance and identifies common misclassifications
"""

import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter

print("=" * 70)
print("CONFUSION MATRIX GENERATION")
print("=" * 70)

# Load dataset
print("\nStep 1: Loading dataset...")
df = pd.read_csv("Final_Augmented_dataset_Diseases_and_Symptoms.csv")
print(f"   Loaded {len(df):,} samples")

# Filter rare diseases
disease_counts = df['prognosis'].value_counts()
min_samples = 10
valid_diseases = disease_counts[disease_counts >= min_samples].index
df_filtered = df[df['prognosis'].isin(valid_diseases)]
print(f"   Kept {len(valid_diseases)} diseases")

# Prepare data
X = df_filtered.drop('prognosis', axis=1)
y = df_filtered['prognosis']

# Encode labels
from sklearn.preprocessing import LabelEncoder
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# Split data (same as training)
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"   Test set: {len(X_test):,} samples")

# Load trained model
print("\nStep 2: Loading trained model...")
model = pickle.load(open('model.pkl', 'rb'))
label_encoder_saved = pickle.load(open('label_encoder.pkl', 'rb'))
print("   Model loaded successfully")

# Make predictions
print("\nStep 3: Generating predictions...")
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"   Test Accuracy: {accuracy*100:.2f}%")

# Generate confusion matrix
print("\nStep 4: Computing confusion matrix...")
cm = confusion_matrix(y_test, y_pred)
print(f"   Matrix shape: {cm.shape[0]} x {cm.shape[1]}")

# Calculate per-class metrics
print("\nStep 5: Analyzing per-class performance...")
class_accuracies = []
for i in range(len(label_encoder_saved.classes_)):
    if cm[i].sum() > 0:
        class_acc = cm[i, i] / cm[i].sum()
        class_accuracies.append((label_encoder_saved.classes_[i], class_acc, cm[i].sum()))

# Sort by accuracy
class_accuracies.sort(key=lambda x: x[1], reverse=True)

# Top 10 best predicted diseases
print("\n" + "=" * 70)
print("TOP 10 BEST PREDICTED DISEASES")
print("=" * 70)
for i, (disease, acc, count) in enumerate(class_accuracies[:10], 1):
    print(f"{i:2d}. {disease:40s} - {acc*100:5.1f}% ({count:4d} samples)")

# Bottom 10 worst predicted diseases
print("\n" + "=" * 70)
print("TOP 10 MOST CHALLENGING DISEASES")
print("=" * 70)
for i, (disease, acc, count) in enumerate(class_accuracies[-10:], 1):
    print(f"{i:2d}. {disease:40s} - {acc*100:5.1f}% ({count:4d} samples)")

# Find most common misclassifications
print("\n" + "=" * 70)
print("TOP 10 MOST COMMON MISCLASSIFICATIONS")
print("=" * 70)

misclassifications = []
for i in range(len(cm)):
    for j in range(len(cm)):
        if i != j and cm[i, j] > 0:
            true_disease = label_encoder_saved.classes_[i]
            pred_disease = label_encoder_saved.classes_[j]
            count = cm[i, j]
            misclassifications.append((true_disease, pred_disease, count))

misclassifications.sort(key=lambda x: x[2], reverse=True)

for i, (true_disease, pred_disease, count) in enumerate(misclassifications[:10], 1):
    print(f"{i:2d}. {true_disease:30s} -> {pred_disease:30s} ({count:3d} times)")

# Overall statistics
print("\n" + "=" * 70)
print("OVERALL STATISTICS")
print("=" * 70)

total_predictions = cm.sum()
correct_predictions = np.trace(cm)
incorrect_predictions = total_predictions - correct_predictions

print(f"Total Predictions: {total_predictions:,}")
print(f"Correct: {correct_predictions:,} ({correct_predictions/total_predictions*100:.2f}%)")
print(f"Incorrect: {incorrect_predictions:,} ({incorrect_predictions/total_predictions*100:.2f}%)")
print(f"\nAverage per-class accuracy: {np.mean([acc for _, acc, _ in class_accuracies])*100:.2f}%")
print(f"Median per-class accuracy: {np.median([acc for _, acc, _ in class_accuracies])*100:.2f}%")

# Visualizations
print("\n" + "=" * 70)
print("GENERATING VISUALIZATIONS")
print("=" * 70)

# 1. Overall confusion matrix (heatmap for top 50 diseases)
print("\n1. Creating overall confusion matrix heatmap...")
top_50_diseases = [disease for disease, _, _ in class_accuracies[:50]]
top_50_indices = [list(label_encoder_saved.classes_).index(d) for d in top_50_diseases]

cm_top50 = cm[np.ix_(top_50_indices, top_50_indices)]

plt.figure(figsize=(20, 16))
sns.heatmap(cm_top50, annot=False, fmt='d', cmap='Blues', 
            xticklabels=top_50_diseases, yticklabels=top_50_diseases,
            cbar_kws={'label': 'Number of Predictions'})
plt.title('Confusion Matrix - Top 50 Diseases (XGBoost Model)', fontsize=16, pad=20)
plt.xlabel('Predicted Disease', fontsize=12)
plt.ylabel('True Disease', fontsize=12)
plt.xticks(rotation=90, ha='right', fontsize=8)
plt.yticks(rotation=0, fontsize=8)
plt.tight_layout()
plt.savefig('confusion_matrix_top50.png', dpi=300, bbox_inches='tight')
print("   Saved: confusion_matrix_top50.png")
plt.close()

# 2. Per-class accuracy distribution
print("\n2. Creating per-class accuracy distribution...")
accuracies = [acc for _, acc, _ in class_accuracies]

plt.figure(figsize=(12, 6))
plt.hist(accuracies, bins=50, color='skyblue', edgecolor='black', alpha=0.7)
plt.axvline(np.mean(accuracies), color='red', linestyle='--', linewidth=2, label=f'Mean: {np.mean(accuracies)*100:.1f}%')
plt.axvline(np.median(accuracies), color='green', linestyle='--', linewidth=2, label=f'Median: {np.median(accuracies)*100:.1f}%')
plt.xlabel('Per-Class Accuracy', fontsize=12)
plt.ylabel('Number of Diseases', fontsize=12)
plt.title('Distribution of Per-Class Accuracy (XGBoost Model)', fontsize=14)
plt.legend(fontsize=10)
plt.grid(axis='y', alpha=0.3)
plt.tight_layout()
plt.savefig('accuracy_distribution.png', dpi=300, bbox_inches='tight')
print("   Saved: accuracy_distribution.png")
plt.close()

# 3. Top 20 best vs worst diseases
print("\n3. Creating best vs worst diseases comparison...")
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(20, 8))

# Best diseases
best_diseases = class_accuracies[:20]
diseases_best = [d[:30] for d, _, _ in best_diseases]
accs_best = [acc*100 for _, acc, _ in best_diseases]

ax1.barh(range(len(diseases_best)), accs_best, color='green', alpha=0.7)
ax1.set_yticks(range(len(diseases_best)))
ax1.set_yticklabels(diseases_best, fontsize=9)
ax1.set_xlabel('Accuracy (%)', fontsize=12)
ax1.set_title('Top 20 Best Predicted Diseases', fontsize=14)
ax1.set_xlim(0, 100)
ax1.grid(axis='x', alpha=0.3)
ax1.invert_yaxis()

# Worst diseases
worst_diseases = class_accuracies[-20:]
diseases_worst = [d[:30] for d, _, _ in worst_diseases]
accs_worst = [acc*100 for _, acc, _ in worst_diseases]

ax2.barh(range(len(diseases_worst)), accs_worst, color='red', alpha=0.7)
ax2.set_yticks(range(len(diseases_worst)))
ax2.set_yticklabels(diseases_worst, fontsize=9)
ax2.set_xlabel('Accuracy (%)', fontsize=12)
ax2.set_title('Top 20 Most Challenging Diseases', fontsize=14)
ax2.set_xlim(0, 100)
ax2.grid(axis='x', alpha=0.3)
ax2.invert_yaxis()

plt.tight_layout()
plt.savefig('best_vs_worst_diseases.png', dpi=300, bbox_inches='tight')
print("   Saved: best_vs_worst_diseases.png")
plt.close()

# 4. Accuracy by sample size
print("\n4. Creating accuracy vs sample size plot...")
sample_sizes = [count for _, _, count in class_accuracies]
accuracies_by_size = [acc*100 for _, acc, _ in class_accuracies]

plt.figure(figsize=(12, 6))
plt.scatter(sample_sizes, accuracies_by_size, alpha=0.5, s=30, color='blue')
plt.xlabel('Number of Test Samples', fontsize=12)
plt.ylabel('Per-Class Accuracy (%)', fontsize=12)
plt.title('Accuracy vs Sample Size (XGBoost Model)', fontsize=14)
plt.grid(alpha=0.3)

# Add trend line
z = np.polyfit(sample_sizes, accuracies_by_size, 1)
p = np.poly1d(z)
plt.plot(sorted(sample_sizes), p(sorted(sample_sizes)), "r--", alpha=0.8, linewidth=2, label='Trend')
plt.legend()

plt.tight_layout()
plt.savefig('accuracy_vs_sample_size.png', dpi=300, bbox_inches='tight')
print("   Saved: accuracy_vs_sample_size.png")
plt.close()

# 5. Confusion matrix summary statistics
print("\n5. Creating summary statistics visualization...")
fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(16, 12))

# Pie chart: Correct vs Incorrect
ax1.pie([correct_predictions, incorrect_predictions], 
        labels=['Correct', 'Incorrect'],
        autopct='%1.1f%%',
        colors=['green', 'red'],
        startangle=90)
ax1.set_title(f'Overall Accuracy: {accuracy*100:.2f}%', fontsize=14)

# Bar chart: Accuracy ranges
accuracy_ranges = {
    '90-100%': sum(1 for _, acc, _ in class_accuracies if acc >= 0.9),
    '80-90%': sum(1 for _, acc, _ in class_accuracies if 0.8 <= acc < 0.9),
    '70-80%': sum(1 for _, acc, _ in class_accuracies if 0.7 <= acc < 0.8),
    '60-70%': sum(1 for _, acc, _ in class_accuracies if 0.6 <= acc < 0.7),
    '<60%': sum(1 for _, acc, _ in class_accuracies if acc < 0.6)
}

ax2.bar(accuracy_ranges.keys(), accuracy_ranges.values(), color='skyblue', edgecolor='black')
ax2.set_xlabel('Accuracy Range', fontsize=12)
ax2.set_ylabel('Number of Diseases', fontsize=12)
ax2.set_title('Distribution of Diseases by Accuracy Range', fontsize=14)
ax2.grid(axis='y', alpha=0.3)

# Box plot: Accuracy distribution
ax3.boxplot(accuracies, vert=True, patch_artist=True,
            boxprops=dict(facecolor='lightblue', color='blue'),
            medianprops=dict(color='red', linewidth=2),
            whiskerprops=dict(color='blue'),
            capprops=dict(color='blue'))
ax3.set_ylabel('Accuracy', fontsize=12)
ax3.set_title('Accuracy Distribution (Box Plot)', fontsize=14)
ax3.grid(axis='y', alpha=0.3)
ax3.set_xticklabels(['All Diseases'])

# Text summary
summary_text = f"""
CONFUSION MATRIX SUMMARY

Total Diseases: {len(label_encoder_saved.classes_)}
Total Test Samples: {total_predictions:,}

Overall Accuracy: {accuracy*100:.2f}%
Mean Per-Class Accuracy: {np.mean(accuracies)*100:.2f}%
Median Per-Class Accuracy: {np.median(accuracies)*100:.2f}%

Best Disease Accuracy: {max(accuracies)*100:.2f}%
Worst Disease Accuracy: {min(accuracies)*100:.2f}%

Diseases with >90% accuracy: {accuracy_ranges['90-100%']}
Diseases with >80% accuracy: {accuracy_ranges['90-100%'] + accuracy_ranges['80-90%']}
Diseases with <60% accuracy: {accuracy_ranges['<60%']}
"""

ax4.text(0.1, 0.5, summary_text, fontsize=11, family='monospace',
         verticalalignment='center', bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.5))
ax4.axis('off')

plt.tight_layout()
plt.savefig('confusion_matrix_summary.png', dpi=300, bbox_inches='tight')
print("   Saved: confusion_matrix_summary.png")
plt.close()

# Save detailed report
print("\n6. Saving detailed classification report...")
y_test_names = label_encoder_saved.inverse_transform(y_test)
y_pred_names = label_encoder_saved.inverse_transform(y_pred)

report = classification_report(y_test_names, y_pred_names, output_dict=True, zero_division=0)
report_df = pd.DataFrame(report).transpose()
report_df.to_csv('classification_report.csv')
print("   Saved: classification_report.csv")

# Save confusion matrix data
print("\n7. Saving confusion matrix data...")
cm_df = pd.DataFrame(cm, 
                     index=label_encoder_saved.classes_, 
                     columns=label_encoder_saved.classes_)
cm_df.to_csv('confusion_matrix_full.csv')
print("   Saved: confusion_matrix_full.csv")

# Final summary
print("\n" + "=" * 70)
print("CONFUSION MATRIX GENERATION COMPLETE!")
print("=" * 70)

print("\nGenerated Files:")
print("   1. confusion_matrix_top50.png - Heatmap of top 50 diseases")
print("   2. accuracy_distribution.png - Distribution of per-class accuracy")
print("   3. best_vs_worst_diseases.png - Top 20 best and worst diseases")
print("   4. accuracy_vs_sample_size.png - Accuracy correlation with sample size")
print("   5. confusion_matrix_summary.png - Summary statistics")
print("   6. classification_report.csv - Detailed metrics per disease")
print("   7. confusion_matrix_full.csv - Full confusion matrix data")

print("\nKey Insights:")
print(f"   - Overall accuracy: {accuracy*100:.2f}%")
print(f"   - {accuracy_ranges['90-100%']} diseases with >90% accuracy")
print(f"   - {accuracy_ranges['<60%']} diseases need improvement")
print(f"   - Most common misclassification: {misclassifications[0][0]} -> {misclassifications[0][1]}")

print("\n" + "=" * 70)

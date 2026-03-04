import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import LinearSVC
from sklearn.metrics import accuracy_score, classification_report
import pickle

# Load dataset
df = pd.read_csv("filtered_top100_dataset.csv")

X = df.drop("prognosis", axis=1)
y = df["prognosis"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ------------------------------
# RANDOM FOREST
# ------------------------------
rf_model = RandomForestClassifier(n_estimators=100)
rf_model.fit(X_train, y_train)
rf_pred = rf_model.predict(X_test)
rf_acc = accuracy_score(y_test, rf_pred)

print("\n===== RANDOM FOREST =====")
print("Accuracy:", rf_acc)

# ------------------------------
# NAIVE BAYES
# ------------------------------
nb_model = GaussianNB()
nb_model.fit(X_train, y_train)
nb_pred = nb_model.predict(X_test)
nb_acc = accuracy_score(y_test, nb_pred)

print("\n===== NAIVE BAYES =====")
print("Accuracy:", nb_acc)

# ------------------------------
# SVM (LINEAR)
# ------------------------------
svm_model = LinearSVC()
svm_model.fit(X_train, y_train)
svm_pred = svm_model.predict(X_test)
svm_acc = accuracy_score(y_test, svm_pred)

print("\n===== SVM (Linear) =====")
print("Accuracy:", svm_acc)

# ------------------------------
# SAVE BEST MODEL
# ------------------------------
best_model = nb_model
pickle.dump(best_model, open("model.pkl", "wb"))

print("\nBest model (Naive Bayes) saved successfully!")


import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix

# ------------------------------
# CONFUSION MATRIX
# ------------------------------

# Predict using best model (Naive Bayes)
y_pred = nb_model.predict(X_test)

# Generate confusion matrix
cm = confusion_matrix(y_test, y_pred)

print("\nConfusion Matrix shape:", cm.shape)

# Plot only first 10 classes for readability
labels = y_test.unique()[:10]
cm_small = confusion_matrix(
    y_test[y_test.isin(labels)],
    y_pred[y_test.isin(labels)],
    labels=labels
)

plt.figure(figsize=(10,8))
sns.heatmap(cm_small, annot=False, cmap="Blues",
            xticklabels=labels,
            yticklabels=labels)

plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix (Top 10 Diseases)")
plt.tight_layout()
plt.savefig("confusion_matrix.png")
plt.show()

print("\nConfusion matrix image saved as confusion_matrix.png")
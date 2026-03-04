# 🤖 AI Model Setup Guide

## Important Note

The trained model files (`model.pkl`, `label_encoder.pkl`, `feature_columns.pkl`) and the dataset (`Final_Augmented_dataset_Diseases_and_Symptoms.csv`) are **not included in the repository** due to their large size (>100MB each).

You need to either:
1. **Train the model yourself** (recommended)
2. **Download pre-trained model** (if available)
3. **Use a smaller dataset** for testing

---

## Option 1: Train the Model Yourself (Recommended)

### Step 1: Get the Dataset

You have two options:

**A. Use the full dataset** (recommended for production):
- Download from: [Kaggle - Disease Symptom Dataset](https://www.kaggle.com/)
- Or use your own medical dataset
- Place it in `backend/` folder as `Final_Augmented_dataset_Diseases_and_Symptoms.csv`

**B. Use a smaller dataset** (for testing):
- The repository includes `filtered_top100_dataset.csv` (75MB)
- This has 100 diseases instead of 677
- Lower accuracy but faster training

### Step 2: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

Make sure you have:
- Python 3.11+
- xgboost
- scikit-learn
- pandas
- numpy

### Step 3: Train the Model

```bash
cd backend
python train_model_xgboost.py
```

This will:
- Load the dataset
- Filter rare diseases (< 10 samples)
- Train both Random Forest and XGBoost
- Select the best model (usually XGBoost)
- Save three files:
  - `model.pkl` (trained model)
  - `label_encoder.pkl` (disease encoder)
  - `feature_columns.pkl` (symptom list)

**Training Time**: 
- Full dataset: ~40 minutes
- Smaller dataset: ~5 minutes

**Expected Accuracy**:
- Full dataset: 83.63%
- Smaller dataset: ~75%

### Step 4: Verify Model

```bash
python test_new_model.py
```

This will test the model and show:
- Number of symptoms loaded
- Number of diseases
- Sample predictions

---

## Option 2: Download Pre-trained Model

If available, download the pre-trained model files:

1. Download these files:
   - `model.pkl` (319 MB)
   - `label_encoder.pkl` (10 KB)
   - `feature_columns.pkl` (8 KB)

2. Place them in the `backend/` folder

3. Verify:
```bash
cd backend
python -c "import pickle; model = pickle.load(open('model.pkl', 'rb')); print(f'Model loaded: {len(model.classes_)} diseases')"
```

---

## Option 3: Use Smaller Dataset (Quick Start)

For quick testing without the full dataset:

### Step 1: Use Included Dataset

The repository includes `filtered_top100_dataset.csv` with 100 diseases.

### Step 2: Modify Training Script

Edit `train_model_xgboost.py`:

```python
# Change this line:
df = pd.read_csv("Final_Augmented_dataset_Diseases_and_Symptoms.csv")

# To this:
df = pd.read_csv("filtered_top100_dataset.csv")
```

### Step 3: Train

```bash
python train_model_xgboost.py
```

**Note**: This will have lower accuracy (~75%) but is good for testing.

---

## Troubleshooting

### Error: "File not found"
- Make sure the dataset CSV file is in the `backend/` folder
- Check the filename matches exactly

### Error: "Out of memory"
- Use a smaller dataset
- Close other applications
- Increase system RAM if possible

### Error: "Module not found"
- Install missing dependencies: `pip install -r requirements.txt`
- Make sure virtual environment is activated

### Low Accuracy
- Use the full dataset (246,945 samples)
- Ensure diseases have at least 10 samples each
- Check data quality

---

## Model Files Explanation

### model.pkl (319 MB)
- The trained XGBoost classifier
- Contains 200 decision trees
- Trained on 197,209 samples
- Predicts 677 diseases

### label_encoder.pkl (10 KB)
- Maps disease names to numeric labels
- Required for predictions
- Contains 677 disease names

### feature_columns.pkl (8 KB)
- List of 377 symptom names
- Defines input features
- Must match training data

---

## Dataset Format

Your dataset should be a CSV file with:
- **Columns**: 377 symptom columns + 1 'prognosis' column
- **Rows**: Disease samples (one per row)
- **Values**: 0 or 1 (symptom absent/present)
- **Example**:

```csv
fever,cough,headache,...,prognosis
1,1,0,...,Common Cold
0,1,1,...,Flu
...
```

---

## Performance Expectations

### Full Dataset (246,945 samples, 677 diseases)
- **Training Time**: ~40 minutes
- **Model Size**: 319 MB
- **Accuracy**: 83.63%
- **Memory Required**: 8 GB RAM

### Smaller Dataset (100 diseases)
- **Training Time**: ~5 minutes
- **Model Size**: ~50 MB
- **Accuracy**: ~75%
- **Memory Required**: 2 GB RAM

---

## After Training

Once you have the model files:

1. **Start the backend**:
```bash
cd backend
python main.py
```

2. **Verify model loaded**:
Check console output for:
```
Model loaded: 677 diseases, 377 symptoms
```

3. **Test predictions**:
```bash
python test_new_model.py
```

4. **Generate confusion matrix** (optional):
```bash
python generate_confusion_matrix.py
```

---

## Alternative: Use Git LFS

If you want to include large files in Git:

1. **Install Git LFS**:
```bash
git lfs install
```

2. **Track large files**:
```bash
git lfs track "backend/*.pkl"
git lfs track "backend/*.csv"
```

3. **Commit and push**:
```bash
git add .gitattributes
git add backend/model.pkl backend/label_encoder.pkl backend/feature_columns.pkl
git commit -m "Add model files with Git LFS"
git push
```

**Note**: GitHub LFS has storage limits and may incur costs.

---

## Need Help?

- Check [XGBOOST_UPGRADE_COMPLETE.md](XGBOOST_UPGRADE_COMPLETE.md) for detailed model information
- See [CONFUSION_MATRIX_ANALYSIS.md](CONFUSION_MATRIX_ANALYSIS.md) for performance analysis
- Open an issue on GitHub for support

---

## Quick Start Summary

```bash
# 1. Clone repository
git clone https://github.com/skulllord/Eswatya-Ai-Health-Care-And-Appointment-System.git
cd Eswatya-Ai-Health-Care-And-Appointment-System

# 2. Setup backend
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 3. Train model (or download dataset first)
python train_model_xgboost.py

# 4. Initialize database
python init_db.py

# 5. Start backend
python main.py

# 6. In new terminal, setup frontend
cd frontend
npm install
npm run dev

# 7. Open http://localhost:5173
```

---

**Status**: Ready to train | **Expected Accuracy**: 83.63% | **Training Time**: ~40 min

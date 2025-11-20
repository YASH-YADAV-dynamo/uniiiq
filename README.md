# Uniiq - College Admission Prediction System

## Project Outline

It is a web application that predicts a student's chances of admission to universities based on their academic profile, test scores, extracurricular activities, and preferences. The system uses weighted vector calculations and machine learning techniques to provide personalized university recommendations and admission probability scores.

## Mathematical Calculation Reference

For detailed mathematical calculations and formulas used in the scoring algorithm, refer to:
[Mathematical Calculations Reference](https://drive.google.com/file/d/1kdXRsLiwvbRLpztPLh5r5qcdOOan8hze/view?usp=sharing)

## Weighted Vector Logic

The system employs a weighted vector approach to calculate admission scores by assigning different weights to various factors:

- **Academic Factors**: SAT scores, GPA, subject grades
- **Profile Factors**: Extracurricular activities, awards, standardized tests
- **Fit Factors**: Major alignment, location preference, budget compatibility

Each category has sub-weights that sum to 1.0, and category weights determine the overall contribution of each factor group to the final score. The weighted vector calculation uses dot product and cosine similarity to match student profiles with university requirements.

## Libraries Used

- **simple-statistics**: Provides statistical functions (mean, standard deviation, min, max) for data normalization and score calculations
- **Next.js**: React framework for building the web application
- **Supabase**: Backend-as-a-Service for database and authentication
- **College Scorecard API**: External API for fetching university data and programs

These libraries solve the score calculation problem by:
- Normalizing student data using statistical methods (Min-Max, Z-Score normalization)
- Performing weighted calculations to combine multiple factors
- Fetching real-time university data for accurate matching
- Storing and retrieving student profiles and preferences

## Research References

The mathematical models and algorithms are based on research from:

1. [College Admission Prediction Using Machine Learning](https://www.jetir.org/papers/JETIR2311129.pdf)
2. [A University Admission Prediction System using Machine Learning and Deep Neural Networks](https://www.ijcrt.org/papers/IJCRT24A4920.pdf)
3. [Multi-Criteria Decision Making in Education](https://journals.tultech.eu/index.php/qr/article/view/195)
4. [Decision Making in College Admissions](https://becarispublishing.com/doi/10.2217/cer-2018-0102)
5. [Multi-Criteria Decision Analysis (MCDA)](https://www.1000minds.com/decision-making/what-is-mcdm-mcda)

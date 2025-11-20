import { WeightVector } from "./college-predictor";

/**
 * Predefined weight presets for different admission scenarios
 */

// Academic-focused: Emphasizes SAT, GPA, and academic performance
export const ACADEMIC_FOCUSED_WEIGHTS: Partial<WeightVector> = {
  academic: {
    sat_score: 0.40,
    cgpa: 0.35,
    subject_grades: 0.25
  },
  profile: {
    extracurriculars: 0.05,
    awards: 0.03,
    standardized_tests: 0.02
  },
  fit: {
    major_alignment: 0.05,
    location_match: 0.02,
    budget_compatibility: 0.03
  }
};

// Holistic: Balanced approach considering all factors
export const HOLISTIC_WEIGHTS: Partial<WeightVector> = {
  academic: {
    sat_score: 0.25,
    cgpa: 0.20,
    subject_grades: 0.15
  },
  profile: {
    extracurriculars: 0.10,
    awards: 0.08,
    standardized_tests: 0.07
  },
  fit: {
    major_alignment: 0.08,
    location_match: 0.04,
    budget_compatibility: 0.03
  }
};

// Profile-focused: Emphasizes extracurriculars, awards, and activities
export const PROFILE_FOCUSED_WEIGHTS: Partial<WeightVector> = {
  academic: {
    sat_score: 0.15,
    cgpa: 0.15,
    subject_grades: 0.10
  },
  profile: {
    extracurriculars: 0.20,
    awards: 0.15,
    standardized_tests: 0.10
  },
  fit: {
    major_alignment: 0.10,
    location_match: 0.03,
    budget_compatibility: 0.02
  }
};

// Fit-focused: Emphasizes major alignment, location, and budget
export const FIT_FOCUSED_WEIGHTS: Partial<WeightVector> = {
  academic: {
    sat_score: 0.15,
    cgpa: 0.15,
    subject_grades: 0.10
  },
  profile: {
    extracurriculars: 0.08,
    awards: 0.05,
    standardized_tests: 0.05
  },
  fit: {
    major_alignment: 0.20,
    location_match: 0.12,
    budget_compatibility: 0.10
  }
};

// Category weight presets
export const CATEGORY_WEIGHTS = {
  ACADEMIC_HEAVY: { academic: 0.70, profile: 0.20, fit: 0.10 },
  BALANCED: { academic: 0.60, profile: 0.25, fit: 0.15 },
  PROFILE_HEAVY: { academic: 0.40, profile: 0.40, fit: 0.20 },
  FIT_HEAVY: { academic: 0.40, profile: 0.20, fit: 0.40 }
};


import { mean, standardDeviation, min, max } from 'simple-statistics';

interface StudentData {
  sat_score: number;
  cgpa: number;
  subject_grades?: number;
  extracurriculars: string[];
  awards?: number;
  standardized_tests?: number;
  intended_major: string;
  location_preference?: string;
  budget?: number;
  min_budget?: number;
  max_budget?: number;
}

interface CollegeData {
  name: string;
  sat_requirement?: number;
  gpa_requirement?: number;
  avg_sat?: number;
  avg_gpa?: number;
  avg_extracurriculars?: number;
  majors?: string[];
  location?: string;
  tuition?: number;
  state?: string;
  city?: string;
}

interface ScoredCollege {
  college: CollegeData;
  score: number;
  breakdown: {
    academic: number;
    profile: number;
    fit: number;
  };
}

export interface WeightVector {
  academic: {
    sat_score: number;
    cgpa: number;
    subject_grades: number;
  };
  profile: {
    extracurriculars: number;
    awards: number;
    standardized_tests: number;
  };
  fit: {
    major_alignment: number;
    location_match: number;
    budget_compatibility: number;
  };
}

export class CollegePredictor {
  private weights: WeightVector;
  private categoryWeights: {
    academic: number;
    profile: number;
    fit: number;
  };

  constructor(customWeights?: Partial<WeightVector>, categoryWeights?: { academic?: number; profile?: number; fit?: number }) {
    // Default weights
    this.weights = {
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

    // Merge custom weights if provided
    if (customWeights) {
      if (customWeights.academic) {
        this.weights.academic = { ...this.weights.academic, ...customWeights.academic };
      }
      if (customWeights.profile) {
        this.weights.profile = { ...this.weights.profile, ...customWeights.profile };
      }
      if (customWeights.fit) {
        this.weights.fit = { ...this.weights.fit, ...customWeights.fit };
      }
    }

    // Normalize weights to ensure they sum to 1
    this.normalizeWeights();

    // Category weights (how much each category contributes)
    this.categoryWeights = {
      academic: categoryWeights?.academic ?? 0.60,
      profile: categoryWeights?.profile ?? 0.25,
      fit: categoryWeights?.fit ?? 0.15
    };

    // Normalize category weights
    const totalCategoryWeight = this.categoryWeights.academic + this.categoryWeights.profile + this.categoryWeights.fit;
    if (totalCategoryWeight !== 1) {
      this.categoryWeights.academic /= totalCategoryWeight;
      this.categoryWeights.profile /= totalCategoryWeight;
      this.categoryWeights.fit /= totalCategoryWeight;
    }
  }

  // Normalize weights within each category to sum to 1
  private normalizeWeights(): void {
    // Normalize academic weights
    const academicSum = this.weights.academic.sat_score + this.weights.academic.cgpa + this.weights.academic.subject_grades;
    if (academicSum > 0) {
      this.weights.academic.sat_score /= academicSum;
      this.weights.academic.cgpa /= academicSum;
      this.weights.academic.subject_grades /= academicSum;
    }

    // Normalize profile weights
    const profileSum = this.weights.profile.extracurriculars + this.weights.profile.awards + this.weights.profile.standardized_tests;
    if (profileSum > 0) {
      this.weights.profile.extracurriculars /= profileSum;
      this.weights.profile.awards /= profileSum;
      this.weights.profile.standardized_tests /= profileSum;
    }

    // Normalize fit weights
    const fitSum = this.weights.fit.major_alignment + this.weights.fit.location_match + this.weights.fit.budget_compatibility;
    if (fitSum > 0) {
      this.weights.fit.major_alignment /= fitSum;
      this.weights.fit.location_match /= fitSum;
      this.weights.fit.budget_compatibility /= fitSum;
    }
  }

  // Calculate weighted vector dot product
  private calculateWeightedVectorDotProduct(values: number[], weights: number[]): number {
    if (values.length !== weights.length) {
      throw new Error("Values and weights arrays must have the same length");
    }
    
    let dotProduct = 0;
    for (let i = 0; i < values.length; i++) {
      dotProduct += values[i] * weights[i];
    }
    
    return dotProduct;
  }

  // Calculate vector magnitude
  private calculateVectorMagnitude(vector: number[]): number {
    return Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  }

  // Calculate cosine similarity (for vector-based matching)
  private calculateCosineSimilarity(vectorA: number[], vectorB: number[]): number {
    if (vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
  }

  // Min-Max Normalization
  private minMaxNormalize(value: number, minVal: number, maxVal: number): number {
    if (maxVal === minVal) return 0;
    return (value - minVal) / (maxVal - minVal);
  }

  // Z-Score Normalization
  private zScoreNormalize(value: number, meanVal: number, stdDev: number): number {
    if (stdDev === 0) return 0;
    return (value - meanVal) / stdDev;
  }

  // Calculate mean
  private calculateMean(values: number[]): number {
    if (values.length === 0) return 0;
    return mean(values);
  }

  // Calculate standard deviation
  private calculateStdDev(values: number[]): number {
    if (values.length === 0) return 0;
    try {
      return standardDeviation(values);
    } catch {
      return 0;
    }
  }

  // Match SAT requirement
  private matchSATRequirement(college: CollegeData, normalizedStudent: any): number {
    if (!college.avg_sat || !normalizedStudent.sat_score) return 0.5;
    const studentSAT = normalizedStudent.sat_score * 1600 + 400; // Denormalize
    const diff = Math.abs(studentSAT - college.avg_sat);
    const maxDiff = 400;
    return Math.max(0, 1 - (diff / maxDiff));
  }

  // Match GPA requirement
  private matchGPARequirement(college: CollegeData, normalizedStudent: any): number {
    if (!college.avg_gpa || !normalizedStudent.cgpa) return 0.5;
    const studentGPA = normalizedStudent.cgpa * 4.0; // Denormalize
    const diff = Math.abs(studentGPA - college.avg_gpa);
    const maxDiff = 1.0;
    return Math.max(0, 1 - (diff / maxDiff));
  }

  // Calculate major alignment
  private calculateMajorAlignment(intendedMajor: string, colleges: CollegeData[]): number {
    if (!intendedMajor) return 0.5;
    const majorLower = intendedMajor.toLowerCase();
    const hasMajor = colleges.some(c => 
      c.majors?.some(m => m.toLowerCase().includes(majorLower))
    );
    return hasMajor ? 1.0 : 0.5;
  }

  // Calculate major fit for specific college
  private calculateMajorFit(college: CollegeData, normalizedStudent: any): number {
    if (!normalizedStudent.intended_major || !college.majors) return 0.5;
    const majorLower = normalizedStudent.intended_major.toLowerCase();
    const hasMajor = college.majors.some(m => m.toLowerCase().includes(majorLower));
    return hasMajor ? 1.0 : 0.3;
  }

  // Calculate location match
  private calculateLocationMatch(college: CollegeData, normalizedStudent: any): number {
    if (!normalizedStudent.location_preference || !college.state) return 0.5;
    const prefLower = normalizedStudent.location_preference.toLowerCase();
    const stateLower = college.state.toLowerCase();
    return prefLower === stateLower ? 1.0 : 0.5;
  }

  // Calculate budget fit
  private calculateBudgetFit(college: CollegeData, normalizedStudent: any): number {
    if (!college.tuition || !normalizedStudent.budget) return 0.5;
    if (college.tuition <= normalizedStudent.budget) return 1.0;
    const diff = college.tuition - normalizedStudent.budget;
    const maxDiff = normalizedStudent.budget * 0.5; // 50% over budget
    return Math.max(0, 1 - (diff / maxDiff));
  }

  // Normalize student data
  normalizeStudentData(studentData: StudentData, colleges: CollegeData[]): any {
    const normalized: any = {};
    
    // Academic factors (Min-Max)
    normalized.sat_score = this.minMaxNormalize(
      studentData.sat_score || 0, 400, 1600
    );
    normalized.cgpa = this.minMaxNormalize(
      studentData.cgpa || 0, 0, 4.0
    );
    normalized.subject_grades = studentData.subject_grades || 0.5;
    
    // Profile factors (Z-Score for outlier handling)
    const ecCounts = colleges
      .map(c => c.avg_extracurriculars || 5)
      .filter(c => c > 0);
    
    if (ecCounts.length > 0) {
      const ecMean = this.calculateMean(ecCounts);
      const ecStdDev = this.calculateStdDev(ecCounts) || 1;
      normalized.extracurriculars = this.zScoreNormalize(
        studentData.extracurriculars?.length || 0,
        ecMean,
        ecStdDev
      );
      // Normalize Z-score to 0-1 range
      normalized.extracurriculars = this.minMaxNormalize(
        normalized.extracurriculars,
        -2,
        2
      );
    } else {
      normalized.extracurriculars = 0.5;
    }
    
    normalized.awards = studentData.awards ? this.minMaxNormalize(studentData.awards, 0, 10) : 0.5;
    normalized.standardized_tests = studentData.standardized_tests ? this.minMaxNormalize(studentData.standardized_tests, 0, 5) : 0.5;
    
    // Fit factors
    normalized.intended_major = studentData.intended_major || '';
    normalized.location_preference = studentData.location_preference || '';
    normalized.budget = studentData.budget || 0;
    normalized.min_budget = studentData.min_budget || 0;
    normalized.max_budget = studentData.max_budget || 100000;
    
    normalized.major_alignment = this.calculateMajorAlignment(
      studentData.intended_major || '',
      colleges
    );
    
    normalized.budget_compatibility = studentData.budget 
      ? this.minMaxNormalize(
          studentData.budget,
          studentData.min_budget || 0,
          studentData.max_budget || 100000
        )
      : 0.5;
    
    return normalized;
  }

  // Calculate weighted score for each college using weighted vectors
  calculateCollegeScore(college: CollegeData, normalizedStudent: any): ScoredCollege {
    // Academic vector: [SAT match, GPA match, subject grades]
    const academicValues = [
      this.matchSATRequirement(college, normalizedStudent),
      this.matchGPARequirement(college, normalizedStudent),
      normalizedStudent.subject_grades || 0.5
    ];
    const academicWeights = [
      this.weights.academic.sat_score,
      this.weights.academic.cgpa,
      this.weights.academic.subject_grades
    ];
    
    // Calculate weighted academic score using vector dot product
    const academicScore = this.calculateWeightedVectorDotProduct(academicValues, academicWeights);
    
    // Profile vector: [extracurriculars, awards, standardized_tests]
    const profileValues = [
      normalizedStudent.extracurriculars || 0.5,
      normalizedStudent.awards || 0.5,
      normalizedStudent.standardized_tests || 0.5
    ];
    const profileWeights = [
      this.weights.profile.extracurriculars,
      this.weights.profile.awards,
      this.weights.profile.standardized_tests
    ];
    
    // Calculate weighted profile score using vector dot product
    const profileScore = this.calculateWeightedVectorDotProduct(profileValues, profileWeights);
    
    // Fit vector: [major alignment, location match, budget compatibility]
    const fitValues = [
      this.calculateMajorFit(college, normalizedStudent),
      this.calculateLocationMatch(college, normalizedStudent),
      this.calculateBudgetFit(college, normalizedStudent)
    ];
    const fitWeights = [
      this.weights.fit.major_alignment,
      this.weights.fit.location_match,
      this.weights.fit.budget_compatibility
    ];
    
    // Calculate weighted fit score using vector dot product
    const fitScore = this.calculateWeightedVectorDotProduct(fitValues, fitWeights);
    
    // Apply category weights to get final weighted score
    const totalScore = 
      this.categoryWeights.academic * academicScore +
      this.categoryWeights.profile * profileScore +
      this.categoryWeights.fit * fitScore;
    
    // Convert to percentage (0-100)
    const scorePercentage = Math.round(totalScore * 100);
    
    return {
      college: college,
      score: scorePercentage,
      breakdown: {
        academic: Math.round(academicScore * 100),
        profile: Math.round(profileScore * 100),
        fit: Math.round(fitScore * 100)
      }
    };
  }

  // Alternative method using cosine similarity for vector-based matching
  calculateCollegeScoreWithCosineSimilarity(college: CollegeData, normalizedStudent: any): ScoredCollege {
    // Create feature vectors for student and college
    const studentVector = [
      normalizedStudent.sat_score || 0,
      normalizedStudent.cgpa || 0,
      normalizedStudent.subject_grades || 0,
      normalizedStudent.extracurriculars || 0,
      normalizedStudent.awards || 0,
      normalizedStudent.standardized_tests || 0,
      this.calculateMajorFit(college, normalizedStudent),
      this.calculateLocationMatch(college, normalizedStudent),
      this.calculateBudgetFit(college, normalizedStudent)
    ];

    const collegeVector = [
      this.matchSATRequirement(college, normalizedStudent),
      this.matchGPARequirement(college, normalizedStudent),
      0.7, // Default subject grades match
      normalizedStudent.extracurriculars || 0.5,
      normalizedStudent.awards || 0.5,
      normalizedStudent.standardized_tests || 0.5,
      this.calculateMajorFit(college, normalizedStudent),
      this.calculateLocationMatch(college, normalizedStudent),
      this.calculateBudgetFit(college, normalizedStudent)
    ];

    // Calculate cosine similarity
    const cosineSimilarity = this.calculateCosineSimilarity(studentVector, collegeVector);
    
    // Convert to percentage (0-100)
    const scorePercentage = Math.round(cosineSimilarity * 100);

    // Calculate breakdowns
    const academicScore = 
      this.weights.academic.sat_score * this.matchSATRequirement(college, normalizedStudent) +
      this.weights.academic.cgpa * this.matchGPARequirement(college, normalizedStudent) +
      this.weights.academic.subject_grades * (normalizedStudent.subject_grades || 0.5);
    
    const profileScore = 
      this.weights.profile.extracurriculars * (normalizedStudent.extracurriculars || 0.5) +
      this.weights.profile.awards * (normalizedStudent.awards || 0.5) +
      this.weights.profile.standardized_tests * (normalizedStudent.standardized_tests || 0.5);
    
    const fitScore = 
      this.weights.fit.major_alignment * this.calculateMajorFit(college, normalizedStudent) +
      this.weights.fit.location_match * this.calculateLocationMatch(college, normalizedStudent) +
      this.weights.fit.budget_compatibility * this.calculateBudgetFit(college, normalizedStudent);
    
    return {
      college: college,
      score: scorePercentage,
      breakdown: {
        academic: Math.round(academicScore * 100),
        profile: Math.round(profileScore * 100),
        fit: Math.round(fitScore * 100)
      }
    };
  }

  // Get current weights (for inspection/customization)
  getWeights(): WeightVector {
    return { ...this.weights };
  }

  // Update weights dynamically
  updateWeights(newWeights: Partial<WeightVector>): void {
    if (newWeights.academic) {
      this.weights.academic = { ...this.weights.academic, ...newWeights.academic };
    }
    if (newWeights.profile) {
      this.weights.profile = { ...this.weights.profile, ...newWeights.profile };
    }
    if (newWeights.fit) {
      this.weights.fit = { ...this.weights.fit, ...newWeights.fit };
    }
    this.normalizeWeights();
  }

  // Get top N college recommendations
  getTopColleges(studentData: StudentData, colleges: CollegeData[], topN: number = 4): ScoredCollege[] {
    const normalizedStudent = this.normalizeStudentData(studentData, colleges);
    
    const scoredColleges = colleges.map(college => 
      this.calculateCollegeScore(college, normalizedStudent)
    );
    
    // Sort by score descending
    scoredColleges.sort((a, b) => b.score - a.score);
    
    // Return top N
    return scoredColleges.slice(0, topN);
  }
}


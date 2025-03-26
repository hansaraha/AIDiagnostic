import type { UserData, AIUsageData } from '~/types/questionnaire';

export interface ScoringWeights {
  frequency: number;      // Q6  - 12%
  tools: number;         // Q7  - 8%
  versions: number;      // Q8  - 5%
  purposes: number;      // Q9  - 8%
  feeling: number;       // Q10 - 5%
  experience: number;    // Q11 - 5%
  impact: number;        // Q12 - 8%
}

export interface ProfileMetrics {
  implementation: number;
  knowledge: number;
  integration: number;
  value: number;
}

export type AIProfile = 'IA-Curioso' | 'IA-Entusiasta' | 'IA-Táctico' | 'IA-Estratega' | 'IA-Visionario';

export interface ProfileRange {
  min: number;
  max: number;
  metrics: {
    implementation: { min: number; max: number; };
    knowledge: { min: number; max: number; };
    integration: { min: number; max: number; };
    value: { min: number; max: number; };
  };
}

const SCORING_WEIGHTS: ScoringWeights = {
  frequency: 0.12,
  tools: 0.08,
  versions: 0.05,
  purposes: 0.08,
  feeling: 0.05,
  experience: 0.05,
  impact: 0.08
};

const PROFILE_RANGES: Record<AIProfile, ProfileRange> = {
  'IA-Curioso': {
    min: 0,
    max: 20,
    metrics: {
      implementation: { min: 10, max: 30 },
      knowledge: { min: 5, max: 25 },
      integration: { min: 0, max: 20 },
      value: { min: 5, max: 25 }
    }
  },
  'IA-Entusiasta': {
    min: 21,
    max: 40,
    metrics: {
      implementation: { min: 31, max: 55 },
      knowledge: { min: 26, max: 50 },
      integration: { min: 21, max: 45 },
      value: { min: 26, max: 50 }
    }
  },
  'IA-Táctico': {
    min: 41,
    max: 60,
    metrics: {
      implementation: { min: 56, max: 70 },
      knowledge: { min: 51, max: 65 },
      integration: { min: 46, max: 65 },
      value: { min: 51, max: 70 }
    }
  },
  'IA-Estratega': {
    min: 61,
    max: 80,
    metrics: {
      implementation: { min: 71, max: 90 },
      knowledge: { min: 66, max: 85 },
      integration: { min: 66, max: 90 },
      value: { min: 71, max: 85 }
    }
  },
  'IA-Visionario': {
    min: 81,
    max: 100,
    metrics: {
      implementation: { min: 91, max: 98 },
      knowledge: { min: 86, max: 97 },
      integration: { min: 91, max: 98 },
      value: { min: 86, max: 95 }
    }
  }
};

export function useScoring() {
  function calculateFrequencyScore(frequency: AIUsageData['frequency']): number {
    const scores: Record<AIUsageData['frequency'], number> = {
      'daily': 4,
      'weekly': 3,
      'monthly': 2,
      'rarely': 1,
      'never': 0
    };
    return scores[frequency];
  }

  function calculateToolsScore(tools: AIUsageData['tools']): number {
    if (tools.includes('none')) return 0;
    const score = tools.length;
    return Math.min(score, 4); // Cap at 4 points
  }

  function calculateVersionsScore(versions: AIUsageData['versions']): number {
    const scores: Record<AIUsageData['versions'], number> = {
      'paid_only': 4,
      'mostly_paid': 3,
      'mostly_free': 2,
      'free_only': 1,
      'unsure': 0
    };
    return scores[versions];
  }

  function calculatePurposesScore(purposes: AIUsageData['purposes']): number {
    if (purposes.includes('none')) return 0;
    const score = purposes.length;
    return Math.min(score, 4); // Cap at 4 points
  }

  function calculateFeelingScore(feeling: AIUsageData['feeling']): number {
    const scores: Record<AIUsageData['feeling'], number> = {
      'excited': 4,
      'cautious': 3,
      'neutral': 2,
      'anxious': 1,
      'concerned': 0,
      'reluctant': 0
    };
    return scores[feeling];
  }

  function calculateExperienceScore(experience: AIUsageData['experience']): number {
    const scores: Record<AIUsageData['experience'], number> = {
      'very_positive': 4,
      'positive': 3,
      'mixed': 2,
      'negative': 1,
      'no_experience': 0
    };
    return scores[experience];
  }

  function calculateImpactScore(impact: AIUsageData['impact']): number {
    const scores: Record<AIUsageData['impact'], number> = {
      'critical': 4,
      'significant': 3,
      'moderate': 2,
      'minimal': 1,
      'none': 0
    };
    return scores[impact];
  }

  function calculateTotalScore(aiUsage: AIUsageData): number {
    const scores = {
      frequency: calculateFrequencyScore(aiUsage.frequency) * SCORING_WEIGHTS.frequency,
      tools: calculateToolsScore(aiUsage.tools) * SCORING_WEIGHTS.tools,
      versions: calculateVersionsScore(aiUsage.versions) * SCORING_WEIGHTS.versions,
      purposes: calculatePurposesScore(aiUsage.purposes) * SCORING_WEIGHTS.purposes,
      feeling: calculateFeelingScore(aiUsage.feeling) * SCORING_WEIGHTS.feeling,
      experience: calculateExperienceScore(aiUsage.experience) * SCORING_WEIGHTS.experience,
      impact: calculateImpactScore(aiUsage.impact) * SCORING_WEIGHTS.impact
    };

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    return totalScore * 25; // Scale to 0-100
  }

  function determineProfile(score: number): AIProfile {
    if (score <= 20) return 'IA-Curioso';
    if (score <= 40) return 'IA-Entusiasta';
    if (score <= 60) return 'IA-Táctico';
    if (score <= 80) return 'IA-Estratega';
    return 'IA-Visionario';
  }

  function calculateMetrics(score: number, profile: AIProfile): ProfileMetrics {
    const range = PROFILE_RANGES[profile];
    const position = (score - range.min) / (range.max - range.min);

    function interpolate(min: number, max: number): number {
      return min + position * (max - min);
    }

    return {
      implementation: interpolate(range.metrics.implementation.min, range.metrics.implementation.max),
      knowledge: interpolate(range.metrics.knowledge.min, range.metrics.knowledge.max),
      integration: interpolate(range.metrics.integration.min, range.metrics.integration.max),
      value: interpolate(range.metrics.value.min, range.metrics.value.max)
    };
  }

  function generateDiagnostic(userData: UserData) {
    const score = calculateTotalScore(userData.aiUsage);
    const profile = determineProfile(score);
    const metrics = calculateMetrics(score, profile);

    return {
      professionalProfile: profile,
      metrics,
      score,
      strengths: [], // To be implemented based on high scores
      recommendations: [], // To be implemented based on sector and profile
      courses: [], // To be implemented based on sector and profile
      services: [] // To be implemented based on sector and profile
    };
  }

  return {
    calculateTotalScore,
    determineProfile,
    calculateMetrics,
    generateDiagnostic
  };
}

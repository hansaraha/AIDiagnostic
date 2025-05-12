// User data types
export interface UserData {
  id?: string;
  name: string;
  email?: string;
  workStatus?: WorkStatus;
  otherWorkStatus?: string;
  sector?: Sector;
  otherSector?: string;
  aiUsage: AIUsageData;
  diagnostic?: any;
  employee?: {
    role: string;
    aiPolicy: string;
  };
  businessOwner?: BusinessOwnerData;
  freelancer?: FreelancerData;
  aiKnowledgeLevel?: AIKnowledgeLevel;
  marketingPromptChoice?: MarketingPromptChoice;
  aiTrainingInvestment?: AITrainingInvestment;
  aiSavingTime?: AISavingTime;
  aiImprovements?: AIImprovements;
  aiWorkflows?: AIWorkflows;
  aiObjective?: AIObjective;
  aiObstacle?: AIObstacle[];
  aiObstacleOther?: string;
  aiSupportNeed?: AISupportNeed;
}

export type WorkStatus =
  | "freelancer"
  | "business_owner"
  | "full_time"
  | "part_time"
  | "other";

export type Sector =
  | "tech"
  | "design"
  | "marketing"
  | "media"
  | "education"
  | "consulting"
  | "finance"
  | "health"
  | "retail"
  | "manufacturing"
  | "other";

export interface FreelancerData {
  experience: "less_than_1" | "1_to_3" | "4_to_6" | "more_than_6";
  platforms: (
    | "freelance_platforms"
    | "professional_networks"
    | "personal_recommendations"
    | "self_marketing"
    | "other"
  )[];
}

export interface BusinessOwnerData {
  employeeCount: "solo" | "2_5" | "6_20" | "21_50" | "50_plus";
  aiStrategy:
    | "defined"
    | "developing"
    | "unstructured"
    | "none"
    | "not_considered";
}

export interface AIUsageData {
  frequency: AIFrequency;
  tools: AITool[];
  otherTool?: string;
  versions: AIToolVersion;
  purposes: AIPurpose[];
  feeling: AIFeeling;
  experience: AIExperience;
  impact: AIImpact;
}

export type AIFrequency = "daily" | "weekly" | "monthly" | "rarely" | "never";

export type AIToolVersion =
  | "free_only"
  | "mostly_free"
  | "mostly_paid"
  | "paid_only"
  | "unsure";

export type AITool =
  | "chatgpt"
  | "gemini"
  | "claude"
  | "image_ai"
  | "integrated"
  | "sector_specific"
  | "none";

export type AIPurpose =
  | "ideation"
  | "content"
  | "editing"
  | "analysis"
  | "automation"
  | "programming"
  | "research"
  | "learning"
  | "none";

export type AIFeeling =
  | "excited"
  | "cautious"
  | "neutral"
  | "anxious"
  | "concerned"
  | "reluctant";

export type AIExperience =
  | "very_positive"
  | "positive"
  | "mixed"
  | "negative"
  | "no_experience";

export type AIImpact =
  | "critical"
  | "significant"
  | "moderate"
  | "minimal"
  | "none";

export interface WorkStatusOption {
  value: "full_time" | "part_time" | "freelancer" | "business_owner" | "other";
  label: string;
}

export interface FreelancerExperienceOption {
  value: "less_than_1" | "1_to_3" | "4_to_6" | "more_than_6";
  label: string;
}

export interface FreelancerClientsOption {
  value: "1_2" | "3_5" | "6_10" | "more_than_10";
  label: string;
}

export interface FreelancerPlatformOption {
  value:
    | "freelance_platforms"
    | "professional_networks"
    | "personal_recommendations"
    | "self_marketing"
    | "other";
  label: string;
}

export interface BusinessSizeOption {
  value: "solo" | "2_5" | "6_20" | "21_50" | "50_plus";
  label: string;
}

export interface BusinessAgeOption {
  value: "less_than_1" | "1_to_3" | "4_to_6" | "more_than_6";
  label: string;
}

export interface AIStrategy {
  value: "defined" | "developing" | "unstructured" | "none" | "not_considered";
  label: string;
}

export interface BusinessAIPolicyOption {
  value: "formal" | "planned" | "no_plans" | "not_considered";
  label: string;
}

export interface AIFundingOption {
  value: "personal" | "business" | "client" | "free";
  label: string;
}

export interface AIDisclosureOption {
  value: "always" | "sometimes" | "never" | "when_asked";
  label: string;
}

export interface AIInvestmentOption {
  value: "none" | "under_50" | "50_to_100" | "over_100";
  label: string;
}

export interface AIValuePropositionOption {
  value: "yes" | "no" | "working_on_it";
  label: string;
}

export interface AIRateAdjustmentOption {
  value: "increased" | "decreased" | "same" | "case_by_case";
  label: string;
}

export interface AIProjectImpactOption {
  value: "positive" | "negative" | "neutral" | "mixed";
  label: string;
}

export interface ExperienceOption {
  value: "less_than_1" | "1_to_3" | "4_to_6" | "more_than_6";
  label: string;
}

export type AIKnowledgeLevel =
  | "advanced"
  | "intermediate"
  | "basic"
  | "limited"
  | "none";

export type MarketingPromptChoice =
  | '🎯 "Crea una campaña para un producto de belleza dirigido a mujeres de 30-45 años, enfocada en ingredientes naturales. El tono debe ser sofisticado pero accesible. Incluye: titular principal, 3 puntos clave, y llamado a la acción."'
  | '📝 "Necesito una campaña de marketing para un producto de belleza."'
  | '📋 "Escribe contenido de marketing para una crema facial con ingredientes naturales para mujeres."'
  | '📢 "Hazme una publicidad con título, puntos y CTA para un producto de belleza natural para mujeres de mediana edad."'
  | "🤷‍♂️ No estoy seguro / No uso prompts";

export type AITrainingInvestment =
  | "advanced_training"
  | "basic_courses"
  | "self_learning"
  | "not_yet_interested"
  | "not_interested";

export type AISavingTime =
  | "more_than_10"
  | "5_10"
  | "1_5"
  | "less_than_1"
  | "none";

export type AIImprovements =
  | "significant"
  | "some"
  | "no_change"
  | "worse"
  | "not_using";

export type AIWorkflows =
  | "defined"
  | "in_progress"
  | "some_attempts"
  | "improvised"
  | "not_using";

export type AIObjective =
  | "productivity"
  | "quality"
  | "cost"
  | "innovation"
  | "competitiveness"
  | "no_clear_goal";

export type AIObstacle =
  | "lack_skills"
  | "cost"
  | "lack_time"
  | "use_case"
  | "culture"
  | "privacy"
  | "no_obstacle"
  | "other";

export type AISupportNeed =
  | "basic_training"
  | "advanced_prompting"
  | "consulting"
  | "premium_tools"
  | "sector_guides"
  | "community"
  | "not_interested";

// User data types
export interface UserData {
  id?: string; // ID único para tracking
  name: string;
  email?: string;
  workStatus?: WorkStatus;
  otherWorkStatus?: string;
  sector?: Sector;
  otherSector?: string;
  freelancer?: FreelancerData;
  businessOwner?: BusinessOwnerData;
  aiUsage?: AIUsageData;
  diagnostic?: DiagnosticResult;
  referralCode?: string; // Código de referido para tracking
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
  services: (
    | "development"
    | "design"
    | "marketing"
    | "content"
    | "consulting"
    | "education"
    | "translation"
    | "other"
  )[];
  otherService?: string;
  experience: "less_than_1" | "1_to_3" | "4_to_6" | "more_than_6";
  clientsPerMonth: "1_2" | "3_5" | "6_10" | "more_than_10";
  platforms: (
    | "upwork"
    | "fiverr"
    | "freelancer"
    | "toptal"
    | "linkedin"
    | "personal_website"
    | "referrals"
    | "direct_network"
    | "other"
  )[];
  otherPlatform?: string;
  clientAcquisition?:
    | "platforms"
    | "network"
    | "referrals"
    | "marketing"
    | "other"; // Hacer opcional o ajustar según necesidad
}

export interface BusinessOwnerData {
  businessType:
    | "tech_startup"
    | "professional_services"
    | "retail"
    | "manufacturing"
    | "creative_agency"
    | "consulting"
    | "other";
  otherBusinessType?: string;
  employeeCount: "solo" | "2_5" | "6_20" | "21_50" | "50_plus";
  foundingTime: "less_than_1" | "1_to_3" | "4_to_6" | "more_than_6";
  aiPolicy: "formal" | "planned" | "no_plans" | "not_considered";
  aiStrategy?:
    | "defined"
    | "developing"
    | "unstructured"
    | "none"
    | "not_considered"; // Hacer opcional
}

export interface AIUsageData {
  frequency: "daily" | "weekly" | "monthly" | "rarely" | "never";
  tools: AITool[];
  otherTool?: string;
  versions:
    | "free_only"
    | "mostly_free"
    | "mostly_paid"
    | "paid_only"
    | "unsure";
  purposes: AIPurpose[];
  feeling: AIFeeling;
  experience: AIExperience;
  impact: AIImpact;
}

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

export interface DiagnosticResult {
  professionalProfile: string;
  strengths: string[];
  recommendations: string[];
  courses: CourseRecommendation[];
  services: ServiceRecommendation[];
  userId?: string; // ID del usuario en el sistema
  referralCode?: string; // Código único para referir a otros usuarios
}

export interface CourseRecommendation {
  id?: string; // ID de Airtable para referencia
  title: string;
  description: string;
  difficulty: "principiante" | "intermedio" | "avanzado";
  price?: string;
  link?: string;
}

export interface ServiceRecommendation {
  id?: string; // ID de Airtable para referencia
  title: string;
  description: string;
  type: "automatización" | "productividad" | "análisis" | "creatividad";
  price?: string;
  link?: string;
}

export interface ServiceOption {
  value: "development" | "design" | "marketing" | "content";
  label: string;
}

export interface FreelancerServiceOption {
  value:
    | "development"
    | "design"
    | "marketing"
    | "content"
    | "consulting"
    | "education"
    | "translation"
    | "other";
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
    | "upwork"
    | "fiverr"
    | "freelancer"
    | "toptal"
    | "linkedin"
    | "personal_website"
    | "referrals"
    | "direct_network"
    | "other";
  label: string;
}

export interface BusinessTypeOption {
  value:
    | "tech_startup"
    | "professional_services"
    | "retail"
    | "manufacturing"
    | "creative_agency"
    | "consulting"
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

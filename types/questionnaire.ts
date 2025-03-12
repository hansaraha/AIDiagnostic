// User data types
export interface UserData {
  id?: string; // ID único para tracking
  name: string;
  workStatus?: 'employee' | 'freelancer' | 'business_owner' | 'full_time' | 'part_time' | 'other';
  otherWorkStatus?: string;
  services?: ('development' | 'design' | 'marketing' | 'content')[];
  experience?: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
  email?: string;
  freelancer?: FreelancerData;
  businessOwner?: BusinessOwnerData;
  commonAI?: CommonAIData;
  diagnostic?: DiagnosticResult;
  referralCode?: string; // Código de referido para tracking
}

export interface FreelancerData {
  services: ('development' | 'design' | 'marketing' | 'content' | 'consulting' | 'education' | 'translation' | 'other')[];
  otherService?: string;
  experience: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
  clientsPerMonth: '1_2' | '3_5' | '6_10' | 'more_than_10';
  platforms: ('upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'linkedin' | 'personal_website' | 'referrals' | 'direct_network' | 'other')[];
  otherPlatform?: string;
}

export interface BusinessOwnerData {
  businessType: 'tech_startup' | 'professional_services' | 'retail' | 'manufacturing' | 'creative_agency' | 'consulting' | 'other';
  otherBusinessType?: string;
  employeeCount: 'solo' | '2_5' | '6_20' | '21_50' | '50_plus';
  foundingTime: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
  aiPolicy: 'formal' | 'planned' | 'no_plans' | 'not_considered';
}

export interface CommonAIData {
  funding?: 'personal' | 'business' | 'client' | 'free';
  disclosure?: 'always' | 'sometimes' | 'never' | 'when_asked';
  investment?: 'none' | 'under_50' | '50_to_100' | 'over_100';
  valueProposition?: 'yes' | 'no' | 'working_on_it';
  rateAdjustment?: 'increased' | 'decreased' | 'same' | 'case_by_case';
  projectImpact?: 'positive' | 'negative' | 'neutral' | 'mixed';
}

export interface DiagnosticResult {
  professionalProfile: string;
  strengths: string[];
  recommendations: string[];
  courses: CourseRecommendation[];
  services: ServiceRecommendation[];
}

export interface CourseRecommendation {
  id?: string; // ID de Airtable para referencia
  title: string;
  description: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  price?: string;
  link?: string;
}

export interface ServiceRecommendation {
  id?: string; // ID de Airtable para referencia
  title: string;
  description: string;
  type: 'automatización' | 'productividad' | 'análisis' | 'creatividad';
  price?: string;
  link?: string;
}

// Option types for various questions
export interface WorkStatusOption {
  value: 'employee' | 'freelancer' | 'business_owner' | 'full_time' | 'part_time' | 'other';
  label: string;
}

export interface ServiceOption {
  value: 'development' | 'design' | 'marketing' | 'content';
  label: string;
}

export interface FreelancerServiceOption {
  value: 'development' | 'design' | 'marketing' | 'content' | 'consulting' | 'education' | 'translation' | 'other';
  label: string;
}

export interface FreelancerExperienceOption {
  value: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
  label: string;
}

export interface FreelancerClientsOption {
  value: '1_2' | '3_5' | '6_10' | 'more_than_10';
  label: string;
}

export interface FreelancerPlatformOption {
  value: 'upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'linkedin' | 'personal_website' | 'referrals' | 'direct_network' | 'other';
  label: string;
}

export interface BusinessTypeOption {
  value: 'tech_startup' | 'professional_services' | 'retail' | 'manufacturing' | 'creative_agency' | 'consulting' | 'other';
  label: string;
}

export interface BusinessSizeOption {
  value: 'solo' | '2_5' | '6_20' | '21_50' | '50_plus';
  label: string;
}

export interface BusinessAgeOption {
  value: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
  label: string;
}

export interface BusinessAIPolicyOption {
  value: 'formal' | 'planned' | 'no_plans' | 'not_considered';
  label: string;
}

export interface AIFundingOption {
  value: 'personal' | 'business' | 'client' | 'free';
  label: string;
}

export interface AIDisclosureOption {
  value: 'always' | 'sometimes' | 'never' | 'when_asked';
  label: string;
}

export interface AIInvestmentOption {
  value: 'none' | 'under_50' | '50_to_100' | 'over_100';
  label: string;
}

export interface AIValuePropositionOption {
  value: 'yes' | 'no' | 'working_on_it';
  label: string;
}

export interface AIRateAdjustmentOption {
  value: 'increased' | 'decreased' | 'same' | 'case_by_case';
  label: string;
}

export interface AIProjectImpactOption {
  value: 'positive' | 'negative' | 'neutral' | 'mixed';
  label: string;
}

export interface ExperienceOption {
  value: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
  label: string;
}
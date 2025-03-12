import { ref } from 'vue';
import type {
  WorkStatusOption,
  ServiceOption,
  FreelancerServiceOption,
  FreelancerExperienceOption,
  FreelancerClientsOption,
  FreelancerPlatformOption,
  BusinessTypeOption,
  BusinessSizeOption,
  BusinessAgeOption,
  BusinessAIPolicyOption,
  AIFundingOption,
  AIDisclosureOption,
  AIInvestmentOption,
  AIValuePropositionOption,
  AIRateAdjustmentOption,
  AIProjectImpactOption,
  ExperienceOption
} from '~/types/questionnaire';

export default function useOptionsData() {
  // Work Status Options
  const workStatusOptions = ref<WorkStatusOption[]>([
    { value: 'full_time', label: 'Empleado de tiempo completo' },
    { value: 'part_time', label: 'Empleado de tiempo parcial' },
    { value: 'freelancer', label: 'Freelancer/Trabajador independiente' },
    { value: 'business_owner', label: 'Dueño de empresa/Emprendedor' },
    { value: 'other', label: 'Otro' }
  ]);

  // Service Options
  const servicesOptions = ref<ServiceOption[]>([
    { value: 'development', label: 'Desarrollo de software/Programación' },
    { value: 'design', label: 'Diseño/Creatividad' },
    { value: 'marketing', label: 'Marketing digital' },
    { value: 'content', label: 'Redacción/Contenido' }
  ]);

  // Freelancer Service Options
  const freelancerServicesOptions = ref<FreelancerServiceOption[]>([
    { value: 'development', label: 'Desarrollo de software/Programación' },
    { value: 'design', label: 'Diseño/Creatividad' },
    { value: 'marketing', label: 'Marketing digital' },
    { value: 'content', label: 'Redacción/Contenido' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'education', label: 'Educación/Tutorías' },
    { value: 'translation', label: 'Traducción' },
    { value: 'other', label: 'Otro' }
  ]);

  // Freelancer Experience Options
  const freelancerExperienceOptions = ref<FreelancerExperienceOption[]>([
    { value: 'less_than_1', label: 'Menos de 1 año' },
    { value: '1_to_3', label: '1-3 años' },
    { value: '4_to_6', label: '4-6 años' },
    { value: 'more_than_6', label: 'Más de 6 años' }
  ]);

  // Freelancer Clients Options
  const freelancerClientsOptions = ref<FreelancerClientsOption[]>([
    { value: '1_2', label: '1-2 clientes' },
    { value: '3_5', label: '3-5 clientes' },
    { value: '6_10', label: '6-10 clientes' },
    { value: 'more_than_10', label: 'Más de 10 clientes' }
  ]);

  // Freelancer Platforms Options
  const freelancerPlatformsOptions = ref<FreelancerPlatformOption[]>([
    { value: 'upwork', label: 'Upwork' },
    { value: 'fiverr', label: 'Fiverr' },
    { value: 'freelancer', label: 'Freelancer.com' },
    { value: 'toptal', label: 'Toptal' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'direct_network', label: 'Red de contactos directos' },
    { value: 'other', label: 'Otro' }
  ]);

  // Business Type Options
  const businessTypeOptions = ref<BusinessTypeOption[]>([
    { value: 'tech_startup', label: 'Startup tecnológica' },
    { value: 'professional_services', label: 'Empresa de servicios profesionales' },
    { value: 'retail', label: 'Comercio minorista' },
    { value: 'manufacturing', label: 'Empresa de manufactura' },
    { value: 'creative_agency', label: 'Agencia creativa/marketing' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'other', label: 'Otro' }
  ]);

  // Business Size Options
  const businessSizeOptions = ref<BusinessSizeOption[]>([
    { value: 'solo', label: 'Solo yo' },
    { value: '2_5', label: '2-5 empleados' },
    { value: '6_20', label: '6-20 empleados' },
    { value: '21_50', label: '21-50 empleados' },
    { value: '50_plus', label: 'Más de 50 empleados' }
  ]);

  // Business Age Options
  const businessAgeOptions = ref<BusinessAgeOption[]>([
    { value: 'less_than_1', label: 'Menos de 1 año' },
    { value: '1_to_3', label: '1-3 años' },
    { value: '4_to_6', label: '4-6 años' },
    { value: 'more_than_6', label: 'Más de 6 años' }
  ]);

  // Business AI Policy Options
  const businessAIPolicyOptions = ref<BusinessAIPolicyOption[]>([
    { value: 'formal', label: 'Sí, tenemos políticas formales' },
    { value: 'planned', label: 'No, pero planeamos implementarlas' },
    { value: 'no_plans', label: 'No, y no planeamos implementarlas' },
    { value: 'not_considered', label: 'No lo he considerado' }
  ]);

  // AI Funding Options
  const aiFundingOptions = ref<AIFundingOption[]>([
    { value: 'personal', label: 'Pago personal (de mi bolsillo)' },
    { value: 'business', label: 'Gastos de empresa/negocio' },
    { value: 'client', label: 'Facturado a clientes' },
    { value: 'free', label: 'Solo uso herramientas gratuitas' }
  ]);

  // AI Disclosure Options
  const aiDisclosureOptions = ref<AIDisclosureOption[]>([
    { value: 'always', label: 'Siempre informo sobre mi uso de IA' },
    { value: 'sometimes', label: 'A veces, dependiendo del cliente' },
    { value: 'never', label: 'Nunca lo menciono específicamente' },
    { value: 'when_asked', label: 'Solo cuando me preguntan' }
  ]);

  // AI Investment Options
  const aiInvestmentOptions = ref<AIInvestmentOption[]>([
    { value: 'none', label: 'Nada (solo uso herramientas gratuitas)' },
    { value: 'under_50', label: 'Menos de 50€ al mes' },
    { value: '50_to_100', label: 'Entre 50€ y 100€ al mes' },
    { value: 'over_100', label: 'Más de 100€ al mes' }
  ]);

  // AI Value Proposition Options
  const aiValuePropositionOptions = ref<AIValuePropositionOption[]>([
    { value: 'yes', label: 'Sí, he adaptado mi propuesta de valor' },
    { value: 'no', label: 'No, sigo ofreciendo lo mismo' },
    { value: 'working_on_it', label: 'Estoy trabajando en ello' }
  ]);

  // AI Rate Adjustment Options
  const aiRateAdjustmentOptions = ref<AIRateAdjustmentOption[]>([
    { value: 'increased', label: 'He aumentado mis tarifas' },
    { value: 'decreased', label: 'He reducido mis tarifas' },
    { value: 'same', label: 'Mantengo las mismas tarifas' },
    { value: 'case_by_case', label: 'Depende del proyecto' }
  ]);

  // AI Project Impact Options
  const aiProjectImpactOptions = ref<AIProjectImpactOption[]>([
    { value: 'positive', label: 'Impacto muy positivo' },
    { value: 'negative', label: 'Impacto negativo' },
    { value: 'neutral', label: 'Ni positivo ni negativo' },
    { value: 'mixed', label: 'Resultados mixtos' }
  ]);

  // Experience Options
  const experienceOptions = ref<ExperienceOption[]>([
    { value: 'less_than_1', label: 'Menos de 1 año' },
    { value: '1_to_3', label: '1-3 años' },
    { value: '4_to_6', label: '4-6 años' },
    { value: 'more_than_6', label: 'Más de 6 años' }
  ]);

  return {
    workStatusOptions,
    servicesOptions,
    freelancerServicesOptions,
    freelancerExperienceOptions,
    freelancerClientsOptions,
    freelancerPlatformsOptions,
    businessTypeOptions,
    businessSizeOptions,
    businessAgeOptions,
    businessAIPolicyOptions,
    aiFundingOptions,
    aiDisclosureOptions,
    aiInvestmentOptions,
    aiValuePropositionOptions,
    aiRateAdjustmentOptions,
    aiProjectImpactOptions,
    experienceOptions
  };
}
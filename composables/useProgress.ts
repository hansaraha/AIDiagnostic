import { ref, computed } from 'vue';
import type { UserData } from '~/types/questionnaire';

export default function useProgress(userData: Ref<UserData>, currentStep: Ref<string>) {
  // Define sections
  const sections = [
    'SECCIÓN INICIAL: TIPO DE TRABAJADOR',
    'INFORMACIÓN ESPECÍFICA',
    'USO DE IA',
    'ACTITUDES Y PERCEPCIONES',
    'CONOCIMIENTO Y CAPACIDADES',
    'IMPACTO Y RESULTADOS'
  ];
  
  // Define steps by category
  const steps = {
    initial: ['welcome', 'name', 'work_status'],
    freelancer: [
      'freelancer_services',
      'freelancer_experience',
      'freelancer_clients',
      'freelancer_platforms'
    ],
    business: [
      'business_type',
      'business_size',
      'business_age',
      'business_ai_policy'
    ],
    common: [
      'ai_funding',
      'ai_disclosure',
      'ai_investment',
      'ai_value_proposition',
      'ai_rate_adjustment',
      'ai_project_impact',
      'email',
      'analysis',
      'results'
    ]
  };
  
  // Progress percentage
  const progress = ref(0);
  
  // Current section based on the current step
  const currentSection = computed(() => {
    const step = currentStep.value;
    
    if (steps.initial.includes(step)) return sections[0];
    if (step.startsWith('freelancer_')) return sections[1];
    if (step.startsWith('business_')) return sections[1];
    if (step.startsWith('ai_')) {
      if (step === 'ai_funding' || step === 'ai_disclosure' || step === 'ai_investment') return sections[2];
      if (step === 'ai_value_proposition') return sections[3];
      return sections[5];
    }
    if (step === 'email') return sections[2];
    if (step === 'analysis' || step === 'results') return sections[5];
    
    return sections[0];
  });
  
  // Function to update progress
  const updateProgress = () => {
    // Calculate total number of steps based on user path
    let totalSteps = steps.initial.length; // Initial steps are always included
    
    if (userData.value.workStatus === 'freelancer') {
      totalSteps += steps.freelancer.length;
    } else if (userData.value.workStatus === 'business_owner') {
      totalSteps += steps.business.length;
    }
    
    // Common AI questions for everyone
    totalSteps += steps.common.length;
    
    // Calculate current progress
    let completedSteps = 0;
    
    // Count initial steps
    const initialIndex = steps.initial.indexOf(currentStep.value);
    if (initialIndex !== -1) {
      completedSteps = initialIndex;
    } else {
      completedSteps = steps.initial.length;
      
      // Count freelancer steps
      if (userData.value.workStatus === 'freelancer') {
        const freelancerIndex = steps.freelancer.indexOf(currentStep.value);
        if (freelancerIndex !== -1) {
          completedSteps += freelancerIndex;
        } else {
          completedSteps += steps.freelancer.length;
          
          // Count common steps
          const commonIndex = steps.common.indexOf(currentStep.value);
          if (commonIndex !== -1) {
            completedSteps += commonIndex;
          }
        }
      } 
      // Count business owner steps
      else if (userData.value.workStatus === 'business_owner') {
        const businessIndex = steps.business.indexOf(currentStep.value);
        if (businessIndex !== -1) {
          completedSteps += businessIndex;
        } else {
          completedSteps += steps.business.length;
          
          // Count common steps
          const commonIndex = steps.common.indexOf(currentStep.value);
          if (commonIndex !== -1) {
            completedSteps += commonIndex;
          }
        }
      }
      // For other work statuses, go straight to common steps
      else {
        const commonIndex = steps.common.indexOf(currentStep.value);
        if (commonIndex !== -1) {
          completedSteps += commonIndex;
        }
      }
    }
    
    // Update progress value (ensure it doesn't exceed 100%)
    progress.value = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
  };
  
  return {
    progress,
    currentSection,
    updateProgress
  };
}
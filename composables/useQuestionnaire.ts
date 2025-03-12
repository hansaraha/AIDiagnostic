import { ref, reactive, computed } from 'vue';
import type { UserData } from '~/types/questionnaire';

// Import specialized composables
import useProgress from './useProgress';
import useFeedback from './useFeedback';
import useValidation from './useValidation';

export default function useQuestionnaire() {
  // User data state with reactive to ensure nested objects are tracked
  const userData = ref<UserData>({
    name: '',
    workStatus: undefined,
    email: '',
    commonAI: {},
    diagnostic: {
      professionalProfile: '',
      strengths: [],
      recommendations: [],
      courses: [],
      services: []
    }
  });
  
  // Navigation and state tracking
  const currentStep = ref('welcome');
  const lastQuestionStep = ref('');
  const questionCounter = ref(0);
  const tipInterval = ref(Math.floor(Math.random() * 3) + 2); // At least 2 questions between tips
  
  // Tips array
  const tips = [
    'Recuerda siempre actualizar tus habilidades profesionales.',
    'La colaboración puede abrir nuevas oportunidades.',
    'Mantén un equilibrio entre trabajo y vida personal.',
    'Explora nuevas herramientas tecnológicas para mejorar tu eficiencia.'
  ];
  
  // State variables
  const currentTip = ref('');
  const currentQuestion = ref('');
  const conversationalMessage = ref('');
  const nextStepAfterConversation = ref('');
  
  // Use specialized composables
  const { progress, currentSection, updateProgress } = useProgress(userData, currentStep);
  const { generateFeedback, getWorkStatusLabel } = useFeedback(userData);
  const { isValidEmail } = useValidation();
  
  // Function to update the current question text
  const updateCurrentQuestion = () => {
    currentQuestion.value = `Pregunta ${questionCounter.value + 1}`;
  };
  
  // Determine the next step based on current step and user data
  const getNextStep = (currentStep: string): string => {
    // Welcome to name
    if (currentStep === 'welcome') return 'name';
    
    // Name to work status
    if (currentStep === 'name') return 'work_status';
    
    // Initial branch
    if (currentStep === 'work_status') {
      if (userData.value.workStatus === 'freelancer') return 'freelancer_services';
      if (userData.value.workStatus === 'business_owner') return 'business_type';
      return 'ai_funding';
    }
  
    // Freelancer branch
    const freelancerSteps = [
      'freelancer_services',
      'freelancer_experience',
      'freelancer_clients',
      'freelancer_platforms'
    ];

    if (freelancerSteps.includes(currentStep)) {
      const index = freelancerSteps.indexOf(currentStep);
      if (index < freelancerSteps.length - 1) {
        return freelancerSteps[index + 1];
      }
      return 'ai_funding';
    }
  
    // Business branch
    const businessSteps = [
      'business_type',
      'business_size',
      'business_age',
      'business_ai_policy'
    ];

    if (businessSteps.includes(currentStep)) {
      const index = businessSteps.indexOf(currentStep);
      if (index < businessSteps.length - 1) {
        return businessSteps[index + 1];
      }
      return 'ai_funding';
    }
  
    // Common branch
    const commonSteps = [
      'ai_funding',
      'ai_disclosure',
      'ai_investment',
      'ai_value_proposition',
      'ai_rate_adjustment',
      'ai_project_impact',
      'email',
      'analysis',
      'results'
    ];

    if (commonSteps.includes(currentStep)) {
      const index = commonSteps.indexOf(currentStep);
      if (index < commonSteps.length - 1) {
        return commonSteps[index + 1];
      }
    }
  
    // Default to results if no other path is found
    return 'results';
  };
  
  // Function to move to the next step - SIMPLIFIED VERSION WITHOUT VALIDATION
  const nextStep = () => {
    if (currentStep.value === 'tip') {
      // After a tip is shown, continue to the next question
      currentStep.value = getNextStep(lastQuestionStep.value);
      tipInterval.value = Math.floor(Math.random() * 3) + 2; // Reset tip interval
    } else {
      // Store current step before changing it (only if it's not a tip)
      if (currentStep.value !== 'welcome' && currentStep.value !== 'results') {
        lastQuestionStep.value = currentStep.value;
        
        // Increment question counter and update progress
        questionCounter.value++;
        updateCurrentQuestion();
        
        // Only show the conversational feedback at key questions
        const keyQuestions = ['work_status', 'freelancer_experience', 'business_type', 'ai_investment'];
        if (keyQuestions.includes(currentStep.value)) {
          // Generate conversational message for key questions
          conversationalMessage.value = generateFeedback(currentStep.value);
          
          // Save the next step to continue after showing the message
          nextStepAfterConversation.value = getNextStep(currentStep.value);
          
          // Change to the conversational message screen
          currentStep.value = 'conversation';
          updateProgress();
          return; // Exit early as we'll continue from the conversation screen
        }
        
        // Check if we should show a tip
        if (questionCounter.value >= tipInterval.value && currentStep.value !== 'results') {
          // Show a tip
          currentTip.value = tips[Math.floor(Math.random() * tips.length)];
          currentStep.value = 'tip';
          // Reset counter for next tip interval
          questionCounter.value = 0;
          updateProgress();
          return; // Exit early as we'll continue from the tip
        }
      }
      
      // Simply proceed to next step without validation
      currentStep.value = getNextStep(currentStep.value);
      updateProgress();
    }
  };
  
  // Function to continue after showing a conversational message
  const continueAfterMessage = () => {
    // Proceed to the next stored step
    currentStep.value = nextStepAfterConversation.value;
    updateProgress();
  };
  
  // Function to restart the questionnaire
  const restartQuestionnaire = () => {
    userData.value = {
      name: '',
      workStatus: undefined,
      email: '',
      commonAI: {},
      diagnostic: {
        professionalProfile: '',
        strengths: [],
        recommendations: [],
        courses: [],
        services: []
      }
    };
    currentStep.value = 'welcome';
    lastQuestionStep.value = '';
    progress.value = 0;
    questionCounter.value = 0;
    tipInterval.value = Math.floor(Math.random() * 3) + 2;
    updateCurrentQuestion();
  };
  
  // Get profile description for the analysis screen
  const getProfileDescription = (): string => {
    let description = '';
    
    // Describe by work type
    if (userData.value.workStatus === 'freelancer') {
      description = 'de profesional freelancer';
      // Add experience detail if available
      if (userData.value.freelancer?.experience) {
        if (userData.value.freelancer.experience === 'less_than_1') {
          description += ' con menos de 1 año de experiencia';
        } else if (userData.value.freelancer.experience === '1_to_3') {
          description += ' con 1-3 años de experiencia';
        } else if (userData.value.freelancer.experience === '4_to_6') {
          description += ' con 4-6 años de experiencia';
        } else if (userData.value.freelancer.experience === 'more_than_6') {
          description += ' con más de 6 años de experiencia';
        }
      }
    } else if (userData.value.workStatus === 'business_owner') {
      description = 'de dueño de negocio';
      // Add business type if available
      if (userData.value.businessOwner?.businessType) {
        if (userData.value.businessOwner.businessType === 'tech_startup') {
          description += ' de una startup tecnológica';
        } else if (userData.value.businessOwner.businessType === 'professional_services') {
          description += ' de servicios profesionales';
        } else if (userData.value.businessOwner.businessType === 'creative_agency') {
          description += ' de una agencia creativa';
        } else if (userData.value.businessOwner.businessType === 'consulting') {
          description += ' de consultoría';
        }
      }
    } else if (userData.value.workStatus === 'full_time') {
      description = 'de empleado a tiempo completo';
    } else if (userData.value.workStatus === 'part_time') {
      description = 'de empleado a tiempo parcial';
    } else {
      description = 'profesional';
    }
    
    return description;
  };
  
  // Initialize
  updateCurrentQuestion();
  
  return {
    userData,
    currentStep,
    lastQuestionStep,
    progress,
    currentTip,
    currentQuestion,
    conversationalMessage,
    currentSection,
    nextStep,
    continueAfterMessage,
    restartQuestionnaire,
    getNextStep,
    getProfileDescription,
    isValidEmail
  };
}
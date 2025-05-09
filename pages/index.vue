<template>
  <div class="h-full">
    <OfflineBanner />
    <!-- Header only appears after the welcome screen -->
    <div v-if="currentStep !== 'welcome' && currentStep !== 'analysis'" :class="{
      'pb-5': currentStep !== 'welcome',
    }"
      class="fixed top-0 left-0 right-0 w-full  dark:bg-gradient-to-b dark:from-[#454547] from-70% dark:via-[#403397] dark:to-transparent z-10 transition-all duration-300 ease-in-out">
      <div class="container-responsive py-4 flex items-center "
        :class="{ 'justify-between': currentStep !== 'welcome', 'justify-end': currentStep === 'welcome' }">
        <h1 class="text-responsive-lg text-indigo-900 dark:text-indigo-300">
          MINDSET AI
        </h1>

        <!-- Color mode toggle and progress info -->
        <div class="flex items-center gap-4">


          <!-- Progress bar (desktop) -->
          <div class="hidden sm:block w-48 md:w-64 lg:w-80">
            <QuestionnaireProgressBar :progress="progress" :sectionText="currentSection" />
          </div>

          <ColorModeToggle />
        </div>
      </div>

      <!-- Mobile progress bar -->
      <div class="sm:hidden container-responsive pb-2">
        <QuestionnaireProgressBar :progress="progress" :sectionText="currentSection" />
      </div>
    </div>

    <!-- Main content with dynamic padding based on header visibility -->
    <div class="h-full" :class="currentStep !== 'welcome' && currentStep !== 'analysis' ? 'pt-24' : 'pt-8'">

      <!-- Global error message -->
      <ErrorMessage v-if="error" :error="error" class="max-w-2xl mx-auto mb-4" @retry="handleErrorRetry"
        @dismiss="handleDismissError" />

      <!-- Component selection based on current step -->
      <QuestionnaireStepWelcome v-if="currentStep === 'welcome'" @next="nextStep" />

      <QuestionnaireStepWorkStatus v-else-if="currentStep === 'work_status'" v-model="userData.workStatus"
        v-model:otherWorkStatus="userData.otherWorkStatus" @next="nextStep" />

      <QuestionnaireSectorQuestion v-else-if="currentStep === 'sector'" v-model="userData.sector"
        v-model:otherSector="userData.otherSector" @next="nextStep" />

      <!-- Freelancer specific steps -->
      <QuestionnaireStepFreelancerExperienceQuestion v-else-if="currentStep === 'freelancer_experience'"
        v-model="freelancerExperience" @next="nextStep" />

      <QuestionnaireStepFreelancerPlatformsQuestion v-else-if="currentStep === 'freelancer_platforms'"
        v-model="freelancerPlatforms" @next="nextStep" />

      <!-- Business Owner specific steps -->

      <QuestionnaireStepBusinessOwnerSizeQuestion v-else-if="currentStep === 'business_size'"
        v-model="ensureBusinessOwnerData().employeeCount" @next="nextStep" />

      <QuestionnaireStepBusinessOwnerAIStrategyQuestion v-else-if="currentStep === 'business_ai_strategy'"
        v-model="ensureBusinessOwnerData().aiStrategy" @next="nextStep" />


      <!-- Employee specific steps -->
      <QuestionnaireStepEmployeeRoleQuestion v-else-if="currentStep === 'employee_role'"
        v-model="ensureEmployeeData().role" @next="nextStep" />

      <QuestionnaireStepEmployeeAIPolicyQuestion v-else-if="currentStep === 'employee_ai_policy'"
        v-model="ensureEmployeeData().aiPolicy" @next="nextStep" />

      <!-- AI Usage questions -->
      <QuestionnaireAIFrequencyQuestion v-else-if="currentStep === 'ai_frequency'" v-model="userData.aiUsage.frequency"
        @next="nextStep" />

      <QuestionnaireAIToolsQuestion v-else-if="currentStep === 'ai_tools'" v-model="userData.aiUsage.tools"
        v-model:otherTool="userData.aiUsage.otherTool" @next="nextStep" />

      <QuestionnaireAIVersionsQuestion v-else-if="currentStep === 'ai_versions'" v-model="userData.aiUsage.versions"
        @next="nextStep" />

      <QuestionnaireAIUsageQuestion v-else-if="currentStep === 'ai_purposes'" v-model="userData.aiUsage.purposes"
        @next="nextStep" />

      <QuestionnaireAIFeelingQuestion v-else-if="currentStep === 'ai_feeling'" v-model="userData.aiUsage.feeling"
        @next="nextStep" />

      <QuestionnaireAIExperienceQuestion v-else-if="currentStep === 'ai_experience'"
        v-model="userData.aiUsage.experience" @next="nextStep" />

      <QuestionnaireAIImpactQuestion v-else-if="currentStep === 'ai_impact'" v-model="userData.aiUsage.impact"
        @next="nextStep" />


      <AIKnowledgeLevel v-else-if="currentStep === 'ai_knowledge_level'" v-model="userData.aiKnowledgeLevel"
        @next="nextStep" />
      <MarketingPromptChoice v-else-if="currentStep === 'marketing_prompt_choice'"
        v-model="userData.marketingPromptChoice" @next="nextStep" />
      <AITrainingInvestment v-else-if="currentStep === 'ai_training_investment'" v-model="userData.aiTrainingInvestment"
        @next="nextStep" />

      <AIObjective v-else-if="currentStep === 'ai_objective'" v-model="userData.aiObjective" @next="nextStep" />

      <AISavingTime v-else-if="currentStep === 'ai_saving_time'" v-model="userData.aiSavingTime" @next="nextStep" />
      <AIImprovements v-else-if="currentStep === 'ai_improvements'" v-model="userData.aiImprovements"
        @next="nextStep" />
      <AIWorkflows v-else-if="currentStep === 'ai_workflows'" v-model="userData.aiWorkflows" @next="nextStep" />

      <QuestionnaireStepEmail v-else-if="currentStep === 'email'" v-model="userData.email" @next="nextStep" />
      <AIObstacles v-else-if="currentStep === 'ai_obstacles'" v-model="userData.aiObstacle"
        v-model:otherValue="userData.aiObstacleOther" @next="nextStep" />
      <AISupport v-else-if="currentStep === 'ai_support'" v-model="userData.aiSupportNeed" @next="nextStep" />

      <!-- Analysis and Results -->
      <QuestionnaireStepAnalysis v-else-if="currentStep === 'analysis'" :analyzing="analyzing"
        :error="analysisError || undefined" @analyze="handleAnalyzeProfile" @retry="clearAnalysisError"
        @restart="restartQuestionnaire" />

      <!-- Resultados -->
      <StepResults v-else-if="currentStep === 'results'" :diagnostic="userData.diagnostic" :user-name="userData.name"
        :user-id="userData.id" :referral-code="userData.diagnostic?.referralCode" @restart="restartQuestionnaire" />
    </div>
  </div>
  <!-- Offline Banner is always visible -->

  <!-- Stopper Card (overlay con Teleport) -->
  <QuestionnaireStopperCard :show="showStopper" :title="currentStopperData.title || ''"
    :message="currentStopperData.message || ''" :source="currentStopperData.source || ''" @next="handleStopperNext" />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { AIStrategy, AIUsageData, Sector, UserData, WorkStatus } from "~/types/questionnaire";
import { useScoring } from "~/composables/useScoring";
import { useRecommendations } from "~/composables/useRecommendations";
import useApiService from "~/composables/useApiService";
import useErrorHandling from "~/composables/useErrorHandling";
import useStopperData from "~/composables/useStopperData";
import type { ErrorState } from "~/composables/useErrorHandling";
import ErrorMessage from "~/components/ui/ErrorMessage.vue";
import OfflineBanner from "~/components/ui/OfflineBanner.vue";
import ColorModeToggle from "~/components/ui/ColorModeToggle.vue";
import QuestionnaireStopperCard from "~/components/questionnaire/StopperCard.vue";
import { QuestionnaireStepEmail } from "#components";
import AIKnowledgeLevel from "~/components/questionnaire/AIKnowledgeLevel.vue";
import MarketingPromptChoice from "~/components/questionnaire/MarketingPromptChoice.vue";
import AITrainingInvestment from "~/components/questionnaire/AITrainingInvestment.vue";
import AIObjective from "~/components/questionnaire/AIObjective.vue";
import AISavingTime from "~/components/questionnaire/AISavingTime.vue";
import AIImprovements from "~/components/questionnaire/AIImprovements.vue";
import AIWorkflows from "~/components/questionnaire/AIWorkflows.vue";
import AIObstacles from "~/components/questionnaire/AIObstacles.vue";
import AISupport from "~/components/questionnaire/AISupport.vue";
import StepResults from "~/components/questionnaire/StepResults.vue";

// Initialize error handling
const { error: errorHandlingState, setError, clearError, handleFetchError } = useErrorHandling();

// Initialize user data with empty values
const userData = ref<UserData>({
  name: "",
  email: "",
  workStatus: '' as WorkStatus,
  otherWorkStatus: "",
  sector: '' as Sector,
  otherSector: "",
  aiUsage: {
    frequency: 'never',
    tools: [],
    versions: "unsure",
    purposes: [],
    feeling: 'neutral',
    experience: 'mixed',
    impact: 'none'
  },
  aiSavingTime: "none",
  aiImprovements: "no_change",
  aiWorkflows: "not_using",
  aiObjective: "no_clear_goal",
  diagnostic: undefined,
});

// Define the steps for each path
const commonSteps = ['welcome', 'work_status', 'sector'] as const;

// Stoppers steps
const stopperSteps = {
  sector: 'stopper_sector',
  worker: 'stopper_worker',
  experience: 'stopper_experience',
  future: 'stopper_future',
  adoption: 'stopper_adoption',
  success: 'stopper_success'
} as const;

const freelancerSteps = [
  'freelancer_experience',
  'freelancer_platforms',
] as const;
const businessOwnerSteps = [
  'business_size',
  'business_ai_policy'
] as const;
const employeeSteps = [
  'employee_role',
  'employee_ai_policy'
] as const;
const aiSteps = [
  'ai_frequency',
  'ai_tools',
  'ai_versions',
  'ai_purposes',
  'ai_feeling',
  'ai_experience',
  'ai_impact',
  'ai_saving_time',
  'ai_improvements',
  'ai_workflows',
  'ai_knowledge_level',
  'marketing_prompt_choice',
  'ai_training_investment',
  'ai_objective',
] as const;
const finalSteps = ['email', 'ai_obstacles', 'ai_support', 'analysis', 'results'] as const;

// Track current step and analysis state
const currentStep = ref('welcome');
const analyzing = ref(false);
const analysisError = ref<ErrorState | null>(null);

// Variable para controlar la visibilidad del stopper como overlay
const showStopper = ref(false);

// Inicializar el stopper data
const {
  getSectorStopper,
  getWorkerTypeStopper,
  getExperienceTip,
  getFutureReflection,
  getIndustryAdoptionStopper,
  getSuccessCase
} = useStopperData();

// Datos del stopper actual
const currentStopperData = ref({
  title: '',
  message: '',
  source: ''
});

// Calculate progress
const progress = computed(() => {
  const allSteps = [
    ...commonSteps,
    ...(userData.value.workStatus === 'freelancer' ? freelancerSteps : []),
    ...(userData.value.workStatus === 'business_owner' ? businessOwnerSteps : []),
    ...(userData.value.workStatus === 'full_time' || userData.value.workStatus === 'part_time' ? employeeSteps : []),
    ...aiSteps,
    ...finalSteps
  ];

  const currentIndex = allSteps.indexOf(currentStep.value as typeof allSteps[number]);
  return Math.round((currentIndex / (allSteps.length - 1)) * 100);
});

// Calculate current section
const currentSection = computed(() => {
  if (commonSteps.includes(currentStep.value as any)) return 'Información Básica';
  if (freelancerSteps.includes(currentStep.value as any)) return 'Perfil Freelancer';
  if (businessOwnerSteps.includes(currentStep.value as any)) return 'Perfil Empresario';
  if (aiSteps.includes(currentStep.value as any)) return 'Uso de IA';
  if (finalSteps.includes(currentStep.value as any)) return 'Resultados';
  return '';
});

// Error global para mostrar en la UI
const error = computed(() => {
  return analysisError?.value || errorHandlingState.value;
});

// Function to handle error dismissal
const handleDismissError = () => {
  clearError();
  clearAnalysisError();
};

// Function to handle error retry
const handleErrorRetry = async () => {
  if (error.value?.retry) {
    await error.value.retry();
  }
};

// Function to clear analysis error
const clearAnalysisError = () => {
  analysisError.value = null;
};

const freelancerPlatforms = computed({
  get: () => ensureFreelancerData().platforms,
  set: (val) => { ensureFreelancerData().platforms = val; }
});

// Function to handle profile analysis
async function handleAnalyzeProfile() {
  analyzing.value = true;
  analysisError.value = null;

  try {
    // ...envío de datos a n8n...
    await useApiService().submitQuestionnaire(userData.value);

    // Limpiar y volver al inicio
    restartQuestionnaire();
  } catch (error) {
    // ...manejo de errores...
    analysisError.value = handleFetchError(
      error,
      "Error al procesar tu diagnóstico. Por favor, inténtalo de nuevo.",
      handleAnalyzeProfile
    );
    if (analysisError.value) {
      analysisError.value.type = 'analysis';
    }
  } finally {
    analyzing.value = false;
  }
}

// Computed properties para v-model en freelancer
const freelancerExperience = computed({
  get: () => ensureFreelancerData().experience,
  set: (val) => { ensureFreelancerData().experience = val; }
});


// Ensure freelancer data exists before accessing
const ensureFreelancerData = () => {
  if (!userData.value.freelancer) {
    userData.value.freelancer = {
      experience: "less_than_1",
      platforms: [],
    };
  }
  return userData.value.freelancer || {};
};

// Ensure business owner data exists before accessing
const ensureBusinessOwnerData = () => {
  if (!userData.value.businessOwner) {
    userData.value.businessOwner = {
      employeeCount: "solo",
      aiStrategy: "none",
    };
  }
  return userData.value.businessOwner;
};

// Ensure common AI data exists before accessing
const ensureCommonAIData = () => {
  if (!userData.value.aiUsage) {
    userData.value.aiUsage = {
      frequency: 'never',
      tools: [],
      versions: 'unsure',
      purposes: [],
      feeling: 'neutral',
      experience: 'mixed',
      impact: 'none'
    };
  }
  return userData.value.aiUsage;
};

// Ensure employee data exists before accessing
const ensureEmployeeData = () => {
  if (!userData.value.employee) {
    userData.value.employee = {
      role: '',
      aiPolicy: ''
    };
  }
  return userData.value.employee;
};

// Function to go to next step
// Función para manejar el evento del botón continuar en el stopper
function handleStopperNext() {
  console.log('handleStopperNext called, current step:', currentStep.value);

  // Hide the stopper overlay
  showStopper.value = false;

  // Get the next step
  const nextStepValue = getNextStep(currentStep.value);
  console.log('Next step should be:', nextStepValue);

  // Special handling for stopper_success
  if (currentStep.value === stopperSteps.success) {
    console.log('Processing success stopper transition to email');
  }

  // Apply a delay to allow the stopper animation to complete
  setTimeout(() => {
    currentStep.value = nextStepValue;
    console.log('Step updated to:', currentStep.value);
  }, 350);
}

function nextStep(data?: any) {
  if (data) {
    if (currentStep.value === 'welcome') userData.value.name = data;
  }

  // Si estamos analizando, no permitir avanzar
  if (analyzing.value) {
    return;
  }

  // Calcular el siguiente paso
  const nextStepValue = getNextStep(currentStep.value);
  console.log('Paso actual:', currentStep.value, 'Siguiente paso:', nextStepValue);

  // Verificar si el siguiente paso es un stopper
  const isStopperStep = Object.values(stopperSteps).includes(nextStepValue as any);
  console.log('¿Es un stopper?', isStopperStep);

  if (isStopperStep) {
    // Actualizar datos del stopper según el tipo
    if (nextStepValue === stopperSteps.sector) {
      const stopper = getSectorStopper(userData.value.sector || 'default_sector');
      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
    }
    else if (nextStepValue === stopperSteps.worker) {
      const stopper = getWorkerTypeStopper(userData.value.workStatus || ('default_work_status' as WorkStatus));
      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
    }
    else if (nextStepValue === stopperSteps.experience) {
      // Determinar nivel de experiencia basado en las respuestas
      let experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'team' | 'leadership' = 'beginner';

      if (ensureCommonAIData().frequency === 'daily' || ensureCommonAIData().tools.length > 2) {
        experienceLevel = 'intermediate';
      }

      if (ensureCommonAIData().versions === 'paid_only' || ensureCommonAIData().versions === 'mostly_paid') {
        experienceLevel = 'advanced';
      }

      const stopper = getExperienceTip(experienceLevel);
      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
    }
    else if (nextStepValue === stopperSteps.future) {
      const stopper = getFutureReflection();
      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
    }
    else if (nextStepValue === stopperSteps.adoption) {
      const stopper = getIndustryAdoptionStopper(userData.value.sector || 'default_sector');
      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
    }
    else if (nextStepValue === stopperSteps.success) {
      console.log('Configurando stopper de CASO DE ÉXITO para sector:', userData.value.sector);

      // Mapear el sector del usuario a los sectores disponibles en successCases
      let mappedSector = userData.value.sector;

      // Mapeo de sectores de usuario a sectores de casos de éxito
      const sectorMapping: Record<string, string> = {
        'tech': 'development',
        'content': 'marketing',
        'support': 'consulting',
        'product': 'development',
        'sales': 'retail',
        'other': 'education'
      };

      if (sectorMapping[userData.value.sector ?? 'default_sector']) {
        mappedSector = sectorMapping[userData.value.sector ?? 'default_sector'] as Sector | undefined;
        console.log(`Mapeando sector ${userData.value.sector} a ${mappedSector} para casos de éxito`);
      }

      const stopper = getSuccessCase(mappedSector || 'default_sector');
      console.log('Datos del stopper de caso de éxito para sector', mappedSector, ':', stopper);

      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
      console.log('currentStopperData actualizado:', currentStopperData.value);
    }

    // Actualizar el paso actual en el estado interno (para rastreo)
    currentStep.value = nextStepValue;

    // Mostrar el stopper como overlay
    showStopper.value = true;
  } else {
    // Si no es un stopper, simplemente avanzar al siguiente paso
    currentStep.value = nextStepValue;
  }
}

// Function to determine the next step based on current step and user type
function getNextStep(currentStep: string): string {
  // 1) Del welcome al sector
  if (currentStep === 'welcome') return 'work_status';
  if (currentStep === 'work_status') return 'sector';
  if (currentStep === 'sector') return stopperSteps.sector;

  // 2) Después del stopper de sector
  if (currentStep === stopperSteps.sector) {
    if (userData.value.workStatus === 'freelancer') return 'freelancer_experience';
    if (userData.value.workStatus === 'business_owner') return 'business_size';
    if (userData.value.workStatus === 'full_time' || userData.value.workStatus === 'part_time') return 'employee_role';
    return 'ai_frequency';
  }

  // 3) Ruta freelancer
  if (currentStep === 'freelancer_experience') return 'freelancer_platforms';
  if (currentStep === 'freelancer_platforms') return stopperSteps.worker;

  // 4) Ruta business owner
  if (currentStep === 'business_age') return 'business_size';
  if (currentStep === 'business_size') return 'business_ai_strategy';
  if (currentStep === 'business_ai_strategy') return 'ai_frequency';
  if (currentStep === 'business_ai_policy') return stopperSteps.worker;

  // 5) Pasos específicos para empleados
  if (currentStep === 'employee_role') return 'employee_ai_policy';
  if (currentStep === 'employee_ai_policy') return stopperSteps.worker;

  // 6) Después del stopper por tipo de trabajador
  if (currentStep === stopperSteps.worker) return 'ai_frequency';

  // 7) Ruta común de IA
  if (currentStep === 'ai_frequency') return 'ai_tools';
  if (currentStep === 'ai_tools') return 'ai_versions';
  if (currentStep === 'ai_versions') return stopperSteps.experience;
  if (currentStep === stopperSteps.experience) return 'ai_purposes';
  if (currentStep === 'ai_purposes') return 'ai_feeling';
  if (currentStep === 'ai_feeling') return 'ai_experience';
  if (currentStep === 'ai_experience') return 'ai_impact';
  if (currentStep === 'ai_impact') return stopperSteps.future;
  if (currentStep === stopperSteps.future) return 'ai_saving_time';
  if (currentStep === 'ai_saving_time') return 'ai_improvements';
  if (currentStep === 'ai_improvements') return 'ai_workflows';
  // Stopper 6: Casos de éxito por sector
  if (currentStep === 'ai_workflows') return stopperSteps.success;
  if (currentStep === stopperSteps.success) return 'ai_knowledge_level';
  if (currentStep === 'ai_knowledge_level') return 'marketing_prompt_choice';
  if (currentStep === 'marketing_prompt_choice') return 'ai_training_investment';
  // Stopper 5: Adopción de IA por industria
  if (currentStep === 'ai_training_investment') return stopperSteps.adoption;
  if (currentStep === stopperSteps.adoption) return 'ai_objective';
  if (currentStep === 'ai_objective') return 'email';

  // Email → ai_obstacles → ai_support → análisis → resultados
  if (currentStep === 'email') return 'ai_obstacles';
  if (currentStep === 'ai_obstacles') return 'ai_support';
  if (currentStep === 'ai_support') return 'analysis';
  if (currentStep === 'analysis') return 'results';

  // Fallback
  return 'results';
}

function restartQuestionnaire() {
  // Limpiar todos los datos del usuario
  userData.value = {
    name: "",
    email: "",
    workStatus: "" as WorkStatus,
    otherWorkStatus: "",
    sector: "" as Sector,
    otherSector: "",
    aiUsage: {
      frequency: "never",
      tools: [],
      versions: "unsure",
      purposes: [],
      feeling: "neutral",
      experience: "mixed",
      impact: "none"
    },
    aiSavingTime: "none",
    aiImprovements: "no_change",
    aiWorkflows: "not_using",
    aiObjective: "no_clear_goal",
    diagnostic: undefined,
  };
  // Volver al primer paso
  currentStep.value = "welcome";
}

</script>

<template>
  <div class="h-full">
    <OfflineBanner />
    <div v-if="currentStep !== 'welcome' && currentStep !== 'analysis' && currentStep !== 'email'" :class="{
      'pb-5': currentStep !== 'welcome',
    }" class="fixed top-0 left-0 right-0 w-full transition-all duration-300 ease-in-out">
      <div class="container-responsive py-4 items-center justify-center hidden sm:flex">
        <h1 class="text-responsive-lg text-indigo-900 dark:text-indigo-300 mr-auto">
          MINDSET AI
        </h1>
        <div class="flex-1 flex justify-center ml-[-7rem]">
          <div class="w-48 md:w-64 lg:w-80">
            <QuestionnaireProgressBar :progress="Math.round((currentQuestionStepNumber / totalQuestionSteps) * 100)"
              :sectionText="currentSection" :currentStepNumber="currentQuestionStepNumber"
              :totalSteps="totalQuestionSteps" />
          </div>
        </div>
        <ColorModeToggle class="ml-auto" />
      </div>
      <div class="sm:hidden flex justify-center items-center pb-2 mt-[1rem] gap-5">
        <QuestionnaireProgressBar :progress="Math.round((currentQuestionStepNumber / totalQuestionSteps) * 100)"
          :sectionText="currentSection" :currentStepNumber="currentQuestionStepNumber" :totalSteps="totalQuestionSteps"
          class=" ml-4" />
        <ColorModeToggle class="mr-4" />
      </div>
    </div>

    <div class="flex flex-col items-center justify-center min-h-[calc(100vh-140px)] pt-[8rem]"
      :class="currentStep !== 'welcome' && currentStep !== 'analysis' ? 'pt-24' : 'pt-8'">
      <ErrorMessage v-if="error" :error="error" class="max-w-2xl mx-auto mb-4" @retry="handleErrorRetry"
        @dismiss="handleDismissError" />

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

      <QuestionnaireAIObjective v-else-if="currentStep === 'ai_objective'" v-model="userData.aiObjective"
        @next="nextStep" />

      <QuestionnaireAISavingTime v-else-if="currentStep === 'ai_saving_time'" v-model="userData.aiSavingTime"
        @next="nextStep" />
      <QuestionnaireAIImprovements v-else-if="currentStep === 'ai_improvements'" v-model="userData.aiImprovements"
        @next="nextStep" />
      <QuestionnaireAIWorkflows v-else-if="currentStep === 'ai_workflows'" v-model="userData.aiWorkflows"
        @next="nextStep" />

      <QuestionnaireStepEmail v-else-if="currentStep === 'email'" v-model="userData.email" @next="nextStep" />
      <QuestionnaireAIObstacles v-else-if="currentStep === 'ai_obstacles'" v-model="userData.aiObstacle"
        v-model:otherValue="userData.aiObstacleOther" @next="nextStep" />
      <QuestionnaireAISupport v-else-if="currentStep === 'ai_support'" v-model="userData.aiSupportNeed"
        @next="nextStep" />

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
import type { AIImprovements, AIObjective, AISavingTime, AIUsageData, AIWorkflows, Sector, UserData, WorkStatus } from "~/types/questionnaire";
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
    frequency: '' as AIUsageData['frequency'],
    tools: [],
    versions: "" as AIUsageData['versions'],
    purposes: [],
    feeling: '' as AIUsageData['feeling'],
    experience: '' as AIUsageData['experience'],
    impact: '' as AIUsageData['impact'],
  },
  aiSavingTime: "" as AISavingTime,
  aiImprovements: "" as AIImprovements,
  aiWorkflows: "" as AIWorkflows,
  aiObjective: "" as AIObjective,
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

// Pasos reales del cuestionario (sin nombre, email, análisis, resultados)
const maxQuestionSteps = [
  'work_status',
  'sector',
  'freelancer_experience',
  'freelancer_platforms',
  'business_size',
  'business_ai_strategy',
  'employee_role',
  'employee_ai_policy',
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
  'ai_obstacles',
  'ai_support'
];

const progressSteps = computed(() => {
  if (!userData.value.workStatus) {
    return maxQuestionSteps.slice(0, 20);
  }
  return [
    'work_status',
    'sector',
    ...(userData.value.workStatus === 'freelancer' ? ['freelancer_experience', 'freelancer_platforms'] : []),
    ...(userData.value.workStatus === 'business_owner' ? ['business_size', 'business_ai_strategy'] : []),
    ...(userData.value.workStatus === 'full_time' || userData.value.workStatus === 'part_time' ? ['employee_role', 'employee_ai_policy'] : []),
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
    'ai_obstacles',
    'ai_support'
  ];
});

const currentQuestionStepNumber = computed(() => {
  const idx = progressSteps.value.indexOf(currentStep.value);
  return idx >= 0 ? idx + 1 : 0;
});
const totalQuestionSteps = computed(() => progressSteps.value.length);

const currentStep = ref('welcome');
const analyzing = ref(false);
const analysisError = ref<ErrorState | null>(null);

const showStopper = ref(false);

const {
  getSectorStopper,
  getWorkerTypeStopper,
  getExperienceTip,
  getFutureReflection,
  getIndustryAdoptionStopper,
  getSuccessCase
} = useStopperData();

const currentStopperData = ref({
  title: '',
  message: '',
  source: ''
});

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

const currentSection = computed(() => {
  if (commonSteps.includes(currentStep.value as any)) return 'Información Básica';
  if (freelancerSteps.includes(currentStep.value as any)) return 'Perfil Freelancer';
  if (businessOwnerSteps.includes(currentStep.value as any)) return 'Perfil Empresario';
  if (aiSteps.includes(currentStep.value as any)) return 'Uso de IA';
  if (finalSteps.includes(currentStep.value as any)) return 'Resultados';
  return '';
});

const error = computed(() => {
  return analysisError?.value || errorHandlingState.value;
});

const handleDismissError = () => {
  clearError();
  clearAnalysisError();
};

const handleErrorRetry = async () => {
  if (error.value?.retry) {
    await error.value.retry();
  }
};

const clearAnalysisError = () => {
  analysisError.value = null;
};

const freelancerPlatforms = computed({
  get: () => ensureFreelancerData().platforms,
  set: (val) => { ensureFreelancerData().platforms = val; }
});

async function handleAnalyzeProfile() {
  analyzing.value = true;
  analysisError.value = null;

  try {
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
      frequency: '' as AIUsageData['frequency'],
      tools: [],
      versions: '' as AIUsageData['versions'],
      purposes: [],
      feeling: '' as AIUsageData['feeling'],
      experience: '' as AIUsageData['experience'],
      impact: '' as AIUsageData['impact'],
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
      frequency: "" as AIUsageData['frequency'],
      tools: [],
      versions: "" as AIUsageData['versions'],
      purposes: [],
      feeling: "" as AIUsageData['feeling'],
      experience: "" as AIUsageData['experience'],
      impact: "" as AIUsageData['impact'],
    },
    aiSavingTime: "" as AISavingTime,
    aiImprovements: "" as AIImprovements,
    aiWorkflows: "" as AIWorkflows,
    aiObjective: "" as AIObjective,
    diagnostic: undefined,
  };
  // Volver al primer paso
  currentStep.value = "welcome";
}

// Computed properties for step numbers
const allSteps = computed(() => [
  ...commonSteps,
  ...(userData.value.workStatus === 'freelancer' ? freelancerSteps : []),
  ...(userData.value.workStatus === 'business_owner' ? businessOwnerSteps : []),
  ...(userData.value.workStatus === 'full_time' || userData.value.workStatus === 'part_time' ? employeeSteps : []),
  ...aiSteps,
  ...finalSteps
]);

const currentStepNumber = computed(() => {
  const idx = allSteps.value.indexOf(currentStep.value as typeof allSteps.value[number]);
  return idx >= 0 ? idx + 1 : 1;
});
const totalSteps = computed(() => allSteps.value.length);

</script>

<template>
  <div class="h-full">
    <OfflineBanner />
    <!-- Header only appears after the welcome screen -->
    <div
    v-if="currentStep !== 'welcome' && currentStep !== 'analysis'"
    :class="{
      'pb-5': currentStep !== 'welcome',
    }"
      class="fixed top-0 left-0 right-0 w-full  dark:bg-gradient-to-b dark:from-[#403397] from-70% dark:via-[#403397] dark:to-transparent z-10 transition-all duration-300 ease-in-out">
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
        v-model="ensureFreelancerData().experience" @next="nextStep" />

      <QuestionnaireStepFreelancerPlatformsQuestion v-else-if="currentStep === 'freelancer_platforms'"
        v-model="ensureFreelancerData().clientAcquisition" @next="nextStep" />

      <!-- Business owner specific steps -->
      <QuestionnaireStepBusinessOwnerSizeQuestion v-else-if="currentStep === 'business_size'"
        v-model="ensureBusinessOwnerData().employeeCount" @next="nextStep" />

      <QuestionnaireStepBusinessOwnerAIStrategyQuestion v-else-if="currentStep === 'business_ai_strategy'"
        v-model="ensureBusinessOwnerData().aiStrategy" @next="nextStep" />

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
        
      <!-- Stoppers ya no se renderizan aquí porque ahora usan Teleport -->
      <!-- Se muestran con Teleport al final del documento -->

      <!-- Recopilación de email antes del análisis final -->
      <QuestionnaireStepEmail v-else-if="currentStep === 'email'" v-model="userData.email"
        @next="nextStep" />

      <!-- Analysis and Results -->
      <QuestionnaireStepAnalysis v-else-if="currentStep === 'analysis'" :analyzing="analyzing" :error="analysisError"
        @analyze="handleAnalyzeProfile" @retry="clearAnalysisError" />

      <QuestionnaireStepResults v-else-if="currentStep === 'results'" 
        :diagnostic="userData.diagnostic || {}"
        :userName="userData.name"
        :userId="userData.id"
        :referralCode="userData.referralCode"
        @restart="restartQuestionnaire" />
    </div>
  </div>
  <!-- Offline Banner is always visible -->

  <!-- Stopper Card (overlay con Teleport) -->
  <QuestionnaireStopperCard 
    :show="showStopper"
    :title="currentStopperData.title || ''"
    :message="currentStopperData.message || ''"
    :source="currentStopperData.source || ''"
    @next="handleStopperNext" 
  />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { UserData, WorkStatus } from "~/types/questionnaire";
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

// Initialize error handling
const { error: errorHandlingState, setError, clearError } = useErrorHandling();

// Initialize user data with empty values
const userData = ref<UserData>({
  name: "",
  email: "",
  workStatus: 'employee',
  otherWorkStatus: "",
  sector: 'tech',
  otherSector: "",
  aiUsage: {
    frequency: 'never',
    tools: [],
    versions: 'unsure',
    purposes: [],
    feeling: 'neutral',
    experience: 'no_experience',
    impact: 'none'
  },
  diagnostic: undefined,
  referralCode: undefined
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
  'freelancer_platforms'
] as const;
const businessOwnerSteps = [
  'business_size',
  'business_ai_strategy'
] as const;
const aiSteps = [
  'ai_frequency',
  'ai_tools',
  'ai_versions',
  'ai_purposes',
  'ai_feeling',
  'ai_experience',
  'ai_impact'
] as const;
const finalSteps = ['email', 'analysis', 'results'] as const;

// Track current step and analysis state
const currentStep = ref('welcome');
const analyzing = ref(false);
const analysisError = ref<ErrorState | null>(null);

// Variable para controlar la visibilidad del stopper como overlay
const showStopper = ref(false);

// Variable para rastrear si venimos de un stopper (para el manejo de la transición)
const comingFromStopper = ref(false);

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
    ...aiSteps,
    ...finalSteps
  ];

  const currentIndex = allSteps.indexOf(currentStep.value);
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

// Function to handle profile analysis
async function handleAnalyzeProfile() {
  analyzing.value = true;
  analysisError.value = null;

  console.log("Starting handleAnalyzeProfile");
  console.log("userData:", userData);

  // Make sure we have initialized objects before using them
  if (!userData.value) {
    userData.value = {};
  }

  try {
    // Verificamos conexión a internet
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      if (setError) {
        analysisError.value = setError(
          "connection",
          "No hay conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo.",
          null,
          handleAnalyzeProfile
        );
        analyzing.value = false;
        return;
      }
    }

    // Submit questionnaire data
    console.log("Llamando a submitQuestionnaire");
    const result = await useApiService().submitQuestionnaire(userData.value);

    console.log("Resultado de submitQuestionnaire:", result);

    // Verificamos que tenemos datos en el resultado
    if (!result) {
      throw new Error("No se recibió resultado del diagnóstico");
    }

    // Generate local diagnostic
    const { generateDiagnostic } = useScoring();
    const { analyzeStrengths, generateRecommendations, recommendCourses, recommendServices } = useRecommendations();

    // Calculate base diagnostic with score and profile
    const diagnostic = generateDiagnostic(userData.value);

    // Generate strengths based on usage and metrics
    const strengths = analyzeStrengths(
      userData.value.aiUsage,
      diagnostic.metrics,
      diagnostic.professionalProfile
    );

    // Generate recommendations based on profile and sector
    const recommendations = generateRecommendations(
      diagnostic.professionalProfile,
      userData.value.sector,
      diagnostic.metrics
    );

    // Get course recommendations
    const courses = recommendCourses(
      diagnostic.professionalProfile,
      userData.value.sector,
      diagnostic.metrics
    );

    // Get service recommendations
    const services = recommendServices(
      diagnostic.professionalProfile,
      userData.value.sector
    );

    // Initialize diagnostic object if it doesn't exist
    if (!userData.value.diagnostic) {
      userData.value.diagnostic = {};
    }

    // Update the diagnostic with all recommendations
    userData.value.diagnostic = {
      ...diagnostic,
      ...result,
      strengths: [...(result.strengths || []), ...strengths.map(s => s.title)],
      recommendations: [...(result.recommendations || []), ...recommendations.map(r => r.title)],
      courses: [...(result.courses || []), ...(courses || [])],
      services: [...(result.services || []), ...(services || [])]
    };

    // Store user ID and referral code if provided
    if (result.userId) {
      userData.value.id = result.userId;
    }

    if (result.referralCode) {
      userData.value.referralCode = result.referralCode;
    }

    // Move to next step
    currentStep.value = getNextStep(currentStep.value);
  } catch (error) {
    console.error("Error en handleAnalyzeProfile:", error);

    if (error && typeof error === "object" && "type" in error) {
      analysisError.value = error;
    } else if (handleFetchError && analysisError) {
      analysisError.value = handleFetchError(
        error,
        "Error al procesar tu diagnóstico. Por favor, inténtalo de nuevo.",
        handleAnalyzeProfile
      );
    } else {
      analysisError.value = {
        type: "analysis",
        message: "Hubo un error al analizar tu perfil. Por favor, intenta nuevamente.",
        retry: handleAnalyzeProfile
      };
    }
  } finally {
    analyzing.value = false;
  }
}

// Ensure freelancer data exists before accessing
const ensureFreelancerData = () => {
  if (!userData.value.freelancer) {
    userData.value.freelancer = {
      services: [],
      experience: "less_than_1",
      clientsPerMonth: "1_2",
      platforms: [],
    };
  }
  return userData.value.freelancer;
};

// Ensure business owner data exists before accessing
const ensureBusinessOwnerData = () => {
  if (!userData.value.businessOwner) {
    userData.value.businessOwner = {
      businessType: "tech_startup",
      employeeCount: "solo",
      foundingTime: "less_than_1",
      aiPolicy: "not_considered",
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

// Function to go to next step
// Función para manejar el evento del botón continuar en el stopper
function handleStopperNext() {
  console.log('handleStopperNext - Paso actual antes:', currentStep.value);
  // Oculta el stopper overlay
  showStopper.value = false;
  
  // Avanza al siguiente paso en la navegación después del stopper
  // Importante: Tenemos que usar el paso actual (que es un stopper) para determinar el paso siguiente
  const nextStepValue = getNextStep(currentStep.value);
  console.log('handleStopperNext - Siguiente paso calculado:', nextStepValue);
  
  // Verificar si estamos en el stopper de adopción
  if (currentStep.value === stopperSteps.adoption) {
    console.log('Saliendo del stopper de adopción, el siguiente debería ser casos de éxito');
  }
  
  // Aplicar un pequeño retraso para permitir que la animación de salida del stopper termine
  setTimeout(() => {
    currentStep.value = nextStepValue;
    console.log('Navegando al paso:', nextStepValue);
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
      const stopper = getSectorStopper(userData.value.sector);
      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
    } 
    else if (nextStepValue === stopperSteps.worker) {
      const stopper = getWorkerTypeStopper(userData.value.workStatus);
      currentStopperData.value = {
        title: stopper.title,
        message: stopper.message,
        source: stopper.source
      };
    }
    else if (nextStepValue === stopperSteps.experience) {
      // Determinar nivel de experiencia basado en las respuestas
      let experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'team' | 'leadership' = 'beginner';
      
      if (userData.value.aiUsage.frequency === 'daily' || userData.value.aiUsage.tools.length > 2) {
        experienceLevel = 'intermediate';
      }
      
      if (userData.value.aiUsage.versions === 'paid_only' || userData.value.aiUsage.versions === 'mostly_paid') {
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
      const stopper = getIndustryAdoptionStopper(userData.value.sector);
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
      
      if (sectorMapping[userData.value.sector]) {
        mappedSector = sectorMapping[userData.value.sector];
        console.log(`Mapeando sector ${userData.value.sector} a ${mappedSector} para casos de éxito`);
      }
      
      const stopper = getSuccessCase(mappedSector);
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
  // Flujo del welcome al sector
  if (currentStep === 'welcome') return 'work_status';
  if (currentStep === 'work_status') return 'sector';
  if (currentStep === 'sector') return stopperSteps.sector; // Mostrar stopper de sector
  
  // Después del stopper de sector, bifurcar según tipo de usuario
  if (currentStep === stopperSteps.sector) {
    if (userData.value.workStatus === 'freelancer') return 'freelancer_experience';
    if (userData.value.workStatus === 'business_owner') return 'business_size';
    return 'ai_frequency'; // Si es otro tipo, ir directamente a preguntas de IA
  }
  
  // Ruta freelancer
  if (currentStep === 'freelancer_experience') return 'freelancer_platforms';
  if (currentStep === 'freelancer_platforms') return stopperSteps.worker;
  
  // Ruta business owner
  if (currentStep === 'business_size') return 'business_ai_strategy';
  if (currentStep === 'business_ai_strategy') return stopperSteps.worker;
  
  // Después de mostrar stopper por tipo de trabajador, ir a preguntas de IA
  if (currentStep === stopperSteps.worker) return 'ai_frequency';
  
  // Ruta común de IA
  if (currentStep === 'ai_frequency') return 'ai_tools';
  if (currentStep === 'ai_tools') return 'ai_versions';
  if (currentStep === 'ai_versions') return stopperSteps.experience;
  if (currentStep === stopperSteps.experience) return 'ai_purposes';
  if (currentStep === 'ai_purposes') return 'ai_feeling';
  if (currentStep === 'ai_feeling') return 'ai_experience';
  if (currentStep === 'ai_experience') return stopperSteps.future;
  if (currentStep === stopperSteps.future) return 'ai_impact';
  if (currentStep === 'ai_impact') return stopperSteps.adoption;
  
  // Después de adopción, ir a casos de éxito, luego email y finalmente análisis
  if (currentStep === stopperSteps.adoption) return stopperSteps.success;
  if (currentStep === stopperSteps.success) return 'email';
  if (currentStep === 'email') return 'analysis';
  if (currentStep === 'analysis') return 'results';
  
  // Default
  return 'results';
}

// Function to restart questionnaire
function restartQuestionnaire() {
  userData.value = {
    name: "",
    email: "",
    workStatus: 'employee',
    otherWorkStatus: "",
    sector: 'tech',
    otherSector: "",
    aiUsage: {
      frequency: 'never',
      tools: [],
      versions: 'unsure',
      purposes: [],
      feeling: 'neutral',
      experience: 'no_experience',
      impact: 'none'
    },
    diagnostic: undefined,
    referralCode: undefined
  };
  currentStep.value = 'welcome';
}
</script>

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
          <ColorModeToggle />

          <!-- Progress bar (desktop) -->
          <div class="hidden sm:block w-48 md:w-64 lg:w-80">
            <QuestionnaireProgressBar :progress="progress" :sectionText="currentSection" />
          </div>
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
      <QuestionnaireFreelancerExperienceQuestion v-else-if="currentStep === 'freelancer_experience'"
        v-model="userData.freelancer.experience" @next="nextStep" />

      <QuestionnaireFreelancerPlatformsQuestion v-else-if="currentStep === 'freelancer_platforms'"
        v-model="userData.freelancer.clientAcquisition" @next="nextStep" />

      <!-- Business owner specific steps -->
      <QuestionnaireBusinessSizeQuestion v-else-if="currentStep === 'business_size'"
        v-model="userData.businessOwner.employeeCount" @next="nextStep" />

      <QuestionnaireAIStrategyQuestion v-else-if="currentStep === 'business_ai_strategy'"
        v-model="userData.businessOwner.aiStrategy" @next="nextStep" />

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

      <!-- Analysis and Results -->
      <QuestionnaireStepAnalysis v-else-if="currentStep === 'analysis'" :analyzing="analyzing" :error="analysisError"
        @analyze="handleAnalyzeProfile" @retry="clearAnalysisError" />

      <QuestionnaireStepResults v-else-if="currentStep === 'results'" :diagnostic="userData.diagnostic"
        @restart="restartQuestionnaire" />

      <QuestionnaireStepFreelancerExperienceQuestion v-else-if="currentStep === 'freelancer_experience'"
        v-model="freelancerExperience" @next="nextStep" />

      <QuestionnaireStepFreelancerClientsQuestion v-else-if="currentStep === 'freelancer_clients'"
        v-model="freelancerClients" @next="nextStep" />

      <QuestionnaireStepFreelancerPlatformsQuestion v-else-if="currentStep === 'freelancer_platforms'"
        v-model="freelancerPlatforms" v-model:otherPlatform="freelancerOtherPlatform" @next="nextStep" />

      <!-- Business owner specific steps -->
      <QuestionnaireStepBusinessOwnerTypeQuestion v-else-if="currentStep === 'business_type'" v-model="businessType"
        v-model:otherBusinessType="businessOtherType" @next="nextStep" />

      <QuestionnaireStepBusinessOwnerSizeQuestion v-else-if="currentStep === 'business_size'" v-model="businessSize"
        @next="nextStep" />

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

      <!-- Analysis and Results -->
      <QuestionnaireStepAnalysis v-else-if="currentStep === 'analysis'" :analyzing="analyzing" :error="analysisError"
        @analyze="handleAnalyzeProfile" @retry="clearAnalysisError" />

      <QuestionnaireStepResults v-else-if="currentStep === 'results'" :diagnostic="userData.diagnostic"
        @restart="restartQuestionnaire" />
    </div>
  </div>
  <!-- Offline Banner is always visible -->

</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { UserData, WorkStatus } from "~/types/questionnaire";
import { useScoring } from "~/composables/useScoring";
import { useRecommendations } from "~/composables/useRecommendations";
import useApiService from "~/composables/useApiService";
import useErrorHandling from "~/composables/useErrorHandling";
import type { ErrorState } from "~/composables/useErrorHandling";
import ErrorMessage from "~/components/ui/ErrorMessage.vue";
import OfflineBanner from "~/components/ui/OfflineBanner.vue";
import ColorModeToggle from "~/components/ui/ColorModeToggle.vue";

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
const finalSteps = ['analysis', 'results'] as const;
const tips = ['']

// Track current step and analysis state
const currentStep = ref('welcome');
const analyzing = ref(false);
const analysisError = ref<ErrorState | null>(null);

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
  if (!userData.value.commonAI) {
    userData.value.commonAI = {};
  }
  return userData.value.commonAI;
};

// Function to go to next step
function nextStep() {
  currentStep.value = getNextStep(currentStep.value);
}

// Function to determine the next step based on current step and user type
function getNextStep(currentStep: string): string {
  const workStatus = userData.value.workStatus as WorkStatus;

  const allSteps = [
    ...commonSteps,
    ...(workStatus === 'freelancer' ? freelancerSteps : []),
    ...(workStatus === 'business_owner' ? businessOwnerSteps : []),
    ...aiSteps,
    ...finalSteps,
  ];

  const currentIndex = allSteps.indexOf(currentStep);
  return currentIndex < allSteps.length - 1 ? allSteps[currentIndex + 1] : currentStep;
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

<template>
  <div class="h-full bg-gray-50 flex flex-col">
    <!-- Offline Banner -->
    <OfflineBanner />

    <!-- Progress bar -->
    <QuestionnaireProgressBar
      :progress="progress"
      :sectionText="currentSection"
    />

    <!-- Main content -->
    <div
      class="container mx-auto px-4 py-8 flex-grow flex flex-col justify-center"
    >
      <h1 class="text-center text-2xl font-bold text-indigo-900 mb-8">
        DIAGNÓSTICO IA
      </h1>

      <!-- Global error message -->
      <ErrorMessage
        v-if="error"
        :error="error"
        class="max-w-2xl mx-auto mb-4"
        @retry="handleErrorRetry"
        @dismiss="handleDismissError"
      />

      <!-- Component selection based on current step -->
      <QuestionnaireStepWelcome
        v-if="currentStep === 'welcome'"
        @next="nextStep"
      />

      <QuestionnaireStepName
        v-else-if="currentStep === 'name'"
        v-model="userData.name"
        @next="nextStep"
      />

      <QuestionnaireStepWorkStatus
        v-else-if="currentStep === 'work_status'"
        v-model="userData.workStatus"
        v-model:otherWorkStatus="userData.otherWorkStatus"
        @next="nextStep"
      />

      <!-- Freelancer specific steps -->
      <QuestionnaireStepFreelancerServicesQuestion
        v-else-if="currentStep === 'freelancer_services'"
        v-model="freelancerServices"
        v-model:otherService="freelancerOtherService"
        @next="nextStep"
      />

      <QuestionnaireStepFreelancerExperienceQuestion
        v-else-if="currentStep === 'freelancer_experience'"
        v-model="freelancerExperience"
        @next="nextStep"
      />

      <QuestionnaireStepFreelancerClientsQuestion
        v-else-if="currentStep === 'freelancer_clients'"
        v-model="freelancerClients"
        @next="nextStep"
      />

      <QuestionnaireStepFreelancerPlatformsQuestion
        v-else-if="currentStep === 'freelancer_platforms'"
        v-model="freelancerPlatforms"
        v-model:otherPlatform="freelancerOtherPlatform"
        @next="nextStep"
      />

      <!-- Business owner specific steps -->
      <QuestionnaireStepBusinessOwnerTypeQuestion
        v-else-if="currentStep === 'business_type'"
        v-model="businessType"
        v-model:otherBusinessType="businessOtherType"
        @next="nextStep"
      />

      <QuestionnaireStepBusinessOwnerSizeQuestion
        v-else-if="currentStep === 'business_size'"
        v-model="businessSize"
        @next="nextStep"
      />

      <QuestionnaireStepBusinessOwnerAgeQuestion
        v-else-if="currentStep === 'business_age'"
        v-model="businessAge"
        @next="nextStep"
      />

      <QuestionnaireStepBusinessOwnerAIPolicyQuestion
        v-else-if="currentStep === 'business_ai_policy'"
        v-model="businessAIPolicy"
        @next="nextStep"
      />

      <!-- Common AI-related steps across all user types -->
      <QuestionnaireStepCommonAIFundingQuestion
        v-else-if="currentStep === 'ai_funding'"
        v-model="aiFunding"
        @next="nextStep"
      />

      <QuestionnaireStepCommonAIDisclosureQuestion
        v-else-if="currentStep === 'ai_disclosure'"
        v-model="aiDisclosure"
        @next="nextStep"
      />

      <QuestionnaireStepCommonAIInvestmentQuestion
        v-else-if="currentStep === 'ai_investment'"
        v-model="aiInvestment"
        @next="nextStep"
      />

      <QuestionnaireStepCommonAIValuePropositionQuestion
        v-else-if="currentStep === 'ai_value_proposition'"
        v-model="aiValueProposition"
        @next="nextStep"
      />

      <QuestionnaireStepCommonAIRateAdjustmentQuestion
        v-else-if="currentStep === 'ai_rate_adjustment'"
        v-model="aiRateAdjustment"
        @next="nextStep"
      />

      <QuestionnaireStepCommonAIProjectImpactQuestion
        v-else-if="currentStep === 'ai_project_impact'"
        v-model="aiProjectImpact"
        @next="nextStep"
      />

      <!-- Final steps -->
      <QuestionnaireStepEmail
        v-else-if="currentStep === 'email'"
        v-model="userData.email"
        @next="nextStep"
      />

      <QuestionnaireStepAnalysis
        v-else-if="currentStep === 'analysis'"
        :profile-description="getProfileDescription()"
        :is-analyzing="isAnalyzing"
        :error="analysisError"
        @analyze="handleAnalyzeProfile"
        @clearError="clearAnalysisError"
      />

      <QuestionnaireStepResults
        v-else-if="currentStep === 'results'"
        :diagnostic="userData.diagnostic"
        :user-name="userData.name"
        :user-id="userData.id || ''"
        :referral-code="userData.referralCode || ''"
        @restart="restartQuestionnaire"
      />

      <!-- Interactive components -->
      <QuestionnaireConversationalFeedback
        v-else-if="currentStep === 'conversation'"
        :message="conversationalMessage"
        :user-name="userData.name"
        @continue="continueAfterMessage"
      />

      <QuestionnaireTipCard
        v-else-if="currentStep === 'tip'"
        :tip="currentTip"
        @next="nextStep"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { UserData } from "~/types/questionnaire";
import useErrorHandling from "~/composables/useErrorHandling";
import type { ErrorState } from "~/composables/useErrorHandling";
import ErrorMessage from "~/components/ui/ErrorMessage.vue";
import OfflineBanner from "~/components/ui/OfflineBanner.vue";

// Use the composables (auto-imported by Nuxt)
const {
  userData,
  currentStep,
  lastQuestionStep,
  progress,
  currentTip,
  currentQuestion,
  conversationalMessage,
  currentSection,
  validationError,
  isStepValid,
  nextStep,
  continueAfterMessage,
  restartQuestionnaire,
  getProfileDescription,
  isValidEmail,
  validateCurrentStep,
  clearError,
} = useQuestionnaire();

const {
  isFreelancerServiceSelected,
  toggleFreelancerService,
  selectFreelancerExperience,
  selectFreelancerClients,
  isFreelancerPlatformSelected,
  toggleFreelancerPlatform,
} = useFreelancerQuestions(userData);

const {
  isBusinessTypeValid,
  selectBusinessType,
  selectBusinessSize,
  selectBusinessAge,
  selectBusinessAIPolicy,
} = useBusinessQuestions(userData);

const {
  selectAIFunding,
  selectAIDisclosure,
  selectAIInvestment,
  selectAIValueProposition,
  selectAIRateAdjustment,
  selectAIProjectImpact,
} = useAIQuestions(userData);

const {
  isAnalyzing,
  analyzeProfile,
  error: diagnosticError,
} = useDiagnostic(userData);
const {
  error: errorHandlingState,
  setError,
  handleFetchError,
} = useErrorHandling();

// Refs para manejar errores específicos
const analysisError = ref<ErrorState | null>(null);

// Error global para mostrar en la UI
const error = computed(() => {
  return diagnosticError.value || errorHandlingState.value;
});

// Function to handle error dismissal
const handleDismissError = () => {
  // Call clearError regardless of which error is showing
  // This ensures we reset all error states in the app
  clearError();

  // Also clear the analysis error if it exists
  clearAnalysisError();
};

// Función para manejar el reintento de operaciones tras un error
const handleErrorRetry = async () => {
  if (error.value?.retry) {
    await error.value.retry();
  }
};

// Función para limpiar errores específicos del análisis
const clearAnalysisError = () => {
  analysisError.value = null;
};

const handleAnalyzeProfile = async () => {
  console.log("Starting handleAnalyzeProfile");
  console.log("userData:", userData);
  console.log("analysisError:", analysisError);
  console.log("Is nextStep a function?", typeof nextStep === 'function');
  console.log("Is setError a function?", typeof setError === 'function');
  console.log("Is handleFetchError a function?", typeof handleFetchError === 'function');

  // Make sure we have initialized objects before using them
  if (!userData.value) {
    userData.value = {};
  }

  if (analysisError && typeof analysisError.value === "function") {
    analysisError.value = null;
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
      }
      return;
    }

    // Llama a la función del composable para generar el diagnóstico
    console.log("Llamando a analyzeProfile");
    const result = await useApiService().submitQuestionnaire(userData.value);

    console.log("Resultado de analyzeProfile:", result);

    // Verificamos que tenemos datos en el resultado
    if (!result) {
      console.error("No se recibió resultado de analyzeProfile");
      throw new Error("No se recibió resultado del diagnóstico");
    }

    // Initialize diagnostic object if it doesn't exist
    if (!userData.value.diagnostic) {
      userData.value.diagnostic = {};
    }

    // Update the diagnostic properties one by one to avoid issues
    userData.value.diagnostic.professionalProfile =
      result.professionalProfile || "";
    userData.value.diagnostic.strengths = result.strengths || [];
    userData.value.diagnostic.recommendations = result.recommendations || [];
    userData.value.diagnostic.courses = result.courses || [];
    userData.value.diagnostic.services = result.services || [];

    // Actualizamos ID y código de referido si los recibimos
    if (result.userId) {
      userData.value.id = result.userId;
    }

    if (result.referralCode) {
      userData.value.referralCode = result.referralCode;
    }

    // Una vez completado el análisis, avanzamos al siguiente paso
    console.log("Avanzando al siguiente paso");
    if (typeof nextStep === "function") {
      nextStep();
    }

    return result;
  } catch (error) {
    console.error("Error en handleAnalyzeProfile:", error);

    // Si el error ya es un ErrorState de nuestro sistema, lo propagamos directamente
    if (error && typeof error === "object" && "type" in error) {
      if (analysisError) {
        analysisError.value = error;
      }
    } else {
      // Si no, creamos un nuevo error
      if (handleFetchError && analysisError) {
        analysisError.value = handleFetchError(
          error,
          "Error al procesar tu diagnóstico. Por favor, inténtalo de nuevo.",
          handleAnalyzeProfile
        );
      }
    }
  } finally {
    isAnalyzing.value = false;
  }
};

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

// Additional computed properties to handle the "other" fields
const freelancerOtherService = computed({
  get: () => userData.value.freelancer?.otherService || "",
  set: (value: string) => {
    const freelancer = ensureFreelancerData();
    freelancer.otherService = value;
  },
});

const freelancerOtherPlatform = computed({
  get: () => userData.value.freelancer?.otherPlatform || "",
  set: (value: string) => {
    const freelancer = ensureFreelancerData();
    freelancer.otherPlatform = value;
  },
});

const businessOtherType = computed({
  get: () => userData.value.businessOwner?.otherBusinessType || "",
  set: (value: string) => {
    const businessOwner = ensureBusinessOwnerData();
    businessOwner.otherBusinessType = value;
  },
});

// Computed properties for v-model bindings with simplified typing
// Freelancer properties
const freelancerServices = computed<string[]>({
  get: () => userData.value.freelancer?.services || [],
  set: (value) => {
    const freelancer = ensureFreelancerData();
    freelancer.services = value as any;
  },
});

const freelancerExperience = computed<string>({
  get: () => userData.value.freelancer?.experience || "less_than_1",
  set: (value) => {
    const freelancer = ensureFreelancerData();
    freelancer.experience = value as any;
  },
});

const freelancerClients = computed<string>({
  get: () => userData.value.freelancer?.clientsPerMonth || "1_2",
  set: (value) => {
    const freelancer = ensureFreelancerData();
    freelancer.clientsPerMonth = value as any;
  },
});

const freelancerPlatforms = computed<string[]>({
  get: () => userData.value.freelancer?.platforms || [],
  set: (value) => {
    const freelancer = ensureFreelancerData();
    freelancer.platforms = value as any;
  },
});

// Business owner properties
const businessType = computed<string>({
  get: () => userData.value.businessOwner?.businessType || "tech_startup",
  set: (value) => {
    const businessOwner = ensureBusinessOwnerData();
    businessOwner.businessType = value as any;
  },
});

const businessSize = computed<string>({
  get: () => userData.value.businessOwner?.employeeCount || "solo",
  set: (value) => {
    const businessOwner = ensureBusinessOwnerData();
    businessOwner.employeeCount = value as any;
  },
});

const businessAge = computed<string>({
  get: () => userData.value.businessOwner?.foundingTime || "less_than_1",
  set: (value) => {
    const businessOwner = ensureBusinessOwnerData();
    businessOwner.foundingTime = value as any;
  },
});

const businessAIPolicy = computed<string>({
  get: () => userData.value.businessOwner?.aiPolicy || "not_considered",
  set: (value) => {
    const businessOwner = ensureBusinessOwnerData();
    businessOwner.aiPolicy = value as any;
  },
});

// AI-related properties
const aiFunding = computed<string>({
  get: () => userData.value.commonAI?.funding || "",
  set: (value) => {
    const commonAI = ensureCommonAIData();
    commonAI.funding = value as any;
  },
});

const aiDisclosure = computed<string>({
  get: () => userData.value.commonAI?.disclosure || "",
  set: (value) => {
    const commonAI = ensureCommonAIData();
    commonAI.disclosure = value as any;
  },
});

const aiInvestment = computed<string>({
  get: () => userData.value.commonAI?.investment || "",
  set: (value) => {
    const commonAI = ensureCommonAIData();
    commonAI.investment = value as any;
  },
});

const aiValueProposition = computed<string>({
  get: () => userData.value.commonAI?.valueProposition || "",
  set: (value) => {
    const commonAI = ensureCommonAIData();
    commonAI.valueProposition = value as any;
  },
});

const aiRateAdjustment = computed<string>({
  get: () => userData.value.commonAI?.rateAdjustment || "",
  set: (value) => {
    const commonAI = ensureCommonAIData();
    commonAI.rateAdjustment = value as any;
  },
});

const aiProjectImpact = computed<string>({
  get: () => userData.value.commonAI?.projectImpact || "",
  set: (value) => {
    const commonAI = ensureCommonAIData();
    commonAI.projectImpact = value as any;
  },
});
</script>

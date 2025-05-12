import { ref, computed } from "vue";
import type {
  UserData,
  AIFrequency,
  AIToolVersion,
  AIFeeling,
  AIExperience,
  AIImpact,
} from "~/types/questionnaire";
import useErrorHandling from "./useErrorHandling";

// Import specialized composables
import useProgress from "./useProgress";
import useValidation from "./useValidation";

export default function useQuestionnaire() {
  // Error handling
  const { error, setError, clearError } = useErrorHandling();

  const userData = ref<UserData>({
    name: "",
    workStatus: undefined,
    email: "",
    aiUsage: {
      frequency: "" as AIFrequency,
      tools: [],
      versions: "" as AIToolVersion,
      purposes: [],
      feeling: "" as AIFeeling,
      experience: "" as AIExperience,
      impact: "" as AIImpact,
    },
    diagnostic: {
      professionalProfile: "",
      strengths: [],
      recommendations: [],
      courses: [],
      services: [],
    },
  });

  // Try to load saved progress from localStorage on init
  const loadSavedProgress = () => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem("questionnaireProgress");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Only restore if the data is not from a completed questionnaire
          if (parsedData && parsedData.currentStep !== "results") {
            userData.value = parsedData.userData;
            currentStep.value = parsedData.currentStep;
            lastQuestionStep.value = parsedData.lastQuestionStep || "";
          }
        }
      } catch (e) {
        console.error("Error loading saved progress", e);
      }
    }
  };

  // Navigation and state tracking
  const currentStep = ref("welcome");
  const lastQuestionStep = ref("");
  const questionCounter = ref(0);
  const tipInterval = ref(Math.floor(Math.random() * 3) + 2); // At least 2 questions between tips

  // Tips array
  const tips = [
    "Recuerda siempre actualizar tus habilidades profesionales.",
    "La colaboración puede abrir nuevas oportunidades.",
    "Mantén un equilibrio entre trabajo y vida personal.",
    "Explora nuevas herramientas tecnológicas para mejorar tu eficiencia.",
  ];

  // State variables
  const currentTip = ref("");
  const currentQuestion = ref("");
  const conversationalMessage = ref("");
  const nextStepAfterConversation = ref("");
  const validationError = ref("");
  const isStepValid = ref(true);

  // Use specialized composables
  const { progress, currentSection, updateProgress } = useProgress(
    userData,
    currentStep
  );
  const { isValidEmail } = useValidation();

  // Function to save current progress to localStorage
  const saveProgress = () => {
    if (typeof window !== "undefined" && currentStep.value !== "results") {
      try {
        localStorage.setItem(
          "questionnaireProgress",
          JSON.stringify({
            userData: userData.value,
            currentStep: currentStep.value,
            lastQuestionStep: lastQuestionStep.value,
          })
        );
      } catch (e) {
        console.error("Error saving progress", e);
      }
    }
  };

  // Function to update the current question text
  const updateCurrentQuestion = () => {
    currentQuestion.value = `Pregunta ${questionCounter.value + 1}`;
  };

  // Determine the next step based on current step and user data
  const getNextStep = (currentStep: string): string => {
    // Welcome to name
    if (currentStep === "welcome") return "name";

    // Name to work status
    if (currentStep === "name") return "work_status";

    // Initial branch
    if (currentStep === "work_status") {
      if (userData.value.workStatus === "freelancer")
        return "freelancer_services";
      if (userData.value.workStatus === "business_owner")
        return "business_type";
      return "ai_funding";
    }

    // Freelancer branch
    const freelancerSteps = [
      "freelancer_services",
      "freelancer_experience",
      "freelancer_clients",
      "freelancer_platforms",
    ];

    if (freelancerSteps.includes(currentStep)) {
      const index = freelancerSteps.indexOf(currentStep);
      if (index < freelancerSteps.length - 1) {
        return freelancerSteps[index + 1];
      }
      return "ai_funding";
    }

    // Business branch
    const businessSteps = [
      "business_type",
      "business_size",
      "business_age",
      "business_ai_policy",
    ];

    if (businessSteps.includes(currentStep)) {
      const index = businessSteps.indexOf(currentStep);
      if (index < businessSteps.length - 1) {
        return businessSteps[index + 1];
      }
      return "ai_funding";
    }

    // Common branch
    const commonSteps = [
      "ai_funding",
      "ai_disclosure",
      "ai_investment",
      "ai_value_proposition",
      "ai_rate_adjustment",
      "ai_project_impact",
      "email",
      "analysis",
      "results",
    ];

    if (commonSteps.includes(currentStep)) {
      const index = commonSteps.indexOf(currentStep);
      if (index < commonSteps.length - 1) {
        return commonSteps[index + 1];
      }
    }

    // Default to results if no other path is found
    return "results";
  };

  // Validate current step before proceeding
  const validateCurrentStep = (): boolean => {
    validationError.value = "";
    isStepValid.value = true;

    switch (currentStep.value) {
      case "name":
        if (!userData.value.name.trim()) {
          validationError.value =
            "Por favor, ingresa tu nombre para continuar.";
          isStepValid.value = false;
        }
        break;

      case "work_status":
        if (!userData.value.workStatus) {
          validationError.value = "Por favor, selecciona tu situación laboral.";
          isStepValid.value = false;
        } else if (
          userData.value.workStatus === "other" &&
          !(userData.value as any).otherWorkStatus?.trim()
        ) {
          validationError.value = "Por favor, especifica tu situación laboral.";
          isStepValid.value = false;
        }
        break;

      case "freelancer_services":
        // No necesita validación específica si no tienes campos services
        break;

      case "freelancer_platforms":
        if (
          !userData.value.freelancer ||
          !userData.value.freelancer.platforms ||
          userData.value.freelancer.platforms.length === 0
        ) {
          validationError.value =
            "Por favor, selecciona al menos una plataforma.";
          isStepValid.value = false;
        }
        break;

      case "business_type":
        // No necesita validación específica si no tienes campo businessType
        break;

      case "email":
        if (!userData.value.email) {
          validationError.value =
            "Por favor, ingresa tu dirección de correo electrónico.";
          isStepValid.value = false;
        } else if (!isValidEmail(userData.value.email)) {
          validationError.value =
            "Por favor, ingresa una dirección de correo electrónico válida.";
          isStepValid.value = false;
        }
        break;
    }

    return isStepValid.value;
  };

  // Function to move to the next step
  const nextStep = () => {
    // Validate the current step (if applicable)
    if (
      [
        "name",
        "work_status",
        "freelancer_services",
        "freelancer_platforms",
        "business_type",
        "email",
      ].includes(currentStep.value)
    ) {
      if (!validateCurrentStep()) {
        return; // Do not proceed if validation fails
      }
    }

    if (currentStep.value === "tip") {
      // After a tip is shown, continue to the next question
      currentStep.value = getNextStep(lastQuestionStep.value);
      tipInterval.value = Math.floor(Math.random() * 3) + 2; // Reset tip interval
    } else {
      // Store current step before changing it (only if it's not a tip)
      if (currentStep.value !== "welcome" && currentStep.value !== "results") {
        lastQuestionStep.value = currentStep.value;

        // Increment question counter and update progress
        questionCounter.value++;
        updateCurrentQuestion();

        // Only show the conversational feedback at key questions
        const keyQuestions = [
          "work_status",
          "freelancer_experience",
          "business_type",
          "ai_investment",
        ];
        if (keyQuestions.includes(currentStep.value)) {
          // Generate conversational message for key questions

          // Save the next step to continue after showing the message
          nextStepAfterConversation.value = getNextStep(currentStep.value);

          // Change to the conversational message screen
          currentStep.value = "conversation";
          updateProgress();
          saveProgress(); // Save progress after each step
          return; // Exit early as we'll continue from the conversation screen
        }

        // Check if we should show a tip
        if (
          questionCounter.value >= tipInterval.value &&
          currentStep.value !== "results"
        ) {
          // Show a tip
          currentTip.value = tips[Math.floor(Math.random() * tips.length)];
          currentStep.value = "tip";
          // Reset counter for next tip interval
          questionCounter.value = 0;
          updateProgress();
          saveProgress(); // Save progress after each step
          return; // Exit early as we'll continue from the tip
        }
      }

      // Simply proceed to next step
      currentStep.value = getNextStep(currentStep.value);
      updateProgress();
      saveProgress(); // Save progress after each step
    }
  };

  // Function to continue after showing a conversational message
  const continueAfterMessage = () => {
    // Proceed to the next stored step
    currentStep.value = nextStepAfterConversation.value;
    updateProgress();
    saveProgress(); // Save progress after each step
  };

  // Function to restart the questionnaire
  const restartQuestionnaire = () => {
    userData.value = {
      name: "",
      workStatus: undefined,
      email: "",
      aiUsage: {
        frequency: "" as AIFrequency,
        tools: [],
        versions: "" as AIToolVersion,
        purposes: [],
        feeling: "" as AIFeeling,
        experience: "" as AIExperience,
        impact: "" as AIImpact,
      },
      diagnostic: {
        professionalProfile: "",
        strengths: [],
        recommendations: [],
        courses: [],
        services: [],
      },
    };
    currentStep.value = "welcome";
    lastQuestionStep.value = "";
    progress.value = 0;
    questionCounter.value = 0;
    tipInterval.value = Math.floor(Math.random() * 3) + 2;
    updateCurrentQuestion();

    // Clear saved progress
    if (typeof window !== "undefined") {
      localStorage.removeItem("questionnaireProgress");
    }
  };

  // Get profile description for the analysis screen
  const getProfileDescription = (): string => {
    let description = "";

    // Describe by work type
    if (userData.value.workStatus === "freelancer") {
      description = "de profesional freelancer";
      // Add experience detail if available
      if (userData.value.freelancer?.experience) {
        if (userData.value.freelancer.experience === "less_than_1") {
          description += " con menos de 1 año de experiencia";
        } else if (userData.value.freelancer.experience === "1_to_3") {
          description += " con 1-3 años de experiencia";
        } else if (userData.value.freelancer.experience === "4_to_6") {
          description += " con 4-6 años de experiencia";
        } else if (userData.value.freelancer.experience === "more_than_6") {
          description += " con más de 6 años de experiencia";
        }
      }
    } else if (userData.value.workStatus === "business_owner") {
      description = "de dueño de negocio";
    } else if (userData.value.workStatus === "full_time") {
      description = "de empleado a tiempo completo";
    } else if (userData.value.workStatus === "part_time") {
      description = "de empleado a tiempo parcial";
    } else {
      description = "profesional";
    }

    return description;
  };

  // Generate a unique referral code for this user
  const generateReferralCode = (): string => {
    const namePart = userData.value.name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .substring(0, 5);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${namePart}-${randomPart}`;
  };

  // Calculate current step number and total steps
  const allSteps = computed(() => {
    // Define all possible steps here
    const steps = [
      "welcome",
      "name",
      "work_status",
      // Conditional steps based on workStatus
      ...(userData.value.workStatus === "freelancer"
        ? [
            "freelancer_services",
            "freelancer_experience",
            "freelancer_clients",
            "freelancer_platforms",
          ]
        : []),
      ...(userData.value.workStatus === "business_owner"
        ? [
            "business_type",
            "business_size",
            "business_age",
            "business_ai_policy",
          ]
        : []),
      // Common AI steps
      "ai_funding",
      "ai_disclosure",
      "ai_investment",
      "ai_value_proposition",
      "ai_rate_adjustment",
      "ai_project_impact",
      "email",
      "analysis",
      "results",
    ];
    return steps;
  });

  const currentStepNumber = computed(() => {
    const idx = allSteps.value.indexOf(currentStep.value);
    return idx >= 0 ? idx + 1 : 1;
  });

  const totalSteps = computed(() => {
    return allSteps.value.length;
  });

  // Initialize
  updateCurrentQuestion();
  loadSavedProgress();

  return {
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
    getNextStep,
    getProfileDescription,
    isValidEmail,
    validateCurrentStep,
    error,
    clearError,
    currentStepNumber,
    totalSteps,
  };
}

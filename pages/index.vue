<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Progress bar -->
      <QuestionnaireProgressBar :progress="progress" :sectionText="currentSection" />
  
      <!-- Main content -->
      <div class="container mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <h1 class="text-center text-2xl font-bold text-indigo-900 mb-8">DIAGNÓSTICO IA</h1>
        
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
          @analyze="analyzeProfile" 
        />
        
        <QuestionnaireStepResults 
          v-else-if="currentStep === 'results'" 
          :diagnostic="userData.diagnostic" 
          :user-name="userData.name"
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
  import { computed } from 'vue';
  import type {
    UserData,
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
    AIProjectImpactOption
  } from '~/types/questionnaire';
  
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
    nextStep,
    continueAfterMessage,
    restartQuestionnaire,
    getProfileDescription,
    isValidEmail
  } = useQuestionnaire();
  
  const {
    isFreelancerServiceSelected,
    toggleFreelancerService,
    selectFreelancerExperience,
    selectFreelancerClients,
    isFreelancerPlatformSelected,
    toggleFreelancerPlatform
  } = useFreelancerQuestions(userData);
  
  const {
    isBusinessTypeValid,
    selectBusinessType,
    selectBusinessSize,
    selectBusinessAge,
    selectBusinessAIPolicy
  } = useBusinessQuestions(userData);
  
  const {
    selectAIFunding,
    selectAIDisclosure,
    selectAIInvestment,
    selectAIValueProposition,
    selectAIRateAdjustment,
    selectAIProjectImpact
  } = useAIQuestions(userData);
  
  const {
    isAnalyzing,
    analyzeProfile
  } = useDiagnostic(userData);
  
  // Ensure freelancer data exists before accessing
  const ensureFreelancerData = () => {
    if (!userData.value.freelancer) {
      userData.value.freelancer = {
        services: [],
        experience: 'less_than_1',
        clientsPerMonth: '1_2',
        platforms: []
      };
    }
    return userData.value.freelancer;
  };
  
  // Ensure business owner data exists before accessing
  const ensureBusinessOwnerData = () => {
    if (!userData.value.businessOwner) {
      userData.value.businessOwner = {
        businessType: 'tech_startup',
        employeeCount: 'solo',
        foundingTime: 'less_than_1',
        aiPolicy: 'not_considered'
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
    get: () => userData.value.freelancer?.otherService || '',
    set: (value: string) => {
      const freelancer = ensureFreelancerData();
      freelancer.otherService = value;
    }
  });
  
  const freelancerOtherPlatform = computed({
    get: () => userData.value.freelancer?.otherPlatform || '',
    set: (value: string) => {
      const freelancer = ensureFreelancerData();
      freelancer.otherPlatform = value;
    }
  });
  
  const businessOtherType = computed({
    get: () => userData.value.businessOwner?.otherBusinessType || '',
    set: (value: string) => {
      const businessOwner = ensureBusinessOwnerData();
      businessOwner.otherBusinessType = value;
    }
  });
  
  // Computed properties for v-model bindings with proper typing
  // Freelancer properties
  const freelancerServices = computed<string[]>({
    get: () => userData.value.freelancer?.services || [],
    set: (value) => {
      const freelancer = ensureFreelancerData();
      freelancer.services = value as any;
    }
  });
  
  const freelancerExperience = computed<FreelancerExperienceOption['value'] | string>({
    get: () => userData.value.freelancer?.experience || 'less_than_1',
    set: (value) => {
      const freelancer = ensureFreelancerData();
      freelancer.experience = value as any;
    }
  });
  
  const freelancerClients = computed<FreelancerClientsOption['value'] | string>({
    get: () => userData.value.freelancer?.clientsPerMonth || '1_2',
    set: (value) => {
      const freelancer = ensureFreelancerData();
      freelancer.clientsPerMonth = value as any;
    }
  });
  
  const freelancerPlatforms = computed<string[]>({
    get: () => userData.value.freelancer?.platforms || [],
    set: (value) => {
      const freelancer = ensureFreelancerData();
      freelancer.platforms = value as any;
    }
  });
  
  // Business owner properties
  const businessType = computed<BusinessTypeOption['value'] | string>({
    get: () => userData.value.businessOwner?.businessType || 'tech_startup',
    set: (value) => {
      const businessOwner = ensureBusinessOwnerData();
      businessOwner.businessType = value as any;
    }
  });
  
  const businessSize = computed<BusinessSizeOption['value'] | string>({
    get: () => userData.value.businessOwner?.employeeCount || 'solo',
    set: (value) => {
      const businessOwner = ensureBusinessOwnerData();
      businessOwner.employeeCount = value as any;
    }
  });
  
  const businessAge = computed<BusinessAgeOption['value'] | string>({
    get: () => userData.value.businessOwner?.foundingTime || 'less_than_1',
    set: (value) => {
      const businessOwner = ensureBusinessOwnerData();
      businessOwner.foundingTime = value as any;
    }
  });
  
  const businessAIPolicy = computed<BusinessAIPolicyOption['value'] | string>({
    get: () => userData.value.businessOwner?.aiPolicy || 'not_considered',
    set: (value) => {
      const businessOwner = ensureBusinessOwnerData();
      businessOwner.aiPolicy = value as any;
    }
  });
  
  // AI-related properties
  const aiFunding = computed<AIFundingOption['value'] | string>({
    get: () => userData.value.commonAI?.funding || '',
    set: (value) => {
      const commonAI = ensureCommonAIData();
      commonAI.funding = value as any;
    }
  });
  
  const aiDisclosure = computed<AIDisclosureOption['value'] | string>({
    get: () => userData.value.commonAI?.disclosure || '',
    set: (value) => {
      const commonAI = ensureCommonAIData();
      commonAI.disclosure = value as any;
    }
  });
  
  const aiInvestment = computed<AIInvestmentOption['value'] | string>({
    get: () => userData.value.commonAI?.investment || '',
    set: (value) => {
      const commonAI = ensureCommonAIData();
      commonAI.investment = value as any;
    }
  });
  
  const aiValueProposition = computed<AIValuePropositionOption['value'] | string>({
    get: () => userData.value.commonAI?.valueProposition || '',
    set: (value) => {
      const commonAI = ensureCommonAIData();
      commonAI.valueProposition = value as any;
    }
  });
  
  const aiRateAdjustment = computed<AIRateAdjustmentOption['value'] | string>({
    get: () => userData.value.commonAI?.rateAdjustment || '',
    set: (value) => {
      const commonAI = ensureCommonAIData();
      commonAI.rateAdjustment = value as any;
    }
  });
  
  const aiProjectImpact = computed<AIProjectImpactOption['value'] | string>({
    get: () => userData.value.commonAI?.projectImpact || '',
    set: (value) => {
      const commonAI = ensureCommonAIData();
      commonAI.projectImpact = value as any;
    }
  });
  </script>
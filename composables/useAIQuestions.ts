import { computed } from 'vue';
import type { UserData, CommonAIData } from '~/types/questionnaire';

export default function useAIQuestions(userData: Ref<UserData>) {
  // Initialize AI data if needed
  const initializeAIData = () => {
    if (!userData.value.commonAI) {
      userData.value.commonAI = {};
    }
    return userData.value.commonAI;
  };

  // Set AI funding
  const selectAIFunding = (funding: string) => {
    const commonAI = initializeAIData();
    commonAI.funding = funding as any;
  };

  // Set AI disclosure
  const selectAIDisclosure = (disclosure: string) => {
    const commonAI = initializeAIData();
    commonAI.disclosure = disclosure as any;
  };

  // Set AI investment
  const selectAIInvestment = (investment: string) => {
    const commonAI = initializeAIData();
    commonAI.investment = investment as any;
  };

  // Set AI value proposition
  const selectAIValueProposition = (valueProposition: string) => {
    const commonAI = initializeAIData();
    commonAI.valueProposition = valueProposition as any;
  };

  // Set AI rate adjustment
  const selectAIRateAdjustment = (rateAdjustment: string) => {
    const commonAI = initializeAIData();
    commonAI.rateAdjustment = rateAdjustment as any;
  };

  // Set AI project impact
  const selectAIProjectImpact = (projectImpact: string) => {
    const commonAI = initializeAIData();
    commonAI.projectImpact = projectImpact as any;
  };

  return {
    selectAIFunding,
    selectAIDisclosure,
    selectAIInvestment,
    selectAIValueProposition,
    selectAIRateAdjustment,
    selectAIProjectImpact
  };
}
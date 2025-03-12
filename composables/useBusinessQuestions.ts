import { computed } from 'vue';
import type { UserData, BusinessOwnerData } from '~/types/questionnaire';

export default function useBusinessQuestions(userData: Ref<UserData>) {
  // Initialize business owner data if needed
  const initializeBusinessData = () => {
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

  // Computed property to check if business type is valid
  const isBusinessTypeValid = computed(() => {
    if (userData.value.businessOwner?.businessType === 'other') {
      return !!userData.value.businessOwner.otherBusinessType?.trim();
    }
    return !!userData.value.businessOwner?.businessType;
  });

  // Set business type
  const selectBusinessType = (type: string) => {
    const business = initializeBusinessData();
    business.businessType = type as any;
  };

  // Set business size (employee count)
  const selectBusinessSize = (size: string) => {
    const business = initializeBusinessData();
    business.employeeCount = size as any;
  };

  // Set business age (founding time)
  const selectBusinessAge = (age: string) => {
    const business = initializeBusinessData();
    business.foundingTime = age as any;
  };

  // Set business AI policy
  const selectBusinessAIPolicy = (policy: string) => {
    const business = initializeBusinessData();
    business.aiPolicy = policy as any;
  };

  return {
    isBusinessTypeValid,
    selectBusinessType,
    selectBusinessSize,
    selectBusinessAge,
    selectBusinessAIPolicy
  };
}
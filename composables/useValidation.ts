import { computed } from 'vue';
import type { UserData } from '~/types/questionnaire';

export default function useValidation() {
  // Email validation
  const isValidEmail = (email?: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Work status validation
  const isWorkStatusValid = (userData: UserData): boolean => {
    if (userData.workStatus === 'other') {
      return !!userData.otherWorkStatus?.trim();
    }
    return !!userData.workStatus;
  };

  // Freelancer services validation
  const isFreelancerServicesValid = (userData: UserData): boolean => {
    if (!userData.freelancer || userData.freelancer.services.length === 0) {
      return false;
    }
    
    if (userData.freelancer.services.includes('other')) {
      return !!userData.freelancer.otherService?.trim();
    }
    
    return true;
  };

  // Freelancer platforms validation
  const isFreelancerPlatformsValid = (userData: UserData): boolean => {
    if (!userData.freelancer || userData.freelancer.platforms.length === 0) {
      return false;
    }
    
    if (userData.freelancer.platforms.includes('other')) {
      return !!userData.freelancer.otherPlatform?.trim();
    }
    
    return true;
  };

  // Business type validation
  const isBusinessTypeValid = (userData: UserData): boolean => {
    if (!userData.businessOwner) return false;
    
    if (userData.businessOwner.businessType === 'other') {
      return !!userData.businessOwner.otherBusinessType?.trim();
    }
    
    return !!userData.businessOwner.businessType;
  };

  return {
    isValidEmail,
    isWorkStatusValid,
    isFreelancerServicesValid,
    isFreelancerPlatformsValid,
    isBusinessTypeValid
  };
}
import { computed } from 'vue';
import type { UserData, FreelancerData } from '~/types/questionnaire';

export default function useFreelancerQuestions(userData: Ref<UserData>) {
  // Initialize freelancer data if needed
  const initializeFreelancerData = () => {
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

  // Check if a service is selected
  const isFreelancerServiceSelected = (service: string) => {
    return userData.value.freelancer?.services.includes(service as any) ?? false;
  };

  // Toggle a service selection
  const toggleFreelancerService = (service: string) => {
    const freelancer = initializeFreelancerData();
    
    const index = freelancer.services.indexOf(service as any);
    if (index === -1) {
      freelancer.services.push(service as any);
    } else {
      freelancer.services.splice(index, 1);
    }
  };

  // Set freelancer experience
  const selectFreelancerExperience = (experience: string) => {
    const freelancer = initializeFreelancerData();
    freelancer.experience = experience as any;
  };

  // Set clients per month
  const selectFreelancerClients = (clients: string) => {
    const freelancer = initializeFreelancerData();
    freelancer.clientsPerMonth = clients as any;
  };

  // Check if a platform is selected
  const isFreelancerPlatformSelected = (platform: string) => {
    return userData.value.freelancer?.platforms.includes(platform as any) ?? false;
  };

  // Toggle a platform selection
  const toggleFreelancerPlatform = (platform: string) => {
    const freelancer = initializeFreelancerData();
    
    const index = freelancer.platforms.indexOf(platform as any);
    if (index === -1) {
      freelancer.platforms.push(platform as any);
    } else {
      freelancer.platforms.splice(index, 1);
    }
  };

  return {
    isFreelancerServiceSelected,
    toggleFreelancerService,
    selectFreelancerExperience,
    selectFreelancerClients,
    isFreelancerPlatformSelected,
    toggleFreelancerPlatform
  };
}
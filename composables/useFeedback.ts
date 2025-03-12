import { ref } from 'vue';
import type { UserData } from '~/types/questionnaire';
import useOptionsData from './useOptionsData';

export default function useFeedback(userData: Ref<UserData>) {
  const { 
    workStatusOptions, 
    freelancerExperienceOptions,
    freelancerClientsOptions,
    businessTypeOptions,
    aiInvestmentOptions,
    aiDisclosureOptions,
    aiProjectImpactOptions
  } = useOptionsData();

  // Function to generate conversational feedback based on user responses
  const generateFeedback = (currentStepValue: string): string => {
    // Different messages based on the current step and previous responses
    if (currentStepValue === 'name') {
      return `¡Gracias por compartir tu nombre, <strong>${userData.value.name}</strong>! Ahora me gustaría conocer un poco más sobre tu situación laboral.`;
    }
    
    if (currentStepValue === 'work_status') {
      const statusLabel = getWorkStatusLabel();
      return `Entendido, ${userData.value.name}. Veo que eres <strong>${statusLabel}</strong>. Esta información me ayudará a personalizar mejor las recomendaciones para ti.`;
    }
    
    if (currentStepValue === 'freelancer_experience') {
      if (!userData.value.freelancer) return `¡Gracias por tu respuesta, ${userData.value.name}!`;
      
      const freelancer = userData.value.freelancer;
      const experienceLabel = freelancerExperienceOptions.value.find(option => option.value === freelancer.experience)?.label.toLowerCase() || '';
      let message = `¡Excelente, ${userData.value.name}! Tienes <strong>${experienceLabel}</strong> de experiencia como freelancer.`;
      
      if (freelancer.experience === 'less_than_1') {
        message += ' Estás comenzando en este mundo, pero ya has dado el primer paso que es el más importante. Vamos a ayudarte a crecer.'; 
      } else if (freelancer.experience === '1_to_3') {
        message += ' Ya has superado la etapa inicial y estás en un buen momento para consolidar tu carrera y crecer profesionalmente.'; 
      } else if (freelancer.experience === '4_to_6') {
        message += ' Tienes una experiencia sólida que te da credibilidad y conocimientos valiosos para afrontar proyectos complejos.'; 
      } else if (freelancer.experience === 'more_than_6') {
        message += ' Eres un profesional experimentado con una trayectoria que demuestra solidez y expertise en tu campo.'; 
      }
      
      return message;
    }
    
    if (currentStepValue === 'freelancer_clients') {
      if (!userData.value.freelancer) return `¡Gracias por tu respuesta, ${userData.value.name}!`;
      
      const freelancer = userData.value.freelancer;
      const clientsLabel = freelancerClientsOptions.value.find(option => option.value === freelancer.clientsPerMonth)?.label.toLowerCase() || '';
      let message = `Interesante, ${userData.value.name}. Trabajas con <strong>${clientsLabel}</strong> mensualmente.`;
      
      if (freelancer.clientsPerMonth === '1_2') {
        message += ' Esto te permite enfocarte profundamente en cada proyecto y dar un servicio muy personalizado.'; 
      } else if (freelancer.clientsPerMonth === '3_5') {
        message += ' Un número ideal para balancear diversidad de proyectos y atención personalizada.'; 
      } else if (freelancer.clientsPerMonth === '6_10' || freelancer.clientsPerMonth === 'more_than_10') {
        message += ' Manejas una cartera de clientes considerable, lo que indica una gran capacidad de gestión y organización.'; 
      }
      
      return message;
    }

    if (currentStepValue === 'business_type') {
      const businessTypeLabel = businessTypeOptions.value.find(option => option.value === userData.value.businessOwner?.businessType)?.label.toLowerCase() || '';
      return `Gracias por la información, ${userData.value.name}. Tu negocio como <strong>${businessTypeLabel}</strong> tiene características específicas que consideraré para las recomendaciones de automatización.`;
    }
    
    if (currentStepValue === 'ai_disclosure') {
      const disclosureLabel = aiDisclosureOptions.value.find(option => option.value === userData.value.commonAI?.disclosure)?.label.toLowerCase() || '';
      let message = `Interesante enfoque, ${userData.value.name}. <strong>${disclosureLabel}</strong> sobre tu uso de IA con clientes.`;
      
      if (userData.value.commonAI?.disclosure === 'always') {
        message += ' La transparencia suele generar mayor confianza con los clientes y posicionarte como un profesional innovador.'; 
      } else if (userData.value.commonAI?.disclosure === 'never') {
        message += ' Entiendo que prefieres mantener el enfoque en los resultados más que en las herramientas utilizadas.'; 
      }
      
      return message;
    }
    
    if (currentStepValue === 'ai_investment') {
      const investmentLabel = aiInvestmentOptions.value.find(option => option.value === userData.value.commonAI?.investment)?.label.toLowerCase() || '';
      let message = `Comprendo, ${userData.value.name}. <strong>${investmentLabel}</strong> en herramientas de IA mensualmente.`;
      
      if (userData.value.commonAI?.investment === 'none' || userData.value.commonAI?.investment === 'under_50') {
        message += ' Hay excelentes opciones gratuitas o de bajo costo que pueden darte buenos resultados iniciales.'; 
      } else {
        message += ' Esta inversión te permite acceder a herramientas más avanzadas y personalizadas.'; 
      }
      
      return message;
    }
    
    if (currentStepValue === 'ai_project_impact') {
      const impactLabel = aiProjectImpactOptions.value.find(option => option.value === userData.value.commonAI?.projectImpact)?.label.toLowerCase() || '';
      let message = `Gracias por compartir, ${userData.value.name}. Es interesante que percibes un impacto <strong>${impactLabel}</strong> de la IA en tus proyectos.`;
      
      if (userData.value.commonAI?.projectImpact === 'positive') {
        message += ' Esto indica que estás implementando estas herramientas de manera efectiva.'; 
      } else if (userData.value.commonAI?.projectImpact === 'negative') {
        message += ' Podemos identificar mejores estrategias y herramientas que se adapten mejor a tus necesidades.'; 
      } else if (userData.value.commonAI?.projectImpact === 'mixed') {
        message += ' Es común tener resultados mixtos mientras se encuentra el enfoque adecuado para cada caso.'; 
      }
      
      return message;
    }
    
    // If no specific message for the step, return a generic message
    return `Gracias por compartir esa información, ${userData.value.name}. Continuemos con el cuestionario para personalizar mejor tus recomendaciones.`;
  };

  // Helper function to get work status label
  const getWorkStatusLabel = (): string => {
    const status = workStatusOptions.value.find(option => option.value === userData.value.workStatus);
    return status ? status.label.toLowerCase() : '';
  };

  return {
    generateFeedback,
    getWorkStatusLabel
  };
}
import { ref, computed } from 'vue';
import type { UserData, DiagnosticResult } from '~/types/questionnaire';
import useApiService from './useApiService';
import useErrorHandling from './useErrorHandling';

export default function useDiagnostic(userData: Ref<UserData>) {
  const isAnalyzing = ref(false);
  const apiService = useApiService();
  const { error, setError, handleFetchError, clearError } = useErrorHandling();

  // Función para analizar el perfil y generar recomendaciones
  const analyzeProfile = async () => {
    clearError(); // Clear any existing errors
    isAnalyzing.value = true;
    
    console.log('Iniciando análisis de perfil');
    
    // En una SPA, accedemos a la configuración a través de useRuntimeConfig
    const config = useRuntimeConfig();
    const useMockApi = config.public.useMockApi === 'true';
    
    console.log('Modo mock API:', useMockApi);
    
    try {
      // Verificar si debemos usar datos mock según la configuración
      if (useMockApi) {
        console.log('Usando datos mock para el diagnóstico');
        // En modo mock, simulamos una demora
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Generamos resultados locales
        const diagnosticResult = await generateLocalDiagnosticResult();
        console.log('Diagnóstico mock generado:', diagnosticResult);
        userData.value.diagnostic = diagnosticResult;
        return diagnosticResult;
      } else {
        console.log('Enviando datos reales a la API para diagnóstico');
        try {
          // En producción, utilizamos el servicio de API para enviar los datos a n8n
          const result = await apiService.submitQuestionnaire(userData.value);
          
          console.log('Diagnóstico recibido de API:', result);
          
          // Verificamos que el resultado contenga los datos necesarios
          if (!result.courses || !result.services) {
            console.warn('El diagnóstico no contiene cursos o servicios');
          }
          
          // Actualizamos el estado con los resultados
          userData.value.diagnostic = result;
          
          // Actualizamos ID y código de referido si los recibimos
          if (result.userId) {
            userData.value.id = result.userId;
          }
          
          if (result.referralCode) {
            userData.value.referralCode = result.referralCode;
          }
          
          console.log('Estado de usuario actualizado con diagnóstico');
          
          return result;
        } catch (apiError) {
          console.error('Error al obtener diagnóstico de API:', apiError);
          
          // Reintentamos una vez más antes de usar el fallback
          const retryFn = async () => {
            try {
              console.log('Reintentando obtener diagnóstico de API...');
              const result = await apiService.submitQuestionnaire(userData.value);
              userData.value.diagnostic = result;
              return result;
            } catch (retryError) {
              // Si el reintento falla, usamos el diagnóstico local como fallback
              console.log('Reintento fallido, usando diagnóstico local como fallback');
              const fallbackDiagnostic = await generateLocalDiagnosticResult();
              userData.value.diagnostic = fallbackDiagnostic;
              return fallbackDiagnostic;
            }
          };
          
          // Si el error ya es un ErrorState de nuestro sistema, lo propagamos con la función de reintento
          if (apiError && typeof apiError === 'object' && 'type' in apiError) {
            // Actualizamos el error con la función de reintento
            apiError.retry = retryFn;
            throw apiError;
          }
          
          // Si no es un ErrorState, creamos uno nuevo
          throw handleFetchError(
            apiError, 
            'Error al generar el diagnóstico. Por favor, inténtalo de nuevo.',
            retryFn
          );
        }
      }
    } catch (error) {
      console.error('Error al analizar perfil:', error);
      
      // Si es un error que ya hemos manejado, lo propagamos
      if (error && typeof error === 'object' && 'type' in error) {
        throw error;
      }
      
      // En caso de otros errores, generamos un diagnóstico local como fallback y propagamos el error
      console.log('Generando diagnóstico fallback debido a error');
      const fallbackDiagnostic = await generateLocalDiagnosticResult();
      userData.value.diagnostic = fallbackDiagnostic;
      
      const retryFn = async () => await analyzeProfile();
      
      throw handleFetchError(
        error,
        'Error al analizar tu perfil. Se ha generado un diagnóstico básico como alternativa.',
        retryFn
      );
    } finally {
      isAnalyzing.value = false;
      console.log('Análisis de perfil completado');
    }
  };

  // Función local para generar el diagnóstico (usado como fallback o en modo mock)
  const generateLocalDiagnosticResult = async (): Promise<DiagnosticResult> => {
    console.log('Generando diagnóstico local');
    try {
      // Intentamos obtener cursos y servicios reales incluso en modo mock
      console.log('Obteniendo cursos y servicios para diagnóstico local');
      const { courses, services } = await apiService.getCoursesAndServices();
      console.log('Cursos obtenidos para diagnóstico local:', courses);
      console.log('Servicios obtenidos para diagnóstico local:', services);
      
      // Si obtuvimos datos reales, los usamos
      if (courses.length > 0 && services.length > 0) {
        console.log('Usando datos reales para diagnóstico local');
        // Seleccionamos algunos cursos y servicios según el perfil
        const selectedCourses = courses.slice(0, Math.min(2, courses.length));
        const selectedServices = services.slice(0, Math.min(1, services.length));
        
        console.log('Cursos seleccionados para diagnóstico local:', selectedCourses);
        console.log('Servicios seleccionados para diagnóstico local:', selectedServices);
        
        const result = {
          professionalProfile: determineProfile(),
          strengths: determineStrengths(),
          recommendations: determineRecommendations(),
          courses: selectedCourses,
          services: selectedServices
        };
        
        console.log('Diagnóstico local generado con datos reales:', result);
        return result;
      }
    } catch (error) {
      console.error('Error al obtener cursos y servicios para diagnóstico local:', error);
      // Continuamos con datos mock si hay un error
    }
    
    console.log('Generando diagnóstico local con datos dummy');
    
    // Si no se pudieron obtener datos reales, usamos datos dummy
    const dummyCourses = generateDummyCourses();
    const dummyServices = generateDummyServices();
    
    const result = {
      professionalProfile: determineProfile(),
      strengths: determineStrengths(),
      recommendations: determineRecommendations(),
      courses: dummyCourses,
      services: dummyServices
    };
    
    console.log('Diagnóstico local con datos dummy:', result);
    return result as DiagnosticResult;
  };

  // Determinar el perfil profesional basado en las respuestas
  const determineProfile = (): string => {
    // Lógica simple basada en el tipo de trabajador
    if (userData.value.workStatus === 'freelancer') {
      return 'Profesional Independiente Innovador';
    } else if (userData.value.workStatus === 'business_owner') {
      return 'Líder Empresarial Tecnológico';
    } else {
      return 'Profesional Corporativo Adaptable';
    }
  };

  // Determinar fortalezas basadas en las respuestas
  const determineStrengths = (): string[] => {
    const strengths = ['Adaptabilidad', 'Pensamiento analítico'];
    
    // Añadir fortalezas basadas en respuestas específicas
    if (userData.value.workStatus === 'freelancer') {
      strengths.push('Autonomía', 'Versatilidad');
      
      // Añadir basado en experiencia
      if (userData.value.freelancer?.experience === 'more_than_6') {
        strengths.push('Experiencia consolidada');
      }
      
      // Añadir basado en número de clientes
      if (userData.value.freelancer?.clientsPerMonth === 'more_than_10') {
        strengths.push('Gestión de múltiples clientes');
      }
    } else if (userData.value.workStatus === 'business_owner') {
      strengths.push('Liderazgo', 'Visión estratégica');
      
      // Añadir basado en tamaño de empresa
      if (userData.value.businessOwner?.employeeCount === '50_plus') {
        strengths.push('Gestión de equipos grandes');
      }
    }
    
    // Añadir basado en inversión en IA
    if (userData.value.commonAI?.investment === 'over_100') {
      strengths.push('Inversión en tecnología');
    }
    
    return strengths;
  };

  // Determinar recomendaciones basadas en las respuestas
  const determineRecommendations = (): string[] => {
    const recommendations = [
      'Integrar herramientas de IA en tu flujo de trabajo',
      'Mantente actualizado con las últimas tendencias en IA'
    ];
    
    // Añadir recomendaciones específicas según el perfil
    if (userData.value.workStatus === 'freelancer') {
      recommendations.push(
        'Considera automatizar tareas repetitivas para aumentar tu productividad',
        'Explora herramientas de IA que te ayuden a mejorar tus propuestas comerciales'
      );
    } else if (userData.value.workStatus === 'business_owner') {
      recommendations.push(
        'Implementa soluciones de IA para optimizar procesos en tu empresa',
        'Considera formar a tu equipo en el uso efectivo de herramientas de IA'
      );
    } else {
      recommendations.push(
        'Utiliza herramientas de IA para destacar en tu entorno laboral',
        'Desarrolla habilidades en IA que complementen tu perfil profesional'
      );
    }
    
    return recommendations;
  };

  // Generar cursos dummy para fallback
  const generateDummyCourses = () => {
    if (userData.value.workStatus === 'freelancer') {
      return [
        {
          title: 'Automatización Freelance con IA',
          description: 'Aprende a automatizar tareas repetitivas para aumentar tu productividad como freelancer.',
          difficulty: 'intermedio',
          price: '89€',
          link: '#curso-freelance-ia'
        },
        {
          title: 'Propuestas Comerciales con IA para Freelancers',
          description: 'Crea propuestas de alta conversión utilizando herramientas de IA que impresionarán a tus clientes.',
          difficulty: 'principiante',
          price: '69€',
          link: '#propuestas-comerciales'
        }
      ];
    } else if (userData.value.workStatus === 'business_owner') {
      return [
        {
          title: 'IA para Emprendedores',
          description: 'Estrategias para implementar IA en tu negocio y obtener ventajas competitivas.',
          difficulty: 'intermedio',
          price: '149€',
          link: '#ia-emprendedores'
        },
        {
          title: 'Automatización de Procesos de Negocio',
          description: 'Implementa flujos de trabajo automatizados que reducirán costos y aumentarán la eficiencia operativa.',
          difficulty: 'avanzado',
          price: '199€',
          link: '#automatizacion-procesos'
        }
      ];
    } else {
      // Para empleados u otros
      return [
        {
          title: 'IA para Productividad Personal',
          description: 'Optimiza tu trabajo diario y destaca en tu empresa con herramientas de IA.',
          difficulty: 'principiante',
          price: '79€',
          link: '#ia-productividad'
        },
        {
          title: 'Automatización de Informes y Análisis',
          description: 'Aprende a crear informes automáticos y análisis de datos usando IA que impresionarán a tus jefes.',
          difficulty: 'intermedio',
          price: '109€',
          link: '#automatizacion-informes'
        }
      ];
    }
  };

  // Generar servicios dummy para fallback
  const generateDummyServices = () => {
    return [
      {
        title: 'Asistente Virtual IA',
        description: 'Un asistente virtual personalizado que maneja tus emails, agenda y tareas administrativas.',
        type: 'automatización',
        price: 'Desde 49€/mes',
        link: '#asistente-virtual'
      }
    ];
  };

  // Función para limpiar errores específicos del diagnóstico
  const clearDiagnosticError = () => {
    clearError();
  };

  // Función para registrar clics en recomendaciones (para futuras implementaciones)
  const trackRecommendationClick = async (itemId: string, itemType: 'course' | 'service') => {
    console.log(`Clic en ${itemType}: ${itemId}`);
    // Aquí se podría implementar tracking real en el futuro
  };

  return {
    isLoading: computed(() => isAnalyzing.value || apiService.isLoading.value),
    error, // Export the error directly to allow clear operations
    analyzeProfile,
    trackRecommendationClick,
    clearDiagnosticError
  };
}
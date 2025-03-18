import { ref, computed } from 'vue';
import type { UserData, DiagnosticResult, CourseRecommendation, ServiceRecommendation } from '~/types/questionnaire';
import useErrorHandling from './useErrorHandling';

/**
 * Composable para manejar todas las comunicaciones con la API de n8n
 */
export default function useApiService() {
  // Estados para manejar las operaciones de API
  const isLoading = ref(false);
  const { error, setError, handleFetchError, withErrorHandling, clearError } = useErrorHandling();

  // En una SPA, accedemos a la configuración a través de useRuntimeConfig
  const config = useRuntimeConfig();

  // URL base para API
  const isProd = process.env.NODE_ENV === 'production';

  // Endpoints específicos
  const endpointGetCoursesAndServices = isProd
    ? 'https://holaamigo.app.n8n.cloud/webhook/95ac46f3-f88c-424d-b6a5-dcac46d87d14'
    : 'https://holaamigo.app.n8n.cloud/webhook-test/95ac46f3-f88c-424d-b6a5-dcac46d87d14';

  const endpointCreateUser = isProd
    ? 'https://holaamigo.app.n8n.cloud/webhook/84938877-de13-46de-aa2e-d4eb0d5731b4'
    : 'https://holaamigo.app.n8n.cloud/webhook-test/84938877-de13-46de-aa2e-d4eb0d5731b4';

  const endpointTrackShare = isProd
    ? 'https://holaamigo.app.n8n.cloud/webhook/track-share'
    : 'https://holaamigo.app.n8n.cloud/webhook-test/track-share';

  const endpointReferralCount = isProd
    ? 'https://holaamigo.app.n8n.cloud/webhook/referral-count'
    : 'https://holaamigo.app.n8n.cloud/webhook-test/referral-count';

  /**
   * Headers comunes para todas las peticiones API
   */
  const getHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  };

  /**
   * Función para verificar la conexión a internet
   */
  const checkConnection = () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw setError('connection', 'No hay conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo.');
    }
  };

  /**
   * Función para manejar la respuesta de una petición
   */
  const handleResponse = async (response: Response) => {
    if (!response.ok) {
      let errorText = 'Error desconocido';
      try {
        errorText = await response.text();
      } catch (e) {
        console.error('Error al leer respuesta de error:', e);
      }

      let errorMessage = `Error en la API: ${response.status}`;

      try {
        // Intentar parsear el mensaje de error si es JSON
        const errorJson = JSON.parse(errorText);
        if (errorJson.message) {
          errorMessage = errorJson.message;
        }
      } catch (e) {
        // Si no es JSON, usar el texto tal como está
        if (errorText && errorText.length < 100) {
          errorMessage = `${errorMessage} - ${errorText}`;
        }
      }

      // Manejar diferentes códigos de error HTTP
      if (response.status === 404) {
        throw setError('notFound', 'El recurso solicitado no está disponible.', { status: response.status, details: errorText });
      } else if (response.status >= 400 && response.status < 500) {
        throw setError('validation', errorMessage, { status: response.status, details: errorText });
      } else if (response.status >= 500) {
        throw setError('server', 'Error del servidor. Por favor, inténtalo más tarde.', { status: response.status, details: errorText });
      } else {
        throw setError('unknown', errorMessage, { status: response.status, details: errorText });
      }
    }

    try {
      return await response.json();
    } catch (e) {
      throw setError('validation', 'La respuesta del servidor no es un JSON válido.', { error: e });
    }
  };

  /**
   * Obtiene la lista de cursos y servicios desde Airtable mediante n8n
   * @returns Promise con el resultado de cursos y servicios
   */
  const getCoursesAndServices = async () => {
    clearError();
    isLoading.value = true;

    try {
      checkConnection();

      console.log('Obteniendo cursos y servicios desde:', endpointGetCoursesAndServices);

      const response = await fetch(endpointGetCoursesAndServices, {
        method: 'GET',
        headers: getHeaders()
      });

      const data = await handleResponse(response);
      console.log('Datos recibidos de API:', data);

      // Verificamos la estructura exacta de los datos
      if (!data.state || !data.state.courses || !data.state.services) {
        throw setError('validation', 'La respuesta del servidor no tiene el formato esperado.', data);
      }

      // Procesamos los datos recibidos para adaptarlos a nuestro formato
      const courses: CourseRecommendation[] = data.state.courses.map((item: any) => {
        const course = {
          id: item.json?.id || '',
          title: item.json?.name || 'Curso sin nombre',
          description: item.json?.description || 'Sin descripción',
          difficulty: item.json?.difficulty || 'intermedio' as const,
          price: item.json?.price || '',
          link: `#curso-${item.json?.id || 'unknown'}`
        };
        console.log('Curso procesado:', course);
        return course;
      });

      const services: ServiceRecommendation[] = data.state.services.map((item: any) => {
        const service = {
          id: item.json?.id || '',
          title: item.json?.name || 'Servicio sin nombre',
          description: item.json?.description || 'Sin descripción',
          type: item.json?.type || 'automatización' as const,
          price: item.json?.price || '',
          link: `#servicio-${item.json?.id || 'unknown'}`
        };
        console.log('Servicio procesado:', service);
        return service;
      });

      // Eliminar duplicados (parecen haber algunos en los servicios)
      const uniqueServices = services.filter((service, index, self) =>
        index === self.findIndex((s) => s.id === service.id)
      );

      console.log('Total cursos procesados:', courses.length);
      console.log('Total servicios procesados:', uniqueServices.length);

      return {
        courses,
        services: uniqueServices
      };
    } catch (err) {
      // Si err ya es un ErrorState de nuestro sistema, no hace falta procesarlo de nuevo
      if (err && typeof err === 'object' && 'type' in err) {
        throw err;
      }

      const retryFn = async () => await getCoursesAndServices();

      throw handleFetchError(
        err,
        'Error al obtener las recomendaciones. Por favor, inténtalo de nuevo.',
        retryFn
      );
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Envía los datos del usuario, incluyendo análisis y selecciones a Airtable mediante n8n
   * @param userData Datos del usuario
   * @param analysis Análisis generado
   * @param selectedCourses IDs de los cursos seleccionados
   * @param selectedServices IDs de los servicios seleccionados
   * @returns Promise con el resultado de la creación
   */
  const createUserRecord = async (
    userData: UserData,
    analysis: string,
    selectedCourses: string[],
    selectedServices: string[]
  ) => {
    clearError();
    isLoading.value = true;

    try {
      checkConnection();

      const payload = {
        name: userData.name,
        email: userData.email || '',
        analisis: analysis,
        courses: selectedCourses,
        services: selectedServices,
        workStatus: userData.workStatus || '',
        referralCode: userData.referralCode || '',
        // Agregar información sobre la fuente del referido si existe
        referredBy: (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('ref')) || ''
      };

      console.log('Enviando datos de usuario a:', endpointCreateUser);
      console.log('Payload:', payload);

      const response = await fetch(endpointCreateUser, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      const result = await handleResponse(response);

      console.log('Respuesta de creación de usuario:', result);

      return {
        success: true,
        recordId: result.id,
        createdTime: result.createdTime,
        referralCode: result.referralCode || userData.referralCode || generateReferralCode(userData.name)
      };
    } catch (err) {
      // Si err ya es un ErrorState de nuestro sistema, no hace falta procesarlo de nuevo
      if (err && typeof err === 'object' && 'type' in err) {
        throw err;
      }

      const retryFn = async () => await createUserRecord(userData, analysis, selectedCourses, selectedServices);

      throw handleFetchError(
        err,
        'Error al guardar los datos. Por favor, inténtalo de nuevo.',
        retryFn
      );
    } finally {
      isLoading.value = false;
    }
  };

  /**
 * Envía los datos completos del cuestionario para análisis y almacenamiento
 * @param userData Datos completos del usuario y sus respuestas
 * @returns Promise con el resultado del diagnóstico
 */
  const submitQuestionnaire = async (userData: UserData): Promise<DiagnosticResult> => {
    clearError();
    isLoading.value = true;
    
    console.log('Submitting questionnaire data:', userData);
    
    try {
      checkConnection();
      
      // Get the correct API URL from the runtime config
      const config = useRuntimeConfig();
      const webhookUrl = config.public.apiBaseUrl;
      
      console.log('Using webhook URL:', webhookUrl);
      
      // Send data to the webhook
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ userData }) // Make sure we're wrapping userData in an object
      });
      
      console.log('Response status:', response.status);
      
      // Check if the response is OK
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error from API: ${response.status} - ${errorText}`);
      }
      
      // Parse the response
      const result = await response.json();
      console.log('Parsed response:', result);
      
      // Check if there was an error in the response
      if (result.responseType === 'error') {
        throw new Error(result.message || 'Error en el análisis del cuestionario');
      }
      
      // The diagnostic result should be in result.data
      const diagnosticResult = result.data || result;
      
      console.log('Diagnostic result:', diagnosticResult);
      
      // Return the diagnostic result
      return diagnosticResult;
      
    } catch (err) {
      console.error('Error in submitQuestionnaire:', err);
      
      // Handle error with retry function
      const retryFn = async () => await submitQuestionnaire(userData);
      
      throw handleFetchError(
        err, 
        'Error al procesar el cuestionario. Por favor, inténtalo de nuevo.',
        retryFn
      );
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Registra un evento de compartir
   * @param userId ID del usuario
   * @param method Método de compartir (whatsapp, twitter, etc.)
   */
  const trackShare = async (userId: string, method: string) => {
    clearError();

    try {
      checkConnection();

      const payload = {
        userId,
        method,
        timestamp: new Date().toISOString()
      };

      console.log('Registrando compartir:', payload);

      const response = await fetch(endpointTrackShare, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });

      await handleResponse(response);

      return { success: true };
    } catch (err) {
      // En este caso no propagamos el error, solo lo registramos
      // porque no es crítico para la experiencia del usuario
      console.error('Error al registrar compartir:', err);
      return { success: false };
    }
  };

  /**
   * Obtiene el conteo de referidos para un usuario
   * @param userId ID del usuario
   */
  const getReferralCount = async (userId: string) => {
    clearError();

    try {
      checkConnection();

      const url = `${endpointReferralCount}?userId=${encodeURIComponent(userId)}`;
      console.log('Obteniendo conteo de referidos:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
      });

      const result = await handleResponse(response);

      return {
        success: true,
        count: result.count || 0
      };
    } catch (err) {
      // En este caso no propagamos el error, solo lo registramos
      // porque no es crítico para la experiencia del usuario
      console.error('Error al obtener conteo de referidos:', err);
      return {
        success: false,
        count: 0
      };
    }
  };

  // Función para obtener un texto legible de la experiencia
  const getUserFriendlyExperience = (experience: string): string => {
    switch (experience) {
      case 'less_than_1':
        return 'menos de 1 año';
      case '1_to_3':
        return '1 a 3 años';
      case '4_to_6':
        return '4 a 6 años';
      case 'more_than_6':
        return 'más de 6 años';
      default:
        return experience;
    }
  };

  // Funciones auxiliares para determinar el perfil del usuario

  const determineProfile = (userData: UserData): string => {
    // Lógica para determinar el perfil profesional basado en las respuestas
    if (userData.workStatus === 'freelancer') {
      if (userData.freelancer?.experience === 'more_than_6') {
        return 'Freelancer Experto';
      } else if (userData.freelancer?.experience === '4_to_6') {
        return 'Freelancer Consolidado';
      } else {
        return 'Freelancer Emergente';
      }
    } else if (userData.workStatus === 'business_owner') {
      if (userData.businessOwner?.employeeCount === 'solo' || userData.businessOwner?.employeeCount === '2_5') {
        return 'Emprendedor en Crecimiento';
      } else {
        return 'Empresario Establecido';
      }
    } else if (userData.workStatus === 'full_time') {
      return 'Profesional Corporativo';
    } else if (userData.workStatus === 'part_time') {
      return 'Profesional Flexible';
    } else {
      return 'Profesional Versátil';
    }
  };

  const determineStrengths = (userData: UserData): string[] => {
    const strengths = ['Adaptabilidad', 'Visión innovadora'];

    // Añadir fortalezas basadas en el tipo de trabajador
    if (userData.workStatus === 'freelancer') {
      strengths.push('Autonomía', 'Versatilidad');

      // Fortalezas específicas según experiencia como freelancer
      if (userData.freelancer?.experience === 'more_than_6') {
        strengths.push('Expertise consolidada');
      } else if (userData.freelancer?.experience === '4_to_6') {
        strengths.push('Experiencia significativa');
      }

      // Fortalezas según cantidad de clientes
      if (userData.freelancer?.clientsPerMonth === 'more_than_10') {
        strengths.push('Gestión de múltiples clientes');
      } else if (userData.freelancer?.clientsPerMonth === '6_10') {
        strengths.push('Diversificación de cartera');
      }
    } else if (userData.workStatus === 'business_owner') {
      strengths.push('Liderazgo', 'Visión estratégica');

      // Fortalezas según tamaño de empresa
      if (userData.businessOwner?.employeeCount === '50_plus') {
        strengths.push('Gestión de equipos grandes');
      } else if (userData.businessOwner?.employeeCount === '21_50') {
        strengths.push('Escalamiento empresarial');
      }

      // Fortalezas según tipo de empresa
      if (userData.businessOwner?.businessType === 'tech_startup') {
        strengths.push('Innovación tecnológica');
      } else if (userData.businessOwner?.businessType === 'creative_agency') {
        strengths.push('Creatividad aplicada');
      }
    } else {
      strengths.push('Integración organizacional');

      // Fortalezas para empleados
      if (userData.workStatus === 'full_time') {
        strengths.push('Compromiso y estabilidad');
      } else if (userData.workStatus === 'part_time') {
        strengths.push('Equilibrio y multitarea');
      }
    }

    // Fortalezas basadas en inversión en IA
    if (userData.commonAI?.investment === 'over_100') {
      strengths.push('Inversión en tecnología');
    } else if (userData.commonAI?.investment === '50_to_100') {
      strengths.push('Adopción tecnológica');
    }

    // Fortalezas basadas en la actitud hacia la IA
    if (userData.commonAI?.disclosure === 'always') {
      strengths.push('Transparencia y ética');
    }

    return strengths.slice(0, 5); // Limitamos a 5 fortalezas para no sobrecargar el informe
  };

  const determineRecommendations = (userData: UserData): string[] => {
    const recommendations = [
      'Integrar herramientas de IA en tu flujo de trabajo diario',
      'Mantenerte actualizado con las últimas tendencias en IA'
    ];

    // Recomendaciones basadas en el tipo de trabajador
    if (userData.workStatus === 'freelancer') {
      recommendations.push(
        'Automatizar tareas repetitivas para aumentar tu productividad',
        'Utilizar IA para mejorar tus propuestas y materiales de marketing'
      );

      // Recomendaciones específicas según experiencia
      if (userData.freelancer?.experience === 'less_than_1' || userData.freelancer?.experience === '1_to_3') {
        recommendations.push('Invertir en formación especializada en IA para tu sector');
      } else {
        recommendations.push('Considerar ofrecer servicios de asesoría en IA a tus clientes');
      }

      // Recomendaciones según plataformas
      if (userData.freelancer?.platforms.includes('upwork') || userData.freelancer?.platforms.includes('fiverr')) {
        recommendations.push('Destacar tus habilidades con IA en tu perfil de plataformas freelance');
      }
    } else if (userData.workStatus === 'business_owner') {
      recommendations.push(
        'Implementar soluciones de IA para optimizar procesos operativos',
        'Formar a tu equipo en el uso efectivo de herramientas de IA'
      );

      // Recomendaciones según tamaño de empresa
      if (userData.businessOwner?.employeeCount === 'solo' || userData.businessOwner?.employeeCount === '2_5') {
        recommendations.push('Utilizar IA como multiplicador de capacidad para tu pequeño equipo');
      } else {
        recommendations.push('Desarrollar una estrategia de IA integrada para toda la organización');
      }

      // Recomendaciones según política de IA
      if (userData.businessOwner?.aiPolicy === 'not_considered' || userData.businessOwner?.aiPolicy === 'no_plans') {
        recommendations.push('Establecer políticas claras sobre el uso de IA en tu empresa');
      }
    } else {
      recommendations.push(
        'Utilizar herramientas de IA para destacar en tu entorno laboral',
        'Desarrollar habilidades en IA que complementen tu perfil profesional'
      );
    }

    // Recomendaciones basadas en la inversión en IA
    if (userData.commonAI?.investment === 'none' || userData.commonAI?.investment === 'under_50') {
      recommendations.push('Explorar soluciones de IA más avanzadas que puedan ofrecer mayor retorno de inversión');
    }

    // Recomendaciones basadas en la experiencia con IA
    if (userData.commonAI?.projectImpact === 'negative' || userData.commonAI?.projectImpact === 'mixed') {
      recommendations.push('Buscar formación especializada para maximizar los beneficios de la IA');
    }

    return recommendations.slice(0, 5); // Limitamos a 5 recomendaciones
  };

  const filterRelevantCourses = (courses: CourseRecommendation[], userData: UserData): CourseRecommendation[] => {
    // Si tenemos pocos cursos, los devolvemos todos
    if (courses.length <= 2) return courses;

    // Filtrar por relevancia
    let relevantCourses: CourseRecommendation[] = [];

    // Cursos específicos para el tipo de trabajador
    if (userData.workStatus === 'freelancer') {
      relevantCourses = courses.filter(course =>
        course.title.toLowerCase().includes('freelance') ||
        course.title.toLowerCase().includes('independiente') ||
        course.description.toLowerCase().includes('freelance')
      );
    } else if (userData.workStatus === 'business_owner') {
      relevantCourses = courses.filter(course =>
        course.title.toLowerCase().includes('empresa') ||
        course.title.toLowerCase().includes('negocio') ||
        course.description.toLowerCase().includes('empresa')
      );
    } else {
      relevantCourses = courses.filter(course =>
        course.title.toLowerCase().includes('empleado') ||
        course.title.toLowerCase().includes('carrera') ||
        course.description.toLowerCase().includes('corporativo')
      );
    }

    // Si no encontramos cursos relevantes, usar una selección aleatoria
    if (relevantCourses.length === 0) {
      const shuffled = [...courses].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(2, courses.length));
    }

    // Si tenemos más de 2 cursos relevantes, tomamos una muestra
    if (relevantCourses.length > 2) {
      relevantCourses = relevantCourses.slice(0, 2);
    }

    return relevantCourses;
  };

  const filterRelevantServices = (services: ServiceRecommendation[], userData: UserData): ServiceRecommendation[] => {
    // Si tenemos pocos servicios, los devolvemos todos
    if (services.length <= 1) return services;

    // Filtrar por relevancia
    let relevantServices: ServiceRecommendation[] = [];

    // Servicios específicos para el tipo de trabajador
    if (userData.workStatus === 'freelancer') {
      relevantServices = services.filter(service =>
        service.title.toLowerCase().includes('freelance') ||
        service.description.toLowerCase().includes('independiente')
      );
    } else if (userData.workStatus === 'business_owner') {
      relevantServices = services.filter(service =>
        service.title.toLowerCase().includes('empresa') ||
        service.description.toLowerCase().includes('negocio')
      );
    } else {
      relevantServices = services.filter(service =>
        service.title.toLowerCase().includes('productivity') ||
        service.description.toLowerCase().includes('eficiencia')
      );
    }

    // Si no encontramos servicios relevantes, usar una selección aleatoria
    if (relevantServices.length === 0) {
      const shuffled = [...services].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, Math.min(1, services.length));
    }

    // Si tenemos más de 1 servicio relevante, tomamos el primero
    if (relevantServices.length > 1) {
      relevantServices = relevantServices.slice(0, 1);
    }

    return relevantServices;
  };

  const generateReferralCode = (name: string): string => {
    // Genera un código de referido basado en el nombre y un timestamp
    const namePart = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().substring(0, 6);
    const timestampPart = Date.now().toString(36).substring(4, 10);
    return `${namePart}-${timestampPart}`;
  };

  // Retornamos las funciones y estados del composable
  return {
    isLoading,
    error,
    getCoursesAndServices,
    createUserRecord,
    submitQuestionnaire,
    trackShare,
    getReferralCount
  };
}
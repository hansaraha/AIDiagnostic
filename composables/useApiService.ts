import { ref } from 'vue';
import type { UserData, DiagnosticResult, CourseRecommendation, ServiceRecommendation } from '~/types/questionnaire';

/**
 * Composable para manejar todas las comunicaciones con la API de n8n
 */
export default function useApiService() {
  // Estados para manejar las operaciones de API
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
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
   * Obtiene la lista de cursos y servicios desde Airtable mediante n8n
   * @returns Promise con el resultado de cursos y servicios
   */
 const getCoursesAndServices = async () => {
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('Obteniendo cursos y servicios desde:', endpointGetCoursesAndServices);
      
      const response = await fetch(endpointGetCoursesAndServices, {
        method: 'GET',
        headers: getHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos de API:', data);
      
      // Verificamos la estructura exacta de los datos
      if (!data.state || !data.state.courses || !data.state.services) {
        console.error('Estructura de datos inesperada:', data);
        throw new Error('Estructura de datos inesperada de la API');
      }
      
      // Procesamos los datos recibidos para adaptarlos a nuestro formato
      const courses: CourseRecommendation[] = data.state.courses.map((item: any) => {
        const course = {
          id: item.json?.id || '',
          title: item.json?.name || 'Curso sin nombre',
          description: item.json?.description || 'Sin descripción',
          difficulty: item.json?.difficulty || 'intermedio' as const, // Valor por defecto
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
          type: item.json?.type || 'automatización' as const, // Valor por defecto
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
      error.value = err instanceof Error ? err.message : 'Error desconocido en la API';
      console.error('Error al obtener cursos y servicios:', error.value);
      return {
        courses: [],
        services: []
      };
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
    isLoading.value = true;
    error.value = null;
    
    try {
      const payload = {
        name: userData.name,
        email: userData.email || '',
        analisis: analysis,
        courses: selectedCourses,
        services: selectedServices
      };
      
      const response = await fetch(endpointCreateUser, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
      
      const result = await response.json();
      return {
        success: true,
        recordId: result.id,
        createdTime: result.createdTime
      };
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido en la API';
      console.error('Error al crear registro de usuario:', error.value);
      return {
        success: false,
        error: error.value
      };
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
    isLoading.value = true;
    error.value = null;
    
    try {
      console.log('Enviando datos del cuestionario:', userData);
      
      // Primero obtenemos los cursos y servicios disponibles
      const { courses, services } = await getCoursesAndServices();
      console.log('Cursos obtenidos:', courses);
      console.log('Servicios obtenidos:', services);
      
      // Verificamos que tengamos datos
      if (courses.length === 0 || services.length === 0) {
        console.warn('No se obtuvieron cursos o servicios de la API');
      }
      
      // Generamos un análisis básico basado en el perfil de usuario
      let professionalProfile = 'Profesional Innovador';
      let strengths = ['Adaptabilidad', 'Pensamiento analítico'];
      let recommendations = ['Integrar herramientas de IA en tu flujo de trabajo'];
      
      // Seleccionamos algunos cursos y servicios basados en el perfil del usuario
      const selectedCourses = courses.length > 0 ? courses.slice(0, Math.min(2, courses.length)) : [];
      const selectedServices = services.length > 0 ? services.slice(0, Math.min(1, services.length)) : [];
      
      console.log('Cursos seleccionados:', selectedCourses);
      console.log('Servicios seleccionados:', selectedServices);
      
      // IDs para enviar al backend
      const courseIds = selectedCourses.map(course => course.id || '').filter(id => id !== '');
      const serviceIds = selectedServices.map(service => service.id || '').filter(id => id !== '');
      
      // Generamos un análisis de texto basado en el perfil
      let analysisText = `Basado en tus respuestas, has sido identificado como un ${professionalProfile}. 
Tus principales fortalezas incluyen ${strengths.join(', ')}. 
Recomendamos que consideres ${recommendations.join(', ')}.`;
      
      // Agregamos información sobre la experiencia y otros datos relevantes
      if (userData.workStatus === 'freelancer' && userData.freelancer) {
        analysisText += `\nComo freelancer con ${userData.freelancer.experience} de experiencia, 
puedes beneficiarte especialmente de herramientas que automaticen tareas repetitivas.`;
      } else if (userData.workStatus === 'business_owner' && userData.businessOwner) {
        analysisText += `\nComo propietario de negocio, puedes mejorar tu eficiencia implementando 
soluciones de IA que ayuden a escalar tus operaciones.`;
      }
      
      console.log('Análisis generado:', analysisText);
      console.log('IDs de cursos para Airtable:', courseIds);
      console.log('IDs de servicios para Airtable:', serviceIds);
      
      try {
        // Guardamos el registro en Airtable a través de n8n
        const createResult = await createUserRecord(
          userData,
          analysisText,
          courseIds,
          serviceIds
        );
        
        console.log('Resultado de creación de usuario:', createResult);
        
        if (createResult.success) {
          // Si la creación fue exitosa, actualizamos el ID del usuario para referencia futura
          userData.id = createResult.recordId;
        }
      } catch (createError) {
        console.error('Error al crear registro en Airtable:', createError);
        // Continuamos incluso si hay error en la creación del registro
      }
      
      // Construimos y retornamos el diagnóstico completo
      const diagnosticResult: DiagnosticResult = {
        professionalProfile,
        strengths,
        recommendations,
        courses: selectedCourses,
        services: selectedServices
      };
      
      console.log('Diagnóstico final generado:', diagnosticResult);
      return diagnosticResult;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido en la API';
      console.error('Error al enviar cuestionario:', error.value);
      
      // Retornar un diagnóstico básico en caso de error
      return {
        professionalProfile: 'Error al generar perfil',
        strengths: ['No se pudieron determinar las fortalezas debido a un error'],
        recommendations: ['Intenta completar el cuestionario nuevamente'],
        courses: [],
        services: []
      };
    } finally {
      isLoading.value = false;
    }
  };
  
  // Retornamos las funciones y estados del composable
  return {
    isLoading,
    error,
    getCoursesAndServices,
    createUserRecord,
    submitQuestionnaire
  };
}
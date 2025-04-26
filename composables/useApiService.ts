import { ref } from "vue";
import type {
  UserData,
  DiagnosticResult,
  CourseRecommendation,
  ServiceRecommendation,
} from "~/types/questionnaire";
import useErrorHandling from "./useErrorHandling";

export default function useApiService() {
  const isLoading = ref(false);
  const { error, setError, handleFetchError, clearError } = useErrorHandling();

  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  };

  const checkConnection = () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      throw setError(
        "connection",
        "No hay conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo."
      );
    }
  };

  const submitQuestionnaire = async (
    userData: UserData
  ): Promise<DiagnosticResult> => {
    clearError();
    isLoading.value = true;

    try {
      checkConnection();

      const webhookUrl =
        "https://holaamigo.app.n8n.cloud/webhook-test/user-data";

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ userData }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Error from API: ${response.status} - ${errorText}`);
      }

      // Parse the response
      const result = await response.json();

      if (result.responseType === "error") {
        throw new Error(
          result.message || "Error en el análisis del cuestionario"
        );
      }

      // The diagnostic result should be in result.data
      const diagnosticResult = result.data || result;

      console.log("Diagnostic result:", diagnosticResult);

      // Return the diagnostic result
      return diagnosticResult;
    } catch (err) {
      console.error("Error in submitQuestionnaire:", err);

      // Handle error with retry function
      const retryFn = async () => {
        await submitQuestionnaire(userData);
      };

      throw handleFetchError(
        err,
        "Error al procesar el cuestionario. Por favor, inténtalo de nuevo.",
        retryFn
      );
    } finally {
      isLoading.value = false;
    }
  };

  // Función para obtener un texto legible de la experiencia
  const getUserFriendlyExperience = (experience: string): string => {
    switch (experience) {
      case "less_than_1":
        return "menos de 1 año";
      case "1_to_3":
        return "1 a 3 años";
      case "4_to_6":
        return "4 a 6 años";
      case "more_than_6":
        return "más de 6 años";
      default:
        return experience;
    }
  };

  // Funciones auxiliares para determinar el perfil del usuario

  const determineProfile = (userData: UserData): string => {
    // Lógica para determinar el perfil profesional basado en las respuestas
    if (userData.workStatus === "freelancer") {
      if (userData.freelancer?.experience === "more_than_6") {
        return "Freelancer Experto";
      } else if (userData.freelancer?.experience === "4_to_6") {
        return "Freelancer Consolidado";
      } else {
        return "Freelancer Emergente";
      }
    } else if (userData.workStatus === "business_owner") {
      if (
        userData.businessOwner?.employeeCount === "solo" ||
        userData.businessOwner?.employeeCount === "2_5"
      ) {
        return "Emprendedor en Crecimiento";
      } else {
        return "Empresario Establecido";
      }
    } else if (userData.workStatus === "full_time") {
      return "Profesional Corporativo";
    } else if (userData.workStatus === "part_time") {
      return "Profesional Flexible";
    } else {
      return "Profesional Versátil";
    }
  };

  const determineStrengths = (userData: UserData): string[] => {
    const strengths = ["Adaptabilidad", "Visión innovadora"];

    // Añadir fortalezas basadas en el tipo de trabajador
    if (userData.workStatus === "freelancer") {
      strengths.push("Autonomía", "Versatilidad");

      // Fortalezas específicas según experiencia como freelancer
      if (userData.freelancer?.experience === "more_than_6") {
        strengths.push("Expertise consolidada");
      } else if (userData.freelancer?.experience === "4_to_6") {
        strengths.push("Experiencia significativa");
      }
    } else if (userData.workStatus === "business_owner") {
      strengths.push("Liderazgo", "Visión estratégica");

      // Fortalezas según tamaño de empresa
      if (userData.businessOwner?.employeeCount === "50_plus") {
        strengths.push("Gestión de equipos grandes");
      } else if (userData.businessOwner?.employeeCount === "21_50") {
        strengths.push("Escalamiento empresarial");
      }
    } else {
      strengths.push("Integración organizacional");

      // Fortalezas para empleados
      if (userData.workStatus === "full_time") {
        strengths.push("Compromiso y estabilidad");
      } else if (userData.workStatus === "part_time") {
        strengths.push("Equilibrio y multitarea");
      }
    }

    return strengths.slice(0, 5); // Limitamos a 5 fortalezas para no sobrecargar el informe
  };

  const determineRecommendations = (userData: UserData): string[] => {
    const recommendations = [
      "Integrar herramientas de IA en tu flujo de trabajo diario",
      "Mantenerte actualizado con las últimas tendencias en IA",
    ];

    // Recomendaciones basadas en el tipo de trabajador
    if (userData.workStatus === "freelancer") {
      recommendations.push(
        "Automatizar tareas repetitivas para aumentar tu productividad",
        "Utilizar IA para mejorar tus propuestas y materiales de marketing"
      );

      // Recomendaciones específicas según experiencia
      if (
        userData.freelancer?.experience === "less_than_1" ||
        userData.freelancer?.experience === "1_to_3"
      ) {
        recommendations.push(
          "Invertir en formación especializada en IA para tu sector"
        );
      } else {
        recommendations.push(
          "Considerar ofrecer servicios de asesoría en IA a tus clientes"
        );
      }

      // Recomendaciones según plataformas
    } else if (userData.workStatus === "business_owner") {
      recommendations.push(
        "Implementar soluciones de IA para optimizar procesos operativos",
        "Formar a tu equipo en el uso efectivo de herramientas de IA"
      );

      // Recomendaciones según tamaño de empresa
      if (
        userData.businessOwner?.employeeCount === "solo" ||
        userData.businessOwner?.employeeCount === "2_5"
      ) {
        recommendations.push(
          "Utilizar IA como multiplicador de capacidad para tu pequeño equipo"
        );
      } else {
        recommendations.push(
          "Desarrollar una estrategia de IA integrada para toda la organización"
        );
      }
    } else {
      recommendations.push(
        "Utilizar herramientas de IA para destacar en tu entorno laboral",
        "Desarrollar habilidades en IA que complementen tu perfil profesional"
      );
    }

    return recommendations.slice(0, 5); // Limitamos a 5 recomendaciones
  };

  const filterRelevantCourses = (
    courses: CourseRecommendation[],
    userData: UserData
  ): CourseRecommendation[] => {
    // Si tenemos pocos cursos, los devolvemos todos
    if (courses.length <= 2) return courses;

    // Filtrar por relevancia
    let relevantCourses: CourseRecommendation[] = [];

    // Cursos específicos para el tipo de trabajador
    if (userData.workStatus === "freelancer") {
      relevantCourses = courses.filter(
        (course) =>
          course.title.toLowerCase().includes("freelance") ||
          course.title.toLowerCase().includes("independiente") ||
          course.description.toLowerCase().includes("freelance")
      );
    } else if (userData.workStatus === "business_owner") {
      relevantCourses = courses.filter(
        (course) =>
          course.title.toLowerCase().includes("empresa") ||
          course.title.toLowerCase().includes("negocio") ||
          course.description.toLowerCase().includes("empresa")
      );
    } else {
      relevantCourses = courses.filter(
        (course) =>
          course.title.toLowerCase().includes("empleado") ||
          course.title.toLowerCase().includes("carrera") ||
          course.description.toLowerCase().includes("corporativo")
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

  const filterRelevantServices = (
    services: ServiceRecommendation[],
    userData: UserData
  ): ServiceRecommendation[] => {
    // Si tenemos pocos servicios, los devolvemos todos
    if (services.length <= 1) return services;

    // Filtrar por relevancia
    let relevantServices: ServiceRecommendation[] = [];

    // Servicios específicos para el tipo de trabajador
    if (userData.workStatus === "freelancer") {
      relevantServices = services.filter(
        (service) =>
          service.title.toLowerCase().includes("freelance") ||
          service.description.toLowerCase().includes("independiente")
      );
    } else if (userData.workStatus === "business_owner") {
      relevantServices = services.filter(
        (service) =>
          service.title.toLowerCase().includes("empresa") ||
          service.description.toLowerCase().includes("negocio")
      );
    } else {
      relevantServices = services.filter(
        (service) =>
          service.title.toLowerCase().includes("productivity") ||
          service.description.toLowerCase().includes("eficiencia")
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
    const namePart = name
      .replace(/[^a-zA-Z0-9]/g, "")
      .toLowerCase()
      .substring(0, 6);
    const timestampPart = Date.now().toString(36).substring(4, 10);
    return `${namePart}-${timestampPart}`;
  };

  return {
    isLoading,
    error,
    submitQuestionnaire,
    determineProfile,
    determineStrengths,
    determineRecommendations,
    filterRelevantCourses,
    filterRelevantServices,
    generateReferralCode,
  };
}

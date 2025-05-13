import { ref } from "vue";
import type { UserData } from "~/types/questionnaire";
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

  const submitQuestionnaire = async (userData: UserData) => {
    clearError();
    isLoading.value = true;

    try {
      checkConnection();

      const webhookUrl = "https://holaamigo.app.n8n.cloud/webhook/user-data";

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

      const result = await response.json();

      if (result.responseType === "error") {
        throw new Error(
          result.message || "Error en el análisis del cuestionario"
        );
      }

      const diagnosticResult = result.data || result;

      console.log("Diagnostic result:", diagnosticResult);

      return diagnosticResult;
    } catch (err) {
      console.error("Error in submitQuestionnaire:", err);

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

  return {
    isLoading,
    error,
    submitQuestionnaire,
  };
}

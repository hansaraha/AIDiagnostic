import { ref, readonly } from "vue";

export type ErrorType =
  | "connection"
  | "server"
  | "validation"
  | "notFound"
  | "unknown"
  | "analysis";

export interface ErrorState {
  type: ErrorType;
  message: string;
  timestamp: number;
  details?: any;
  retry?: () => Promise<void>;
}

export default function useErrorHandling() {
  // Error state with private setter and public getter
  const error = ref<ErrorState | null>(null);

  // Clear the current error
  const clearError = () => {
    error.value = null;
  };

  // Set a new error with optional retry function
  const setError = (
    type: ErrorType,
    message: string,
    details?: any,
    retry?: () => Promise<void>
  ) => {
    error.value = {
      type,
      message,
      timestamp: Date.now(),
      details,
      retry,
    };

    // Log error to console in development
    if (process.dev) {
      console.error(`[Error] ${type}: ${message}`, details);
    }

    return error.value;
  };

  // Handle fetch errors and categorize them
  const handleFetchError = (
    error: any,
    customMessage?: string,
    retry?: () => Promise<void>
  ): ErrorState => {
    // Default error message
    let message =
      error?.message || customMessage || "Ha ocurrido un error inesperado";
    let type: ErrorType = "unknown";

    // Determine error type based on the error object
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      type = "connection";
      message =
        "No hay conexión a internet. Por favor, verifica tu conexión e inténtalo de nuevo.";
    } else if (
      error instanceof TypeError &&
      error.message.includes("NetworkError")
    ) {
      type = "connection";
      message = "Error de conexión. No se puede conectar con el servidor.";
    } else if (
      error.status === 404 ||
      (error instanceof Response && error.status === 404)
    ) {
      type = "notFound";
      message = "El recurso solicitado no está disponible.";
    } else if (
      error.status >= 500 ||
      (error instanceof Response && error.status >= 500)
    ) {
      type = "server";
      message = "Error del servidor. Por favor, inténtalo más tarde.";
    } else if (
      error.status >= 400 ||
      (error instanceof Response && error.status >= 400)
    ) {
      type = "validation";
      message =
        "Los datos enviados no son válidos. Por favor, revisa la información ingresada.";
    }

    return setError(type, message, error, retry);
  };

  // Execute a function with error handling
  const withErrorHandling = async <T>(
    fn: () => Promise<T>,
    errorMessage?: string
  ): Promise<T | null> => {
    try {
      clearError();
      return await fn();
    } catch (e) {
      const retryFn = async () => {
        await withErrorHandling(fn, errorMessage);
      };

      handleFetchError(e, errorMessage, retryFn);
      return null;
    }
  };

  // Check if there's a specific type of error
  const hasError = (type?: ErrorType): boolean => {
    if (!error.value) return false;
    if (!type) return true;
    return error.value.type === type;
  };

  // Get a user-friendly message based on error type
  const getUserFriendlyMessage = (type: ErrorType): string => {
    switch (type) {
      case "connection":
        return "Problemas de conexión";
      case "server":
        return "Error del servidor";
      case "validation":
        return "Datos incorrectos";
      case "notFound":
        return "No encontrado";
      default:
        return "Error inesperado";
    }
  };

  // Retry the last operation if a retry function exists
  const retryLastOperation = async (): Promise<void> => {
    if (error.value?.retry) {
      const retryFn = error.value.retry;
      clearError();
      await retryFn();
    }
  };

  return {
    error: readonly(error),
    clearError,
    setError,
    handleFetchError,
    withErrorHandling,
    hasError,
    getUserFriendlyMessage,
    retryLastOperation,
  };
}

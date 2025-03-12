export default function useQuestionValidation() {
    // Estado para rastrear si se ha intentado enviar el formulario
    const attempted = ref(false);
    
    // Función para crear una validación de campo requerido
    const createRequiredValidator = (value: any, errorMessage = 'Este campo es requerido') => {
      // Para arrays (selección múltiple)
      if (Array.isArray(value)) {
        return {
          valid: value.length > 0,
          message: value.length === 0 && attempted.value ? errorMessage : ''
        };
      }
      
      // Para strings, números y booleanos
      return {
        valid: !!value,
        message: !value && attempted.value ? errorMessage : ''
      };
    };
    
    // Función para crear una validación de campo con validador personalizado
    const createCustomValidator = (
      value: any, 
      validatorFn: (val: any) => boolean,
      errorMessage = 'Este campo no es válido'
    ) => {
      const isValid = validatorFn(value);
      return {
        valid: isValid,
        message: !isValid && attempted.value ? errorMessage : ''
      };
    };
    
    // Función para validar email
    const createEmailValidator = (value: string, errorMessage = 'Por favor ingresa un email válido') => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValid = !!value && emailRegex.test(value);
      return {
        valid: isValid,
        message: !isValid && attempted.value ? errorMessage : ''
      };
    };
    
    // Función para validar campo de selección múltiple con opción "otro"
    const createMultiSelectWithOtherValidator = (
      selectedValues: string[],
      otherValue: string,
      errorMessage = 'Por favor completa este campo'
    ) => {
      const hasOther = selectedValues.includes('other');
      const isValid = selectedValues.length > 0 && (!hasOther || (hasOther && otherValue.trim() !== ''));
      
      return {
        valid: isValid,
        message: !isValid && attempted.value ? errorMessage : ''
      };
    };
    
    // Marcar que se ha intentado enviar
    const markAttempted = () => {
      attempted.value = true;
    };
    
    // Función para resetear el estado de intento
    const resetAttempted = () => {
      attempted.value = false;
    };
    
    return {
      attempted,
      markAttempted,
      resetAttempted,
      createRequiredValidator,
      createCustomValidator,
      createEmailValidator,
      createMultiSelectWithOtherValidator
    };
  }
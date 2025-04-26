import { ref } from "vue";
import type {
  WorkStatusOption,
  FreelancerExperienceOption,
  FreelancerPlatformOption,
  BusinessSizeOption,
  AIFundingOption,
  AIDisclosureOption,
  AIInvestmentOption,
  AIValuePropositionOption,
  AIRateAdjustmentOption,
  AIProjectImpactOption,
  ExperienceOption,
  AIKnowledgeLevel,
  MarketingPromptChoice,
  AITrainingInvestment,
  AISavingTime,
  AIImprovements,
  AIWorkflows,
  AIObjective,
  AIObstacle,
  AISupportNeed,
} from "~/types/questionnaire";

export default function useOptionsData() {
  const workStatusOptions = ref<WorkStatusOption[]>([
    { value: "full_time", label: "Empleado de tiempo completo" },
    { value: "part_time", label: "Empleado de tiempo parcial" },
    { value: "freelancer", label: "Freelancer/Trabajador independiente" },
    { value: "business_owner", label: "Dueño de empresa/Emprendedor" },
    { value: "other", label: "Otro" },
  ]);

  const freelancerExperienceOptions = ref<FreelancerExperienceOption[]>([
    { value: "less_than_1", label: "Menos de 1 año" },
    { value: "1_to_3", label: "1-3 años" },
    { value: "4_to_6", label: "4-6 años" },
    { value: "more_than_6", label: "Más de 6 años" },
  ]);

  const freelancerPlatformsOptions = ref<FreelancerPlatformOption[]>([
    { value: "freelance_platforms", label: "Plataformas de Freelance" },
    { value: "professional_networks", label: "Redes Profesionales" },
    { value: "personal_recommendations", label: "Recomendaciones Personales" },
    { value: "self_marketing", label: "Marketing Propio" },
    { value: "other", label: "Otro" },
  ]);

  const businessSizeOptions = ref<BusinessSizeOption[]>([
    { value: "solo", label: "1️⃣ Solo yo" },
    { value: "2_5", label: "👥 2-5 empleados" },
    { value: "6_20", label: "👨‍👩‍👧 6-20 empleados" },
    { value: "21_50", label: "👨‍👩‍👧‍👦 1-50 empleados" },
    { value: "50_plus", label: "👨‍👩‍👧‍👧 Más de 50 empleados" },
  ]);

  const businessAIStrategyOptions = ref([
    { value: "defined", label: "✅ Sí, tenemos una estrategia de IA definida" },
    {
      value: "developing",
      label: "🔄 Estamos desarrollando una estrategia de IA",
    },
    {
      value: "unstructured",
      label: "⏸️ Usamos IA pero sin una estrategia clara",
    },
    { value: "none", label: "❌ No usamos IA en la empresa" },
    { value: "not_considered", label: "🤷 No lo hemos considerado aún" },
  ]);

  const aiFundingOptions = ref<AIFundingOption[]>([
    { value: "personal", label: "Pago personal (de mi bolsillo)" },
    { value: "business", label: "Gastos de empresa/negocio" },
    { value: "client", label: "Facturado a clientes" },
    { value: "free", label: "Solo uso herramientas gratuitas" },
  ]);

  const aiDisclosureOptions = ref<AIDisclosureOption[]>([
    { value: "always", label: "Siempre informo sobre mi uso de IA" },
    { value: "sometimes", label: "A veces, dependiendo del cliente" },
    { value: "never", label: "Nunca lo menciono específicamente" },
    { value: "when_asked", label: "Solo cuando me preguntan" },
  ]);

  const aiInvestmentOptions = ref<AIInvestmentOption[]>([
    { value: "none", label: "Nada (solo uso herramientas gratuitas)" },
    { value: "under_50", label: "Menos de 50€ al mes" },
    { value: "50_to_100", label: "Entre 50€ y 100€ al mes" },
    { value: "over_100", label: "Más de 100€ al mes" },
  ]);

  const aiValuePropositionOptions = ref<AIValuePropositionOption[]>([
    { value: "yes", label: "Sí, he adaptado mi propuesta de valor" },
    { value: "no", label: "No, sigo ofreciendo lo mismo" },
    { value: "working_on_it", label: "Estoy trabajando en ello" },
  ]);

  const aiRateAdjustmentOptions = ref<AIRateAdjustmentOption[]>([
    { value: "increased", label: "He aumentado mis tarifas" },
    { value: "decreased", label: "He reducido mis tarifas" },
    { value: "same", label: "Mantengo las mismas tarifas" },
    { value: "case_by_case", label: "Depende del proyecto" },
  ]);

  const aiProjectImpactOptions = ref<AIProjectImpactOption[]>([
    { value: "positive", label: "Impacto muy positivo" },
    { value: "negative", label: "Impacto negativo" },
    { value: "neutral", label: "Ni positivo ni negativo" },
    { value: "mixed", label: "Resultados mixtos" },
  ]);

  const experienceOptions = ref<ExperienceOption[]>([
    { value: "less_than_1", label: "Menos de 1 año" },
    { value: "1_to_3", label: "1-3 años" },
    { value: "4_to_6", label: "4-6 años" },
    { value: "more_than_6", label: "Más de 6 años" },
  ]);

  const aiKnowledgeLevelOptions = ref<
    { value: AIKnowledgeLevel; label: string }[]
  >([
    { value: "advanced", label: "🧠 Avanzado - comprendo aspectos técnicos" },
    {
      value: "intermediate",
      label: "👍 Intermedio - manejo bien los conceptos",
    },
    { value: "basic", label: "🌱 Básico - tengo nociones fundamentales" },
    { value: "limited", label: "🤔 Limitado - sé muy poco" },
    { value: "none", label: "❓ Nulo - no tengo conocimiento" },
  ]);

  const marketingPromptChoiceOptions = ref<
    { value: MarketingPromptChoice; label: string }[]
  >([
    {
      value: "detailed",
      label:
        '🎯 "Crea una campaña para un producto de belleza dirigido a mujeres de 30-45 años, enfocada en ingredientes naturales. El tono debe ser sofisticado pero accesible. Incluye: titular principal, 3 puntos clave, y llamado a la acción."',
    },
    {
      value: "generic",
      label:
        '📝 "Necesito una campaña de marketing para un producto de belleza."',
    },
    {
      value: "natural_ingredients",
      label:
        '📋 "Escribe contenido de marketing para una crema facial con ingredientes naturales para mujeres."',
    },
    {
      value: "ad_format",
      label:
        '📢 "Hazme una publicidad con título, puntos y CTA para un producto de belleza natural para mujeres de mediana edad."',
    },
    {
      value: "unsure",
      label: "🤷‍♂️ No estoy seguro / No uso prompts",
    },
  ]);

  const aiTrainingInvestmentOptions = ref<
    { value: AITrainingInvestment; label: string }[]
  >([
    {
      value: "advanced_training",
      label: "🎓 Sí, formación avanzada o especializada",
    },
    { value: "basic_courses", label: "📚 Sí, cursos básicos o introductorios" },
    {
      value: "self_learning",
      label: "🔍 Solo autoformación (tutoriales, artículos)",
    },
    { value: "not_yet_interested", label: "🤔 No, pero me interesa" },
    { value: "not_interested", label: "❌ No y no me interesa por ahora" },
  ]);

  // Opciones para Pregunta 16: ¿Cuánto tiempo te ahorra la IA semanalmente?
  const aiSavingTimeOptions = ref<{ value: AISavingTime; label: string }[]>([
    { value: "more_than_10", label: "⏱️ Más de 10 horas" },
    { value: "5_10", label: "⏰ 5-10 horas" },
    { value: "1_5", label: "🕒 1-5 horas" },
    { value: "less_than_1", label: "🕐 Menos de 1 hora" },
    { value: "none", label: "❌ No me ahorra tiempo/No la uso" },
  ]);

  // Opciones para Pregunta 17: ¿Has notado mejoras en tu trabajo con IA?
  const aiImprovementsOptions = ref<{ value: AIImprovements; label: string }[]>(
    [
      { value: "significant", label: "🌟 Sí, mejoras significativas" },
      { value: "some", label: "👍 Sí, algunas mejoras" },
      { value: "no_change", label: "😐 Sin cambios notables" },
      { value: "worse", label: "👎 Ha empeorado algunos aspectos" },
      { value: "not_using", label: "❌ No uso IA en mi trabajo" },
    ]
  );

  // Opciones para Pregunta 18: ¿Has desarrollado flujos de trabajo con IA?
  const aiWorkflowsOptions = ref<{ value: AIWorkflows; label: string }[]>([
    {
      value: "defined",
      label: "✅ Sí, tengo procesos bien definidos y optimizados",
    },
    { value: "in_progress", label: "🔄 Estoy en proceso de desarrollarlos" },
    {
      value: "some_attempts",
      label: "🌱 He hecho algunos intentos sin sistematizar",
    },
    { value: "improvised", label: "🤔 Uso la IA de forma improvisada" },
    { value: "not_using", label: "❌ No uso IA" },
  ]);

  // Opciones para Pregunta 19: ¿Cuál es tu principal objetivo con la IA?
  const aiObjectiveOptions = ref<{ value: AIObjective; label: string }[]>([
    { value: "productivity", label: "⚡ Aumentar productividad" },
    { value: "quality", label: "🌟 Mejorar calidad del trabajo" },
    { value: "cost", label: "💰 Reducir costos" },
    { value: "innovation", label: "💡 Innovar/crear nuevas ofertas" },
    { value: "competitiveness", label: "🏆 Mantenerme competitivo" },
    { value: "no_clear_goal", label: "❓ No tengo objetivos claros" },
  ]);

  // Opciones para Pregunta 21: ¿Qué obstáculos encuentras al utilizar IA en tu trabajo?
  const aiObstacleOptions = ref<{ value: AIObstacle; label: string }[]>([
    {
      value: "lack_skills",
      label: "🧠 Falta de conocimientos o habilidades técnicas",
    },
    { value: "cost", label: "💰 Costo de las herramientas y suscripciones" },
    {
      value: "lack_time",
      label: "⏱️ Falta de tiempo para aprender y experimentar",
    },
    {
      value: "use_case",
      label: "🤔 Dificultad para identificar casos de uso prácticos",
    },
    {
      value: "culture",
      label: "👥 Resistencia cultural en mi entorno laboral",
    },
    {
      value: "privacy",
      label: "🔒 Preocupaciones sobre privacidad o propiedad intelectual",
    },
    {
      value: "no_obstacle",
      label: "🚫 No encuentro obstáculos significativos",
    },
    { value: "other", label: "🌐 Otro (especificar)" },
  ]);

  // Opciones para Pregunta 22: ¿Qué tipo de apoyo necesitas ahora mismo?
  const aiSupportNeedOptions = ref<{ value: AISupportNeed; label: string }[]>([
    { value: "basic_training", label: "🌱 Formación básica sobre IA" },
    {
      value: "advanced_prompting",
      label: "🎯 Entrenamiento avanzado en prompting",
    },
    { value: "consulting", label: "👨‍💼 Consultoría personalizada" },
    { value: "premium_tools", label: "🔑 Acceso a herramientas premium" },
    { value: "sector_guides", label: "📚 Guías específicas para mi sector" },
    { value: "community", label: "👥 Comunidad de práctica con pares" },
    { value: "not_interested", label: "❌ No estoy interesado actualmente" },
  ]);

  return {
    workStatusOptions,
    freelancerExperienceOptions,
    freelancerPlatformsOptions,
    businessSizeOptions,
    businessAIStrategyOptions,
    aiFundingOptions,
    aiDisclosureOptions,
    aiInvestmentOptions,
    aiValuePropositionOptions,
    aiRateAdjustmentOptions,
    aiProjectImpactOptions,
    experienceOptions,
    aiKnowledgeLevelOptions,
    marketingPromptChoiceOptions,
    aiTrainingInvestmentOptions,
    aiSavingTimeOptions,
    aiImprovementsOptions,
    aiWorkflowsOptions,
    aiObjectiveOptions,
    aiObstacleOptions,
    aiSupportNeedOptions,
  };
}

import { ref } from 'vue';
import type { WorkStatus } from '~/types/questionnaire';

export interface StopperData {
  id: string;
  title: string;
  message: string;
  source: string;
  forProfiles?: WorkStatus[]; // Si necesitamos mostrar stoppers específicos para ciertos perfiles
}

export default function useStopperData() {
  // Stopper 1: Datos relevantes por sector
  const sectorStoppers = ref<Record<string, StopperData>>({
    'tech': {
      id: 'sector_tech',
      title: 'Datos relevantes para el sector Tecnología',
      message: 'Según GitHub, los desarrolladores que utilizan asistentes de IA completan tareas de codificación un 55% más rápido y aceptan en promedio el 26% de las sugerencias de código.',
      source: 'GitHub, The Impact of AI on Developer Productivity, 2023'
    },
    'design': {
      id: 'sector_design',
      title: 'Datos relevantes para el sector Diseño',
      message: 'Adobe informa que los diseñadores que utilizan herramientas de IA experimentan un aumento del 78% en velocidad de iteración de diseño y un 59% de incremento en productividad general.',
      source: 'Adobe Creative Cloud Impact Report, 2023'
    },
    'marketing': {
      id: 'sector_marketing',
      title: 'Datos relevantes para el sector Marketing',
      message: 'HubSpot reporta que las campañas de marketing que utilizan contenido optimizado por IA muestran un aumento promedio del 29.3% en tasas de conversión.',
      source: 'HubSpot State of Marketing Report, 2023'
    },
    'media': {
      id: 'sector_media',
      title: 'Datos relevantes para el sector Medios',
      message: 'Según Reuters Institute, las organizaciones de medios que implementan IA para personalización de contenido ven un incremento del 47% en tiempo de permanencia y un 38% en engagement.',
      source: 'Reuters Institute Digital News Report, 2023'
    },
    'education': {
      id: 'sector_education',
      title: 'Datos relevantes para el sector Educación',
      message: 'Un estudio de Carnegie Learning demostró que los estudiantes que utilizaron tutores impulsados por IA mejoraron sus calificaciones en matemáticas un 27% más que aquellos con métodos tradicionales.',
      source: 'Carnegie Learning Impact Study, 2023'
    },
    'consulting': {
      id: 'sector_consulting',
      title: 'Datos relevantes para el sector Consultoría',
      message: 'Deloitte reveló que sus consultores que utilizan herramientas de IA pueden procesar un 340% más información y reducir el tiempo de investigación en un 70%.',
      source: 'Deloitte Insights: The Age of With, 2023'
    },
    'finance': {
      id: 'sector_finance',
      title: 'Datos relevantes para el sector Finanzas',
      message: 'JPMorgan Chase reportó que su plataforma COiN con IA puede revisar 12,000 documentos comerciales en segundos, una tarea que solía requerir 360,000 horas de trabajo humano al año.',
      source: 'JPMorgan Chase Technology Report, 2022'
    },
    'health': {
      id: 'sector_health',
      title: 'Datos relevantes para el sector Salud',
      message: 'Un estudio publicado en Nature Medicine demostró que los algoritmos de IA pueden detectar cáncer de mama en mamografías con una precisión del 91.5%, superando a radiólogos humanos que promedian 87.2%.',
      source: 'Nature Medicine, Vol. 29, 2023'
    },
    'retail': {
      id: 'sector_retail',
      title: 'Datos relevantes para el sector Retail',
      message: 'Según McKinsey, los minoristas que implementan IA para gestión de inventario y previsión de demanda reducen los errores de previsión hasta en un 50% y los costos de inventario en un 35%.',
      source: 'McKinsey Retail Practice Report, 2023'
    },
    'manufacturing': {
      id: 'sector_manufacturing',
      title: 'Datos relevantes para el sector Manufactura',
      message: 'El Digital Manufacturing Report indica que las plantas de producción con sistemas de mantenimiento predictivo impulsados por IA reducen el tiempo de inactividad no planificado en un 45% y extienden la vida útil de los equipos en un 38%.',
      source: 'Digital Manufacturing Report, 2023'
    },
    'default': {
      id: 'sector_default',
      title: 'Datos relevantes para tu sector',
      message: 'Según el World Economic Forum, más del 85% de las empresas planean incrementar la adopción de IA en sus operaciones para 2025, creando una ventaja competitiva para profesionales y organizaciones que dominen estas tecnologías.',
      source: 'World Economic Forum Future of Jobs Report, 2023'
    }
  });

  // Stopper 2: Datos relevantes por tipo de trabajador
  const workerTypeStoppers = ref<Record<WorkStatus, StopperData>>({
    'employee': {
      id: 'worker_employee',
      title: 'Datos relevantes para Empleados',
      message: 'LinkedIn Learning reporta que los profesionales con habilidades verificables en IA tienen un 34% más de probabilidades de ser promovidos y ganan en promedio un 26% más que sus pares sin estas habilidades.',
      source: 'LinkedIn Global Talent Trends, 2023'
    },
    'freelancer': {
      id: 'worker_freelancer',
      title: 'Datos relevantes para Freelancers',
      message: 'Upwork reporta que los freelancers con habilidades verificadas en IA cobran en promedio un 31% más por hora que aquellos en campos similares sin estas habilidades, y tienen un 43% más de probabilidades de conseguir proyectos.',
      source: 'Upwork Skills Index, 2023'
    },
    'business_owner': {
      id: 'worker_business_owner',
      title: 'Datos relevantes para Emprendedores',
      message: 'CB Insights reporta que las startups con IA como componente central recibieron un 43% más de financiación en etapas tempranas que empresas similares sin componentes de IA.',
      source: 'CB Insights State of AI Report, Q3 2023'
    },
    'student': {
      id: 'worker_student',
      title: 'Datos relevantes para Estudiantes',
      message: 'Según una encuesta de Indeed, los recién graduados con habilidades certificadas en IA reciben ofertas salariales iniciales un 27% más altas y consiguen empleo un 37% más rápido que aquellos sin estas competencias.',
      source: 'Indeed Hiring Lab, 2023'
    },
    'unemployed': {
      id: 'worker_unemployed',
      title: 'Datos relevantes para personas sin empleo actual',
      message: 'El Future of Jobs Report del Foro Económico Mundial destaca que el 75% de las empresas planea incorporar IA en sus operaciones para 2025, creando nuevas oportunidades laborales para quienes dominen estas tecnologías.',
      source: 'WEF Future of Jobs Report, 2023'
    }
  } as Record<WorkStatus, StopperData>);

  // Stopper 3: Tips de productividad según nivel de experiencia
  const experienceStoppers = ref<StopperData[]>([
    {
      id: 'experience_beginner',
      title: 'Consejos para principiantes en IA',
      message: 'Microsoft encontró que comenzar con tareas repetitivas simples, como automatizar respuestas a correos electrónicos, puede ahorrar al profesional promedio 4.8 horas semanales.',
      source: 'Microsoft Workplace Analytics, 2023'
    },
    {
      id: 'experience_intermediate',
      title: 'Consejos para usuarios intermedios de IA',
      message: 'Según Harvard Business Review, los profesionales que utilizan templates de prompts personalizados son un 57% más eficientes en sus interacciones con IA que aquellos que formulan instrucciones desde cero cada vez.',
      source: 'HBR, "Mastering AI Workflows", Marzo 2023'
    },
    {
      id: 'experience_advanced',
      title: 'Consejos para usuarios avanzados de IA',
      message: 'Zapier reporta que sus usuarios que automatizan flujos de trabajo completos con IA ahorran en promedio 71 horas mensuales por equipo y reducen errores en un 89%.',
      source: 'Zapier State of Business Automation, 2023'
    },
    {
      id: 'experience_team',
      title: 'Consejos para equipos de trabajo con IA',
      message: 'Según Accenture, las organizaciones que implementan "Centros de Excelencia en IA" para compartir mejores prácticas y recursos entre departamentos ven un ROI un 37% mayor en sus iniciativas de IA.',
      source: 'Accenture Technology Vision, 2023'
    },
    {
      id: 'experience_leadership',
      title: 'Consejos para líderes y directivos',
      message: 'Un estudio de BCG muestra que las empresas donde los ejecutivos reciben capacitación específica en IA estratégica tienen un 42% más de probabilidades de implementar exitosamente iniciativas de transformación digital.',
      source: 'BCG Henderson Institute, 2023'
    }
  ]);

  // Stopper 4: Reflexiones sobre el futuro de la IA
  const futureReflections = ref<StopperData[]>([
    {
      id: 'future_reflection_1',
      title: 'El futuro de la IA en el trabajo',
      message: 'Según el World Economic Forum, para 2025, la división no será entre quienes usan IA y quienes no, sino entre quienes la usan efectivamente y quienes no han desarrollado esta competencia. El 85% de los trabajos existentes hoy serán transformados por la IA.',
      source: 'WEF Future of Jobs Report, 2023'
    },
    {
      id: 'future_reflection_2',
      title: 'Impacto económico de la IA',
      message: 'McKinsey estima que para 2030, aproximadamente el 70% de las empresas habrán adoptado al menos una tecnología de IA, y que la IA podría aportar hasta 13 billones de dólares a la economía global, transformando fundamentalmente cómo se realiza el trabajo.',
      source: 'McKinsey Global Institute, 2023'
    },
    {
      id: 'future_reflection_3',
      title: 'IA y modelos de negocio',
      message: 'Un estudio de MIT Sloan y Boston Consulting Group revela que las empresas que integran IA en sus operaciones no solo mejoran productos y reducen costos, sino que tienen tres veces más probabilidades de crear nuevos modelos de negocio que sus competidores.',
      source: 'MIT Sloan Management Review, 2023'
    },
    {
      id: 'future_reflection_4',
      title: 'Equipos IA-humano',
      message: 'Deloitte predice que para 2027, los profesionales pasarán de utilizar la IA como herramienta a formar equipos colaborativos humano-IA, donde cada parte aporta sus fortalezas particulares, cambiando fundamentalmente cómo entendemos el trabajo.',
      source: 'Deloitte Tech Trends, 2023'
    },
    {
      id: 'future_reflection_5',
      title: 'IA y crecimiento económico',
      message: 'PwC pronostica que la IA contribuirá con $15.7 billones a la economía global para 2030, más que la producción actual combinada de China e India. Las ganancias de productividad representarán el 55% de este impulso económico.',
      source: 'PwC Global AI Study, 2023'
    }
  ]);

  // Stopper 5: Datos sorprendentes sobre adopción de IA por industria
  const industryAdoptionData = ref<Record<string, StopperData>>({
    'tech': {
      id: 'adoption_tech',
      title: 'Adopción de IA en Tecnología',
      message: 'Según Stack Overflow, el 83% de los desarrolladores que empezaron a usar herramientas de IA en 2023 reportan que seguirán usándolas en el futuro, y el 78% considera que la IA cambiará fundamentalmente su profesión en los próximos 5 años.',
      source: 'Stack Overflow Developer Survey, 2023'
    },
    'marketing': {
      id: 'adoption_marketing',
      title: 'Adopción de IA en Marketing',
      message: 'Salesforce reporta que el 81% de los profesionales de marketing ahora usan IA de alguna forma, pero solo el 27% la utilizan para todo su potencial, representando una brecha significativa entre adopción básica y avanzada.',
      source: 'Salesforce State of Marketing, 2023'
    },
    'design': {
      id: 'adoption_design',
      title: 'Adopción de IA en Diseño',
      message: 'Un 76% de las agencias creativas han incorporado IA en sus procesos, pero existe una brecha del 52% entre adopción y maestría, con solo el 24% logrando integración completa en sus flujos de trabajo.',
      source: 'Adobe Creative Economy Report, 2023'
    },
    'finance': {
      id: 'adoption_finance',
      title: 'Adopción de IA en Finanzas',
      message: 'Según Accenture, las instituciones financieras que han implementado IA avanzada han visto un ROI promedio del 250% en estas inversiones, principalmente a través de mejor detección de fraudes y experiencia de cliente.',
      source: 'Accenture Banking Technology Vision, 2023'
    },
    'health': {
      id: 'adoption_health',
      title: 'Adopción de IA en Salud',
      message: 'Las organizaciones de salud con madurez digital avanzada tienen un 93% más de probabilidades de haber implementado soluciones de IA clínica, según HIMSS, creando una brecha creciente en la calidad de atención entre instituciones.',
      source: 'HIMSS Digital Health Survey, 2023'
    },
    'education': {
      id: 'adoption_education',
      title: 'Adopción de IA en Educación',
      message: 'El 67% de las instituciones educativas planean incrementar su inversión en IA para 2025, pero solo el 23% tienen actualmente un plan estratégico para su implementación, según EDUCAUSE.',
      source: 'EDUCAUSE Horizon Report, 2023'
    },
    'retail': {
      id: 'adoption_retail',
      title: 'Adopción de IA en Retail',
      message: 'Las tiendas minoristas que implementan IA para personalización ven un incremento del 35% en el valor promedio de compra y una mejora del 28% en la retención de clientes, según NRF.',
      source: 'National Retail Federation Tech Survey, 2023'
    },
    'manufacturing': {
      id: 'adoption_manufacturing',
      title: 'Adopción de IA en Manufactura',
      message: 'Los fabricantes que adoptan IA para mantenimiento predictivo reducen el tiempo de inactividad no planificado hasta en un 50% y extienden la vida útil de las máquinas un 30%, reporta el Manufacturing Leadership Council.',
      source: 'Manufacturing Leadership Council, 2023'
    }
  });

  // Stopper 6: Casos de éxito por sector
  const successCases = ref<Record<string, StopperData>>({
    'marketing': {
      id: 'success_marketing',
      title: 'Caso de éxito en Marketing',
      message: 'Coca-Cola implementó su plataforma "Content Bridge" impulsada por IA para marketing digital, logrando un aumento del 46% en engagement y una reducción del 30% en costos de producción de contenido.',
      source: 'Coca-Cola Digital Transformation Report, 2023'
    },
    'design': {
      id: 'success_design',
      title: 'Caso de éxito en Diseño',
      message: 'Jessica Walsh, fundadora de &Walsh, integró herramientas de IA generativa en su proceso creativo, aumentando la capacidad de su estudio de 15 a 35 proyectos mensuales sin incrementar su equipo.',
      source: 'Fast Company, "How AI is Transforming Creative Studios", Febrero 2023'
    },
    'development': {
      id: 'success_development',
      title: 'Caso de éxito en Desarrollo',
      message: 'Spotify implementó herramientas de IA para análisis de código y debugging, reduciendo el tiempo de identificación de errores en un 71% y acelerando los ciclos de lanzamiento de nuevas funciones en un 43%.',
      source: 'Spotify Engineering Blog, Diciembre 2022'
    },
    'finance': {
      id: 'success_finance',
      title: 'Caso de éxito en Finanzas',
      message: 'Bank of America desarrolló "Erica", un asistente virtual impulsado por IA que ha procesado más de 1,000 millones de consultas de clientes y ha contribuido a un aumento del 34% en la satisfacción del cliente y una reducción del 25% en llamadas al servicio de atención.',
      source: 'Bank of America Digital Banking Report, 2023'
    },
    'health': {
      id: 'success_health',
      title: 'Caso de éxito en Salud',
      message: 'Mayo Clinic implementó algoritmos de IA para detección temprana de enfermedades cardíacas que identifican patrones subclínicos imposibles de detectar para médicos humanos, mejorando la precisión diagnóstica en un 37% y reduciendo falsos negativos en un 59%.',
      source: 'Mayo Clinic Proceedings, 2023'
    },
    'consulting': {
      id: 'success_consulting',
      title: 'Caso de éxito en Consultoría',
      message: 'Deloitte transformó su metodología de auditoría con IA, permitiendo analizar el 100% de las transacciones en lugar de muestras aleatorias, mejorando la precisión en un 65% y reduciendo el tiempo de auditoría en un 30%.',
      source: 'Journal of Accountancy, 2023'
    },
    'education': {
      id: 'success_education',
      title: 'Caso de éxito en Educación',
      message: 'Georgia State University implementó un sistema de IA para monitorear el progreso de estudiantes e identificar señales tempranas de deserción, logrando incrementar la tasa de graduación en un 21% y eliminar la brecha de graduación entre grupos demográficos.',
      source: 'EDUCAUSE Review, 2023'
    },
    'retail': {
      id: 'success_retail',
      title: 'Caso de éxito en Retail',
      message: 'Sephora desarrolló su "Color IQ", un sistema de IA que analiza el tono de piel para recomendar productos de belleza personalizados, aumentando la conversión en un 40% y reduciendo las devoluciones en un 62%.',
      source: 'Harvard Business Review, "AI in Retail", 2023'
    }
  });

  // Función auxiliar para obtener un stopper aleatorio de un grupo específico
  function getRandomStopper(stoppers: StopperData[]): StopperData {
    const randomIndex = Math.floor(Math.random() * stoppers.length);
    return stoppers[randomIndex];
  }

  // Función para obtener un stopper por sector
  function getSectorStopper(sector: string): StopperData {
    return sectorStoppers.value[sector] || sectorStoppers.value.default;
  }

  // Función para obtener un stopper por tipo de trabajador
  function getWorkerTypeStopper(workStatus: WorkStatus): StopperData {
    return workerTypeStoppers.value[workStatus] || {
      id: 'worker_default',
      title: 'Datos relevantes para profesionales',
      message: 'Según estudios recientes, los profesionales que integran IA en sus flujos de trabajo ven un incremento promedio de productividad del 40% y tienen mayores oportunidades de crecimiento profesional.',
      source: 'Global AI Survey, 2023'
    };
  }

  // Función para obtener una reflexión sobre el futuro de la IA
  function getFutureReflection(): StopperData {
    return getRandomStopper(futureReflections.value);
  }

  // Función para obtener un stopper de adopción por industria
  function getIndustryAdoptionStopper(sector: string): StopperData {
    return industryAdoptionData.value[sector] || {
      id: 'adoption_default',
      title: 'Adopción de IA en tu industria',
      message: 'Según Gartner, las organizaciones que adoptan IA estratégicamente reportan un aumento del 25% en la satisfacción del cliente y un 20% en los ingresos por empleado.',
      source: 'Gartner AI Business Value Forecast, 2023'
    };
  }

  // Función para obtener un caso de éxito por sector
  function getSuccessCase(sector: string): StopperData {
    console.log('Success case data for sector:', sector, successCases.value[sector]);
    return successCases.value[sector] || {
      id: 'success_default',
      title: 'Caso de éxito con IA',
      message: 'Las organizaciones que implementan IA en sus procesos clave reportan una ventaja competitiva del 26% sobre sus competidores y una mejora del 31% en la eficiencia operativa.',
      source: 'IBM Global AI Adoption Index, 2023'
    };
  }

  // Función para obtener un tip según nivel de experiencia
  function getExperienceTip(experience: 'beginner' | 'intermediate' | 'advanced' | 'team' | 'leadership'): StopperData {
    const stopper = experienceStoppers.value.find(s => s.id === `experience_${experience}`);
    return stopper || experienceStoppers.value[0];
  }

  return {
    getSectorStopper,
    getWorkerTypeStopper,
    getExperienceTip,
    getFutureReflection,
    getIndustryAdoptionStopper,
    getSuccessCase
  };
}

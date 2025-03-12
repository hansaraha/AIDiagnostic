import { ref } from 'vue';
import type { UserData, DiagnosticResult, CourseRecommendation, ServiceRecommendation } from '~/types/questionnaire';

export default function useDiagnostic(userData: Ref<UserData>) {
  const isAnalyzing = ref(false);

  // Function to analyze the user profile and generate recommendations
  const analyzeProfile = async () => {
    isAnalyzing.value = true;
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate the diagnostic result based on user data
    const diagnosticResult = generateDiagnosticResult();
    
    // Set the result to userData
    userData.value.diagnostic = diagnosticResult;
    
    isAnalyzing.value = false;
    
    return diagnosticResult;
  };

  // Function to generate diagnostic result based on user answers
  const generateDiagnosticResult = (): DiagnosticResult => {
    // Default values
    let professionalProfile = 'Innovador Tecnológico';
    let strengths = ['Creatividad', 'Adaptabilidad', 'Pensamiento Crítico'];
    let recommendations = [
      'Explora nuevas herramientas de IA para mejorar tus procesos.',
      'Considera colaborar con otros profesionales en proyectos innovadores.',
      'Mantente al día con las últimas tendencias tecnológicas.'
    ];
    
    // Generate personalized courses based on user profile
    const courses = generateCourseRecommendations();
    
    // Generate service recommendations
    const services = generateServiceRecommendations();

    // Return the compiled result
    return {
      professionalProfile,
      strengths,
      recommendations,
      courses,
      services
    };
  };

  // Generate course recommendations based on user profile
  const generateCourseRecommendations = (): CourseRecommendation[] => {
    let courses: CourseRecommendation[] = [];
    
    if (userData.value.workStatus === 'freelancer') {
      courses = [
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
        },
        {
          title: 'Optimización SEO con IA',
          description: 'Mejora la visibilidad de tu portafolio y contenidos con las últimas técnicas de SEO potenciadas por IA.',
          difficulty: 'avanzado',
          price: '129€',
          link: '#seo-con-ia'
        }
      ];
    } else if (userData.value.workStatus === 'business_owner') {
      courses = [
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
        },
        {
          title: 'IA para Marketing y Ventas',
          description: 'Aprovecha el poder de la IA para optimizar tus estrategias de marketing y aumentar las conversiones.',
          difficulty: 'principiante',
          price: '99€',
          link: '#ia-marketing-ventas'
        }
      ];
    } else {
      // For employees or others
      courses = [
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
        },
        {
          title: 'Desarrollo Profesional con IA',
          description: 'Prepárate para el futuro laboral con habilidades de IA que serán indispensables en los próximos años.',
          difficulty: 'avanzado',
          price: '159€',
          link: '#desarrollo-profesional-ia'
        }
      ];
    }
    
    return courses;
  };

  // Generate service recommendations
  const generateServiceRecommendations = (): ServiceRecommendation[] => {
    let services: ServiceRecommendation[] = [
      {
        title: 'Asistente Virtual IA',
        description: 'Un asistente virtual personalizado que maneja tus emails, agenda y tareas administrativas.',
        type: 'automatización',
        price: 'Desde 49€/mes',
        link: '#asistente-virtual'
      },
      {
        title: 'Creación Automática de Contenido',
        description: 'Genera contenido de alta calidad para blogs, redes sociales y emails en una fracción del tiempo.',
        type: 'creatividad',
        price: 'Desde 39€/mes',
        link: '#creacion-contenido'
      },
      {
        title: 'Dashboard Analítico Personalizado',
        description: 'Visualiza todos tus datos importantes en un solo lugar con actualizaciones en tiempo real.',
        type: 'análisis',
        price: 'Desde 79€/mes',
        link: '#dashboard-analitico'
      }
    ];
    
    // Additional customization based on AI usage
    if (userData.value.commonAI?.investment === 'over_100') {
      // For users who already invest a lot in AI
      services.push({
        title: 'Consultoría en Integración Avanzada de IA',
        description: 'Optimiza tu inversión en IA con un plan personalizado para integrar todas tus herramientas.',
        type: 'productividad',
        price: 'Desde 299€/sesión',
        link: '#consultoria-ia'
      });
    }
    
    if (userData.value.commonAI?.projectImpact === 'positive') {
      // For users who are already seeing positive results with AI
      services.push({
        title: 'Escalado de Soluciones IA',
        description: 'Lleva tus éxitos con IA al siguiente nivel con soluciones escalables para proyectos más grandes.',
        type: 'automatización',
        price: 'Desde 199€/mes',
        link: '#escalado-ia'
      });
    }
    
    return services;
  };

  return {
    isAnalyzing,
    analyzeProfile
  };
}
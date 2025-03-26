import type { AIProfile, ProfileMetrics } from './useScoring';
import type { Sector, AIUsageData, AIPurpose } from '~/types/questionnaire';

interface Strength {
  title: string;
  description: string;
}

interface Recommendation {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface Course {
  title: string;
  description: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  link?: string;
}

interface Service {
  title: string;
  description: string;
  type: 'automatización' | 'productividad' | 'análisis' | 'creatividad';
  link?: string;
}

export function useRecommendations() {
  function analyzeStrengths(
    aiUsage: AIUsageData,
    metrics: ProfileMetrics,
    profile: AIProfile
  ): Strength[] {
    const strengths: Strength[] = [];

    // Frequency-based strengths
    if (aiUsage.frequency === 'daily') {
      strengths.push({
        title: 'Usuario Consistente',
        description: 'Mantienes un uso constante y regular de herramientas IA'
      });
    }

    // Tools-based strengths
    if (aiUsage.tools.length >= 3) {
      strengths.push({
        title: 'Diversidad de Herramientas',
        description: 'Manejas un amplio conjunto de herramientas IA'
      });
    }

    // Purpose-based strengths
    const creativePurposes = ['ideation', 'content', 'research'];
    const technicalPurposes = ['programming', 'automation', 'analysis'];
    
    const hasCreativeFocus = aiUsage.purposes.some(p => creativePurposes.includes(p));
    const hasTechnicalFocus = aiUsage.purposes.some(p => technicalPurposes.includes(p));

    if (hasCreativeFocus && hasTechnicalFocus) {
      strengths.push({
        title: 'Versatilidad IA',
        description: 'Combinas efectivamente usos creativos y técnicos de la IA'
      });
    }

    // Metrics-based strengths
    if (metrics.implementation > 70) {
      strengths.push({
        title: 'Implementación Efectiva',
        description: 'Destacas en la implementación práctica de soluciones IA'
      });
    }

    if (metrics.knowledge > 70) {
      strengths.push({
        title: 'Conocimiento Sólido',
        description: 'Posees un conocimiento profundo de las capacidades de la IA'
      });
    }

    if (metrics.integration > 70) {
      strengths.push({
        title: 'Integración Avanzada',
        description: 'Sobresales en la integración de IA en flujos de trabajo'
      });
    }

    if (metrics.value > 70) {
      strengths.push({
        title: 'Generación de Valor',
        description: 'Destacas en extraer valor tangible de las herramientas IA'
      });
    }

    return strengths.slice(0, 4); // Return top 4 strengths
  }

  function generateRecommendations(
    profile: AIProfile,
    sector: Sector,
    metrics: ProfileMetrics
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Profile-based recommendations
    switch (profile) {
      case 'IA-Curioso':
        recommendations.push({
          title: 'Experimenta con IA Básica',
          description: 'Comienza con ChatGPT para tareas simples de tu día a día',
          priority: 'high'
        });
        break;
      case 'IA-Entusiasta':
        recommendations.push({
          title: 'Diversifica tus Herramientas',
          description: 'Explora diferentes herramientas IA para distintas tareas',
          priority: 'high'
        });
        break;
      case 'IA-Táctico':
        recommendations.push({
          title: 'Optimiza tus Prompts',
          description: 'Mejora la calidad de tus resultados con prompt engineering',
          priority: 'high'
        });
        break;
      case 'IA-Estratega':
        recommendations.push({
          title: 'Integración Avanzada',
          description: 'Implementa flujos de trabajo automatizados con IA',
          priority: 'high'
        });
        break;
      case 'IA-Visionario':
        recommendations.push({
          title: 'Innovación con IA',
          description: 'Explora casos de uso únicos en tu sector',
          priority: 'high'
        });
        break;
    }

    // Sector-specific recommendations
    switch (sector) {
      case 'tech':
        recommendations.push({
          title: 'Automatización de Desarrollo',
          description: 'Implementa copilots y asistentes de código',
          priority: metrics.implementation < 50 ? 'high' : 'low'
        });
        break;
      case 'design':
        recommendations.push({
          title: 'Flujos Creativos con IA',
          description: 'Integra herramientas de generación de imágenes en tu proceso',
          priority: metrics.integration < 50 ? 'high' : 'low'
        });
        break;
      case 'marketing':
        recommendations.push({
          title: 'Contenido Personalizado',
          description: 'Utiliza IA para generar contenido adaptado a tu audiencia',
          priority: metrics.value < 50 ? 'high' : 'low'
        });
        break;
      // Add more sectors...
    }

    // Metrics-based recommendations
    if (metrics.implementation < 40) {
      recommendations.push({
        title: 'Práctica Regular',
        description: 'Establece un horario regular para practicar con IA',
        priority: 'medium'
      });
    }

    if (metrics.knowledge < 40) {
      recommendations.push({
        title: 'Fundamentos IA',
        description: 'Aprende los conceptos básicos de IA y sus aplicaciones',
        priority: 'medium'
      });
    }

    return recommendations.slice(0, 5); // Return top 5 recommendations
  }

  function recommendCourses(
    profile: AIProfile,
    sector: Sector,
    metrics: ProfileMetrics
  ): Course[] {
    const courses: Course[] = [];

    // Basic courses for all profiles
    if (metrics.knowledge < 50) {
      courses.push({
        title: 'Fundamentos de IA para Profesionales',
        description: 'Conceptos básicos y aplicaciones prácticas de IA',
        difficulty: 'principiante'
      });
    }

    // Profile-specific courses
    switch (profile) {
      case 'IA-Curioso':
        courses.push({
          title: 'Introducción a ChatGPT',
          description: 'Aprende a utilizar ChatGPT efectivamente',
          difficulty: 'principiante'
        });
        break;
      case 'IA-Entusiasta':
        courses.push({
          title: 'Prompt Engineering Básico',
          description: 'Mejora tus resultados con mejores prompts',
          difficulty: 'principiante'
        });
        break;
      case 'IA-Táctico':
        courses.push({
          title: 'Prompt Engineering Avanzado',
          description: 'Técnicas avanzadas de prompt engineering',
          difficulty: 'intermedio'
        });
        break;
      case 'IA-Estratega':
        courses.push({
          title: 'Integración de IA en Flujos de Trabajo',
          description: 'Automatización y optimización con IA',
          difficulty: 'avanzado'
        });
        break;
      case 'IA-Visionario':
        courses.push({
          title: 'Estrategias de Innovación con IA',
          description: 'Casos de uso avanzados y tendencias',
          difficulty: 'avanzado'
        });
        break;
    }

    // Sector-specific courses
    switch (sector) {
      case 'tech':
        courses.push({
          title: 'IA para Desarrollo de Software',
          description: 'Copilots y asistentes de código',
          difficulty: 'intermedio'
        });
        break;
      case 'design':
        courses.push({
          title: 'IA en Diseño Creativo',
          description: 'Herramientas de generación y edición',
          difficulty: 'intermedio'
        });
        break;
      case 'marketing':
        courses.push({
          title: 'IA en Marketing Digital',
          description: 'Automatización y personalización',
          difficulty: 'intermedio'
        });
        break;
      // Add more sectors...
    }

    return courses.slice(0, 3); // Return top 3 courses
  }

  function recommendServices(
    profile: AIProfile,
    sector: Sector
  ): Service[] {
    const services: Service[] = [];

    // Profile-based services
    switch (profile) {
      case 'IA-Curioso':
        services.push({
          title: 'ChatGPT Plus',
          description: 'Acceso a modelos avanzados y mayor velocidad',
          type: 'productividad'
        });
        break;
      case 'IA-Entusiasta':
        services.push({
          title: 'Midjourney',
          description: 'Generación de imágenes de alta calidad',
          type: 'creatividad'
        });
        break;
      case 'IA-Táctico':
        services.push({
          title: 'Claude',
          description: 'Asistente IA avanzado con capacidades analíticas',
          type: 'análisis'
        });
        break;
      case 'IA-Estratega':
        services.push({
          title: 'Zapier',
          description: 'Automatización de flujos de trabajo con IA',
          type: 'automatización'
        });
        break;
      case 'IA-Visionario':
        services.push({
          title: 'GPT-4 API',
          description: 'Integración personalizada de IA en tus sistemas',
          type: 'automatización'
        });
        break;
    }

    // Sector-specific services
    switch (sector) {
      case 'tech':
        services.push({
          title: 'GitHub Copilot',
          description: 'Asistente de código IA',
          type: 'productividad'
        });
        break;
      case 'design':
        services.push({
          title: 'Adobe Firefly',
          description: 'Suite de herramientas creativas con IA',
          type: 'creatividad'
        });
        break;
      case 'marketing':
        services.push({
          title: 'Copy.ai',
          description: 'Generación de contenido marketing',
          type: 'creatividad'
        });
        break;
      // Add more sectors...
    }

    return services.slice(0, 3); // Return top 3 services
  }

  return {
    analyzeStrengths,
    generateRecommendations,
    recommendCourses,
    recommendServices
  };
}

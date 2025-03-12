<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
      <!-- Progress bar -->
      <div class="container mx-auto px-4 pt-4">
        <div class="h-2.5 w-full bg-slate-200 rounded">
          <div class="h-2.5 bg-indigo-900 rounded" :style="{ width: `${progress}%` }"></div>
        </div>
        <div class="text-right text-sm text-gray-500 mt-1">
          {{ currentSection }}
        </div>
      </div>
  
      <!-- Main content -->
      <div class="container mx-auto px-4 py-8 flex-grow flex flex-col justify-center">
        <h1 class="text-center text-2xl font-bold text-indigo-900 mb-8">DIAGNÓSTICO IA</h1>
        
  
        
        <!-- Conversational Feedback -->
        <UCard v-if="currentStep === 'conversation'" class="max-w-2xl mx-auto w-full bg-indigo-50 border-l-4 border-indigo-500">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¡Genial, {{ userData.name }}!</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <p v-html="conversationalMessage"></p>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="continueAfterMessage">
                CONTINUAR
              </UButton>
            </div>
          </template>
        </UCard>
        
        <!-- Tip Content -->
        <UCard v-else-if="currentStep === 'tip'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">Consejo Profesional</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <p>{{ currentTip }}</p>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                CONTINUAR
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Welcome Screen -->
        <UCard v-else-if="currentStep === 'welcome'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">Bienvenido al Diagnóstico IA</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <p>Este cuestionario te ayudará a evaluar tu relación con la Inteligencia Artificial y cómo mejorar tu uso profesional de estas herramientas.</p>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                COMENZAR
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Name Question -->
        <UCard v-else-if="currentStep === 'name'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cuál es tu nombre?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <UFormGroup label="Nombre">
              <UInput v-model="userData.name" placeholder="Tu nombre" />
            </UFormGroup>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep" :disabled="!userData.name">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Work Status Question -->
        <UCard v-else-if="currentStep === 'work_status'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cuál es tu situación laboral actual?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in workStatusOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.workStatus === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectWorkStatus(option.value)">
                {{ option.label }}
              </div>
              <UFormGroup v-if="userData.workStatus === 'other'" label="Especificar otro">
                <UInput v-model="userData.otherWorkStatus" placeholder="Describe tu situación laboral" />
              </UFormGroup>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep" :disabled="!isWorkStatusValid">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Freelancer Questions Section -->
        <UCard v-else-if="currentStep === 'freelancer_services'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Qué servicios ofreces como freelancer?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="option in freelancerServicesOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="isFreelancerServiceSelected(option.value) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="toggleFreelancerService(option.value)">
                {{ option.label }}
              </div>
            </div>
            <UFormGroup v-if="isFreelancerServiceSelected('other')" label="Especificar otro servicio" class="mt-3">
              <UInput v-if="userData.freelancer" v-model="userData.freelancer.otherService" placeholder="Describe el servicio que ofreces" />
            </UFormGroup>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep" :disabled="!userData.freelancer || userData.freelancer.services.length === 0">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Freelancer Experience Question -->
        <UCard v-else-if="currentStep === 'freelancer_experience'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cuánta experiencia tienes como freelancer?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in freelancerExperienceOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.freelancer && userData.freelancer.experience === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectFreelancerExperience(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Freelancer Clients Question -->
        <UCard v-else-if="currentStep === 'freelancer_clients'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cuántos clientes atiendes al mes?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in freelancerClientsOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.freelancer?.clientsPerMonth === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectFreelancerClients(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Freelancer Platforms Question -->
        <UCard v-else-if="currentStep === 'freelancer_platforms'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Qué plataformas utilizas para encontrar clientes?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div v-for="option in freelancerPlatformsOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="isFreelancerPlatformSelected(option.value) ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="toggleFreelancerPlatform(option.value)">
                {{ option.label }}
              </div>
            </div>
            <UFormGroup v-if="isFreelancerPlatformSelected('other')" label="Especificar otra plataforma" class="mt-3">
              <UInput v-if="userData.freelancer" v-model="userData.freelancer.otherPlatform" placeholder="Nombre de la plataforma" />
            </UFormGroup>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep" :disabled="!userData.freelancer || userData.freelancer.platforms.length === 0">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Business Type Question -->
        <UCard v-else-if="currentStep === 'business_type'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Qué tipo de negocio tienes?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in businessTypeOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.businessOwner?.businessType === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectBusinessType(option.value)">
                {{ option.label }}
              </div>
              <UFormGroup v-if="userData.businessOwner?.businessType === 'other'" label="Especificar tipo de negocio">
                <UInput v-model="userData.businessOwner.otherBusinessType" placeholder="Describe tu tipo de negocio" />
              </UFormGroup>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Business Size Question -->
        <UCard v-else-if="currentStep === 'business_size'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cuántos empleados tiene tu empresa?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in businessSizeOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.businessOwner?.employeeCount === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectBusinessSize(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Business Age Question -->
        <UCard v-else-if="currentStep === 'business_age'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Hace cuánto tiempo fundaste tu empresa?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in businessAgeOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.businessOwner?.foundingTime === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectBusinessAge(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Business AI Policy Question -->
        <UCard v-else-if="currentStep === 'business_ai_policy'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Tu empresa tiene políticas sobre el uso de IA?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in businessAIPolicyOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.businessOwner?.aiPolicy === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectBusinessAIPolicy(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- AI Funding Question -->
        <UCard v-else-if="currentStep === 'ai_funding'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cómo financias tus herramientas de IA?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in aiFundingOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.commonAI?.funding === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectAIFunding(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- AI Disclosure Question -->
        <UCard v-else-if="currentStep === 'ai_disclosure'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Con qué frecuencia revelas a tus clientes que usas IA?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in aiDisclosureOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.commonAI?.disclosure === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectAIDisclosure(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- AI Investment Question -->
        <UCard v-else-if="currentStep === 'ai_investment'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cuánto inviertes mensualmente en herramientas de IA?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in aiInvestmentOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.commonAI?.investment === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectAIInvestment(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- AI Value Proposition Question -->
        <UCard v-else-if="currentStep === 'ai_value_proposition'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Has modificado tu propuesta de valor debido a la IA?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in aiValuePropositionOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.commonAI?.valueProposition === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectAIValueProposition(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- AI Rate Adjustment Question -->
        <UCard v-else-if="currentStep === 'ai_rate_adjustment'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Has ajustado tus tarifas debido al uso de IA?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in aiRateAdjustmentOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.commonAI?.rateAdjustment === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectAIRateAdjustment(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- AI Project Impact Question -->
        <UCard v-else-if="currentStep === 'ai_project_impact'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cómo describirías el impacto de la IA en tus proyectos?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="space-y-4">
              <div v-for="option in aiProjectImpactOptions" :key="option.value" 
                  class="border rounded p-3 cursor-pointer"
                  :class="userData.commonAI?.projectImpact === option.value ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'"
                  @click="selectAIProjectImpact(option.value)">
                {{ option.label }}
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Email Question -->
        <UCard v-else-if="currentStep === 'email'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">¿Cuál es tu correo electrónico?</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <UFormGroup label="Email" :error="userData.email && !isValidEmail(userData.email) ? 'Por favor ingresa un email válido' : ''">
              <UInput v-model="userData.email" type="email" placeholder="tu@email.com" />
            </UFormGroup>
            <p class="text-sm text-gray-500 mt-2">Te enviaremos tu diagnóstico a esta dirección de correo.</p>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep" :disabled="!isValidEmail(userData.email)">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Analysis Screen -->
        <UCard v-else-if="currentStep === 'analysis'" class="max-w-2xl mx-auto w-full bg-gradient-to-r from-indigo-50 to-white">
          <template #header>
            <h2 class="text-xl font-bold text-indigo-800">¡Estoy analizando tu perfil, {{ userData.name }}!</h2>
          </template>
          <div class="text-gray-700 mb-4 flex flex-col items-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="text-indigo-500 animate-spin h-12 w-12 mb-4" />
            <p class="text-center mb-4">Estoy generando recomendaciones personalizadas para tu perfil 
              <span class="font-semibold text-indigo-700">{{ getProfileDescription() }}</span>
            </p>
            <div class="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div class="bg-indigo-600 h-2 rounded-full animate-pulse" style="width: 75%"></div>
            </div>
            <p class="text-sm text-gray-500 mt-3">Este análisis es 100% personalizado según tus respuestas</p>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="analyzeProfile">
                VER RESULTADOS
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Results Screen -->
        <UCard v-else-if="currentStep === 'results'" class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-indigo-900">Tu Diagnóstico IA</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <div class="mb-6">
              <h3 class="font-bold text-lg text-indigo-800 mb-2">¡Hola {{ userData.name }}!</h3>
              <p class="mb-4">Hemos analizado tus respuestas y generado un perfil profesional para ti:</p>
              <div class="bg-indigo-50 p-4 rounded-lg mb-4">
                <h4 class="font-bold text-indigo-800">Tu perfil es: {{ userData.diagnostic?.professionalProfile }}</h4>
              </div>
            </div>
            
            <div class="mb-6">
              <h3 class="font-bold text-lg text-indigo-800 mb-2">Tus Fortalezas</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li v-for="(strength, index) in userData.diagnostic?.strengths" :key="index">
                  {{ strength }}
                </li>
              </ul>
            </div>
            
            <div class="mb-6">
              <h3 class="font-bold text-lg text-indigo-800 mb-2">Recomendaciones</h3>
              <ul class="list-disc pl-5 space-y-2">
                <li v-for="(recommendation, index) in userData.diagnostic?.recommendations" :key="index">
                  {{ recommendation }}
                </li>
              </ul>
            </div>
  
            <div class="mb-6">
              <h3 class="font-bold text-lg text-indigo-800 mb-2">Recomendaciones personalizadas para ti, {{ userData.name }}</h3>
              
              <h4 class="font-medium text-indigo-700 mt-4 mb-2">Cursos recomendados</h4>
              <div class="space-y-4">
                <div v-for="(course, index) in userData.diagnostic?.courses" :key="'course-'+index" 
                     class="border border-indigo-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex justify-between items-start">
                    <h5 class="font-semibold text-indigo-900">{{ course.title }}</h5>
                    <span class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                      {{ course.difficulty }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mt-2">{{ course.description }}</p>
                  <div class="flex justify-between items-center mt-3">
                    <span class="font-medium text-indigo-600">{{ course.price || 'Precio no disponible' }}</span>
                    <UButton v-if="course.link" size="sm" color="indigo" variant="ghost" :to="course.link">
                      Ver curso
                    </UButton>
                  </div>
                </div>
              </div>
  
              <h4 class="font-medium text-indigo-700 mt-6 mb-2">Servicios de automatización</h4>
              <div class="space-y-4">
                <div v-for="(service, index) in userData.diagnostic?.services" :key="'service-'+index" 
                     class="border border-indigo-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex justify-between items-start">
                    <h5 class="font-semibold text-indigo-900">{{ service.title }}</h5>
                    <span class="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-800">
                      {{ service.type }}
                    </span>
                  </div>
                  <p class="text-gray-600 text-sm mt-2">{{ service.description }}</p>
                  <div class="flex justify-between items-center mt-3">
                    <span class="font-medium text-indigo-600">{{ service.price || 'Precio no disponible' }}</span>
                    <UButton v-if="service.link" size="sm" color="indigo" variant="ghost" :to="service.link">
                      Ver servicio
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="restartQuestionnaire">
                COMENZAR DE NUEVO
              </UButton>
            </div>
          </template>
        </UCard>
  
        <!-- Default Card for Debugging -->
        <UCard v-else class="max-w-2xl mx-auto w-full">
          <template #header>
            <h2 class="text-xl font-bold text-gray-800">{{ currentStep }}</h2>
          </template>
          <div class="text-gray-700 mb-4">
            <p>Paso no implementado: {{ currentStep }}</p>
          </div>
          <template #footer>
            <div class="flex justify-center">
              <UButton color="indigo" variant="solid" @click="nextStep">
                SIGUIENTE
              </UButton>
            </div>
          </template>
        </UCard>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  // User data and progress
  interface UserData {
    name: string;
    workStatus?: 'employee' | 'freelancer' | 'business_owner' | 'full_time' | 'part_time' | 'other';
    otherWorkStatus?: string;
    services?: ('development' | 'design' | 'marketing' | 'content')[];
    experience?: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
    email?: string;
    freelancer?: {
      services: ('development' | 'design' | 'marketing' | 'content' | 'consulting' | 'education' | 'translation' | 'other')[];
      otherService?: string;
      experience: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
      clientsPerMonth: '1_2' | '3_5' | '6_10' | 'more_than_10';
      platforms: ('upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'linkedin' | 'personal_website' | 'referrals' | 'direct_network' | 'other')[];
      otherPlatform?: string;
    };
    businessOwner?: {
      businessType: 'tech_startup' | 'professional_services' | 'retail' | 'manufacturing' | 'creative_agency' | 'consulting' | 'other';
      otherBusinessType?: string;
      employeeCount: 'solo' | '2_5' | '6_20' | '21_50' | '50_plus';
      foundingTime: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
      aiPolicy: 'formal' | 'planned' | 'no_plans' | 'not_considered';
    };
    commonAI?: {
      funding?: 'personal' | 'business' | 'client' | 'free';
      disclosure?: 'always' | 'sometimes' | 'never' | 'when_asked';
      investment?: 'none' | 'under_50' | '50_to_100' | 'over_100';
      valueProposition?: 'yes' | 'no' | 'working_on_it';
      rateAdjustment?: 'increased' | 'decreased' | 'same' | 'case_by_case';
      projectImpact?: 'positive' | 'negative' | 'neutral' | 'mixed';
    };
    diagnostic?: {
      professionalProfile: string;
      strengths: string[];
      recommendations: string[];
      courses: {
        title: string;
        description: string;
        difficulty: 'principiante' | 'intermedio' | 'avanzado';
        price?: string;
        link?: string;
      }[];
      services: {
        title: string;
        description: string;
        type: 'automatización' | 'productividad' | 'análisis' | 'creatividad';
        price?: string;
        link?: string;
      }[];
    };
  }
  
  const userData = ref<UserData>({
    name: '',
    workStatus: undefined,
    services: [],
    experience: undefined,
    email: '',
    commonAI: {},
    diagnostic: {
      professionalProfile: '',
      strengths: [],
      recommendations: [],
      courses: [],
      services: []
    }
  });
  
  const currentStep = ref('welcome');
  const lastQuestionStep = ref('');
  const progress = ref(0);
  const questionCounter = ref(0);
  const tipInterval = ref(Math.floor(Math.random() * 3) + 2); // At least 2 questions between tips
  
  // Tips array
  const tips = [
    'Recuerda siempre actualizar tus habilidades profesionales.',
    'La colaboración puede abrir nuevas oportunidades.',
    'Mantén un equilibrio entre trabajo y vida personal.',
    'Explora nuevas herramientas tecnológicas para mejorar tu eficiencia.'
  ];
  
  const currentTip = ref('');
  const currentQuestion = ref('');
  const conversationalMessage = ref('');
  const nextStepAfterConversation = ref('');
  
  // Function to update the current question
  const updateCurrentQuestion = () => {
    currentQuestion.value = `Pregunta ${questionCounter.value + 1}`;
  };
  
  // Function to move to the next step
  const nextStep = () => {
    if (currentStep.value === 'tip') {
      // After a tip is shown, continue to the next question
      currentStep.value = getNextStep(lastQuestionStep.value);
      tipInterval.value = Math.floor(Math.random() * 3) + 2; // At least 2 questions between tips
    } else {
      // Store current step before changing it (only if it's not a tip)
      if (currentStep.value !== 'welcome' && currentStep.value !== 'results') {
        lastQuestionStep.value = currentStep.value;
        
        // Incrementar contador de preguntas y actualizar progreso
        questionCounter.value++;
        updateCurrentQuestion();
        
        // Solo mostrar el feedback conversacional en preguntas clave
        const keyQuestions = ['work_status', 'freelancer_experience', 'business_type', 'ai_investment'];
        if (keyQuestions.includes(currentStep.value)) {
          // Generar mensaje conversacional para las preguntas clave
          conversationalMessage.value = generateFeedback(currentStep.value);
          
          // Guardar el siguiente paso para continuar después de mostrar el mensaje
          nextStepAfterConversation.value = getNextStep(currentStep.value);
          
          // Cambiar a la pantalla de mensaje conversacional
          currentStep.value = 'conversation';
          updateProgress();
          return; // Salir temprano ya que continuaremos desde la pantalla conversacional
        }
        
        // Chequeamos si debemos mostrar un consejo
        if (questionCounter.value >= tipInterval.value && currentStep.value !== 'results') {
          // Show a tip
          currentTip.value = tips[Math.floor(Math.random() * tips.length)];
          currentStep.value = 'tip';
          // Reset counter for next tip interval
          questionCounter.value = 0;
          updateProgress();
          return; // Exit early as we'll continue from the tip
        }
      }
      
      // Proceed to next step
      currentStep.value = getNextStep(currentStep.value);
      updateProgress();
    }
  };
  
  
  
  // Función para continuar después de mostrar un mensaje conversacional
  const continueAfterMessage = () => {
    // Pasar al siguiente paso almacenado
    currentStep.value = nextStepAfterConversation.value;
    updateProgress();
  };
  
  // Function to restart the questionnaire
  const restartQuestionnaire = () => {
    userData.value = {
      name: '',
      workStatus: undefined,
      services: [],
      experience: undefined,
      email: '',
      commonAI: {},
      diagnostic: {
        professionalProfile: '',
        strengths: [],
        recommendations: [],
        courses: [],
        services: []
      }
    };
    currentStep.value = 'welcome';
    lastQuestionStep.value = '';
    progress.value = 0;
    questionCounter.value = 0;
    tipInterval.value = Math.floor(Math.random() * 3) + 2;
    updateCurrentQuestion();
  };
  
  // Initialize the first question
  updateCurrentQuestion();
  
  // Other existing functions and data
  interface WorkStatusOption {
    value: 'employee' | 'freelancer' | 'business_owner' | 'full_time' | 'part_time' | 'other';
    label: string;
  }
  
  const workStatusOptions: WorkStatusOption[] = [
    { value: 'full_time', label: 'Empleado de tiempo completo' },
    { value: 'part_time', label: 'Empleado de tiempo parcial' },
    { value: 'freelancer', label: 'Freelancer/Trabajador independiente' },
    { value: 'business_owner', label: 'Dueño de empresa/Emprendedor' },
    { value: 'other', label: 'Otro' }
  ];
  
  const isWorkStatusValid = computed(() => {
    if (userData.value.workStatus === 'other') {
      return !!userData.value.otherWorkStatus?.trim();
    }
    return !!userData.value.workStatus;
  });
  
  const sections = [
    'SECCIÓN INICIAL: TIPO DE TRABAJADOR',
    'INFORMACIÓN ESPECÍFICA',
    'USO DE IA',
    'ACTITUDES Y PERCEPCIONES',
    'CONOCIMIENTO Y CAPACIDADES',
    'IMPACTO Y RESULTADOS'
  ];
  
  const steps = {
    initial: ['work_status'],
    freelancer: [
      'freelancer_services',
      'freelancer_experience',
      'freelancer_clients',
      'freelancer_platforms'
    ],
    business: [
      'business_type',
      'business_size',
      'business_age',
      'business_ai_policy'
    ],
    common: [
      'ai_funding',
      'ai_disclosure',
      'ai_investment',
      'ai_value_proposition',
      'ai_rate_adjustment',
      'ai_project_impact',
      'email',
      'analysis',
      'results'
    ]
  };
  
  const currentSection = computed(() => {
    const step = currentStep.value;
    if (step.startsWith('freelancer_')) return sections[1];
    if (step.startsWith('business_')) return sections[1];
    if (step.startsWith('ai_')) {
      if (step === 'ai_funding' || step === 'ai_disclosure' || step === 'ai_investment') return sections[2];
      if (step === 'ai_value_proposition') return sections[3];
      return sections[5];
    }
    return sections[0];
  });
  
  const getNextStep = (currentStep: string): string => {
    // Welcome to name
    if (currentStep === 'welcome') return 'name';
    
    // Name to work status
    if (currentStep === 'name') return 'work_status';
    
    // Initial branch
    if (currentStep === 'work_status') {
      if (userData.value.workStatus === 'freelancer') return 'freelancer_services';
      if (userData.value.workStatus === 'business_owner') return 'business_type';
      return 'ai_funding';
    }
  
    // Freelancer branch
    if (steps.freelancer.includes(currentStep)) {
      const index = steps.freelancer.indexOf(currentStep);
      if (index < steps.freelancer.length - 1) {
        return steps.freelancer[index + 1];
      }
      return 'ai_funding';
    }
  
    // Business branch
    if (steps.business.includes(currentStep)) {
      const index = steps.business.indexOf(currentStep);
      if (index < steps.business.length - 1) {
        return steps.business[index + 1];
      }
      return 'ai_funding';
    }
  
    // Common branch
    if (steps.common.includes(currentStep)) {
      const index = steps.common.indexOf(currentStep);
      if (index < steps.common.length - 1) {
        return steps.common[index + 1];
      }
    }
  
    // Default to results if no other path is found
    return 'results';
  };
  
  const selectWorkStatus = (status: 'employee' | 'freelancer' | 'business_owner' | 'full_time' | 'part_time' | 'other') => {
    userData.value.workStatus = status;
    
    // Initialize appropriate data structures based on work status
    if (status === 'freelancer' && !userData.value.freelancer) {
      userData.value.freelancer = {
        services: [],
        experience: 'less_than_1',
        clientsPerMonth: '1_2',
        platforms: []
      };
    } else if (status === 'business_owner' && !userData.value.businessOwner) {
      userData.value.businessOwner = {
        businessType: 'tech_startup',
        employeeCount: 'solo',
        foundingTime: 'less_than_1',
        aiPolicy: 'not_considered'
      };
    }
  };
  
  interface ServiceOption {
    value: 'development' | 'design' | 'marketing' | 'content';
    label: string;
  }
  
  const servicesOptions: ServiceOption[] = [
    { value: 'development', label: 'Desarrollo de software/Programación' },
    { value: 'design', label: 'Diseño/Creatividad' },
    { value: 'marketing', label: 'Marketing digital' },
    { value: 'content', label: 'Redacción/Contenido' }
  ];
  
  const isServiceSelected = (service: 'development' | 'design' | 'marketing' | 'content'): boolean => {
    return userData.value.services?.includes(service) ?? false;
  };
  
  const toggleService = (service: 'development' | 'design' | 'marketing' | 'content') => {
    if (!userData.value.services) {
      userData.value.services = [];
    }
    
    const index = userData.value.services.indexOf(service);
    if (index === -1) {
      userData.value.services.push(service);
    } else {
      userData.value.services.splice(index, 1);
    }
  };
  
  interface FreelancerServiceOption {
    value: 'development' | 'design' | 'marketing' | 'content' | 'consulting' | 'education' | 'translation' | 'other';
    label: string;
  }
  
  const freelancerServicesOptions: FreelancerServiceOption[] = [
    { value: 'development', label: 'Desarrollo de software/Programación' },
    { value: 'design', label: 'Diseño/Creatividad' },
    { value: 'marketing', label: 'Marketing digital' },
    { value: 'content', label: 'Redacción/Contenido' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'education', label: 'Educación/Tutorías' },
    { value: 'translation', label: 'Traducción' },
    { value: 'other', label: 'Otro' }
  ];
  
  const isFreelancerServiceSelected = (service: 'development' | 'design' | 'marketing' | 'content' | 'consulting' | 'education' | 'translation' | 'other'): boolean => {
    return userData.value.freelancer?.services?.includes(service) ?? false;
  };
  
  const toggleFreelancerService = (service: 'development' | 'design' | 'marketing' | 'content' | 'consulting' | 'education' | 'translation' | 'other') => {
    if (!userData.value.freelancer) {
      userData.value.freelancer = {
        services: [],
        experience: 'less_than_1',
        clientsPerMonth: '1_2',
        platforms: []
      };
    }
    
    const index = userData.value.freelancer.services.indexOf(service);
    if (index === -1) {
      userData.value.freelancer.services.push(service);
    } else {
      userData.value.freelancer.services.splice(index, 1);
    }
  };
  
  interface FreelancerExperienceOption {
    value: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
    label: string;
  }
  
  const freelancerExperienceOptions: FreelancerExperienceOption[] = [
    { value: 'less_than_1', label: 'Menos de 1 año' },
    { value: '1_to_3', label: '1-3 años' },
    { value: '4_to_6', label: '4-6 años' },
    { value: 'more_than_6', label: 'Más de 6 años' }
  ];
  
  const selectFreelancerExperience = (experience: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6') => {
    if (!userData.value.freelancer) {
      userData.value.freelancer = {
        services: [],
        experience,
        clientsPerMonth: '1_2',
        platforms: []
      };
    } else {
      userData.value.freelancer.experience = experience;
    }
  };
  
  interface FreelancerClientsOption {
    value: '1_2' | '3_5' | '6_10' | 'more_than_10';
    label: string;
  }
  
  const freelancerClientsOptions: FreelancerClientsOption[] = [
    { value: '1_2', label: '1-2 clientes' },
    { value: '3_5', label: '3-5 clientes' },
    { value: '6_10', label: '6-10 clientes' },
    { value: 'more_than_10', label: 'Más de 10 clientes' }
  ];
  
  const selectFreelancerClients = (clients: '1_2' | '3_5' | '6_10' | 'more_than_10') => {
    if (!userData.value.freelancer) {
      userData.value.freelancer = {
        services: [],
        experience: 'less_than_1',
        clientsPerMonth: clients,
        platforms: []
      };
    } else {
      userData.value.freelancer.clientsPerMonth = clients;
    }
  };
  
  interface FreelancerPlatformOption {
    value: 'upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'linkedin' | 'personal_website' | 'referrals' | 'direct_network' | 'other';
    label: string;
  }
  
  const freelancerPlatformsOptions: FreelancerPlatformOption[] = [
    { value: 'upwork', label: 'Upwork' },
    { value: 'fiverr', label: 'Fiverr' },
    { value: 'freelancer', label: 'Freelancer.com' },
    { value: 'toptal', label: 'Toptal' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'direct_network', label: 'Red de contactos directos' },
    { value: 'other', label: 'Otro' }
  ];
  
  const isFreelancerPlatformSelected = (platform: 'upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'linkedin' | 'personal_website' | 'referrals' | 'direct_network' | 'other'): boolean => {
    return userData.value.freelancer?.platforms?.includes(platform) ?? false;
  };
  
  interface BusinessTypeOption {
    value: 'tech_startup' | 'professional_services' | 'retail' | 'manufacturing' | 'creative_agency' | 'consulting' | 'other';
    label: string;
  }
  
  const businessTypeOptions: BusinessTypeOption[] = [
    { value: 'tech_startup', label: 'Startup tecnológica' },
    { value: 'professional_services', label: 'Empresa de servicios profesionales' },
    { value: 'retail', label: 'Comercio minorista' },
    { value: 'manufacturing', label: 'Empresa de manufactura' },
    { value: 'creative_agency', label: 'Agencia creativa/marketing' },
    { value: 'consulting', label: 'Consultoría' },
    { value: 'other', label: 'Otro' }
  ];
  
  const isBusinessTypeValid = computed(() => {
    if (userData.value.businessOwner?.businessType === 'other') {
      return !!userData.value.businessOwner.otherBusinessType?.trim();
    }
    return !!userData.value.businessOwner?.businessType;
  });
  
  const selectBusinessType = (type: 'tech_startup' | 'professional_services' | 'retail' | 'manufacturing' | 'creative_agency' | 'consulting' | 'other') => {
    if (!userData.value.businessOwner) {
      userData.value.businessOwner = {
        businessType: type,
        employeeCount: 'solo',
        foundingTime: 'less_than_1',
        aiPolicy: 'not_considered'
      };
    } else {
      userData.value.businessOwner.businessType = type;
    }
  };
  
  interface BusinessSizeOption {
    value: 'solo' | '2_5' | '6_20' | '21_50' | '50_plus';
    label: string;
  }
  
  const businessSizeOptions: BusinessSizeOption[] = [
    { value: 'solo', label: 'Solo yo' },
    { value: '2_5', label: '2-5 empleados' },
    { value: '6_20', label: '6-20 empleados' },
    { value: '21_50', label: '21-50 empleados' },
    { value: '50_plus', label: 'Más de 50 empleados' }
  ];
  
  const selectBusinessSize = (size: 'solo' | '2_5' | '6_20' | '21_50' | '50_plus') => {
    if (!userData.value.businessOwner) {
      userData.value.businessOwner = {
        businessType: 'tech_startup',
        employeeCount: size,
        foundingTime: 'less_than_1',
        aiPolicy: 'not_considered'
      };
    } else {
      userData.value.businessOwner.employeeCount = size;
    }
  };
  
  interface BusinessAgeOption {
    value: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
    label: string;
  }
  
  const businessAgeOptions: BusinessAgeOption[] = [
    { value: 'less_than_1', label: 'Menos de 1 año' },
    { value: '1_to_3', label: '1-3 años' },
    { value: '4_to_6', label: '4-6 años' },
    { value: 'more_than_6', label: 'Más de 6 años' }
  ];
  
  const selectBusinessAge = (age: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6') => {
    if (!userData.value.businessOwner) {
      userData.value.businessOwner = {
        businessType: 'tech_startup',
        employeeCount: 'solo',
        foundingTime: age,
        aiPolicy: 'not_considered'
      };
    } else {
      userData.value.businessOwner.foundingTime = age;
    }
  };
  
  interface BusinessAIPolicyOption {
    value: 'formal' | 'planned' | 'no_plans' | 'not_considered';
    label: string;
  }
  
  const businessAIPolicyOptions: BusinessAIPolicyOption[] = [
    { value: 'formal', label: 'Sí, tenemos políticas formales' },
    { value: 'planned', label: 'No, pero planeamos implementarlas' },
    { value: 'no_plans', label: 'No, y no planeamos implementarlas' },
    { value: 'not_considered', label: 'No lo he considerado' }
  ];
  
  const selectBusinessAIPolicy = (policy: 'formal' | 'planned' | 'no_plans' | 'not_considered') => {
    if (!userData.value.businessOwner) {
      userData.value.businessOwner = {
        businessType: 'tech_startup',
        employeeCount: 'solo',
        foundingTime: 'less_than_1',
        aiPolicy: policy
      };
    } else {
      userData.value.businessOwner.aiPolicy = policy;
    }
  };
  
  const toggleFreelancerPlatform = (platform: 'upwork' | 'fiverr' | 'freelancer' | 'toptal' | 'linkedin' | 'personal_website' | 'referrals' | 'direct_network' | 'other') => {
    if (!userData.value.freelancer) {
      userData.value.freelancer = {
        services: [],
        experience: 'less_than_1',
        clientsPerMonth: '1_2',
        platforms: [platform]
      };
    } else {
      const index = userData.value.freelancer.platforms.indexOf(platform);
      if (index === -1) {
        userData.value.freelancer.platforms.push(platform);
      } else {
        userData.value.freelancer.platforms.splice(index, 1);
      }
    }
  };
  
  // Define types for AI sections
  interface AIFundingOption {
    value: 'personal' | 'business' | 'client' | 'free';
    label: string;
  }
  interface AIDisclosureOption {
    value: 'always' | 'sometimes' | 'never' | 'when_asked';
    label: string;
  }
  interface AIInvestmentOption {
    value: 'none' | 'under_50' | '50_to_100' | 'over_100';
    label: string;
  }
  interface AIValuePropositionOption {
    value: 'yes' | 'no' | 'working_on_it';
    label: string;
  }
  interface AIRateAdjustmentOption {
    value: 'increased' | 'decreased' | 'same' | 'case_by_case';
    label: string;
  }
  interface AIProjectImpactOption {
    value: 'positive' | 'negative' | 'neutral' | 'mixed';
    label: string;
  }
  
  // Define options for AI sections
  const aiFundingOptions: AIFundingOption[] = [
    { value: 'personal', label: 'Pago personal (de mi bolsillo)' },
    { value: 'business', label: 'Gastos de empresa/negocio' },
    { value: 'client', label: 'Facturado a clientes' },
    { value: 'free', label: 'Solo uso herramientas gratuitas' }
  ];
  
  const aiDisclosureOptions: AIDisclosureOption[] = [
    { value: 'always', label: 'Siempre informo sobre mi uso de IA' },
    { value: 'sometimes', label: 'A veces, dependiendo del cliente' },
    { value: 'never', label: 'Nunca lo menciono específicamente' },
    { value: 'when_asked', label: 'Solo cuando me preguntan' }
  ];
  
  const aiInvestmentOptions: AIInvestmentOption[] = [
    { value: 'none', label: 'Nada (solo uso herramientas gratuitas)' },
    { value: 'under_50', label: 'Menos de 50€ al mes' },
    { value: '50_to_100', label: 'Entre 50€ y 100€ al mes' },
    { value: 'over_100', label: 'Más de 100€ al mes' }
  ];
  
  const aiValuePropositionOptions: AIValuePropositionOption[] = [
    { value: 'yes', label: 'Sí, he adaptado mi propuesta de valor' },
    { value: 'no', label: 'No, sigo ofreciendo lo mismo' },
    { value: 'working_on_it', label: 'Estoy trabajando en ello' }
  ];
  
  const aiRateAdjustmentOptions: AIRateAdjustmentOption[] = [
    { value: 'increased', label: 'He aumentado mis tarifas' },
    { value: 'decreased', label: 'He reducido mis tarifas' },
    { value: 'same', label: 'Mantengo las mismas tarifas' },
    { value: 'case_by_case', label: 'Depende del proyecto' }
  ];
  
  const aiProjectImpactOptions: AIProjectImpactOption[] = [
    { value: 'positive', label: 'Impacto muy positivo' },
    { value: 'negative', label: 'Impacto negativo' },
    { value: 'neutral', label: 'Ni positivo ni negativo' },
    { value: 'mixed', label: 'Resultados mixtos' }
  ];
  
  // Functions to select AI options
  const selectAIFunding = (funding: AIFundingOption['value']) => {
    if (!userData.value.commonAI) {
      userData.value.commonAI = {};
    }
    userData.value.commonAI.funding = funding;
  };
  
  // Function to update progress
  const updateProgress = () => {
    // Calculate total number of steps based on user path
    let totalSteps = 2; // Welcome and name are always included
    
    if (userData.value.workStatus === 'freelancer') {
      totalSteps += steps.freelancer.length;
    } else if (userData.value.workStatus === 'business_owner') {
      totalSteps += steps.business.length;
    }
    
    // Common AI questions for everyone
    totalSteps += steps.common.length;
    
    // Calculate current progress
    let completedSteps = 0;
    
    // Count completed steps
    if (currentStep.value !== 'welcome' && currentStep.value !== 'name') {
      completedSteps = 2; // Welcome and name already completed
      
      if (userData.value.workStatus === 'freelancer') {
        const freelancerIndex = steps.freelancer.indexOf(currentStep.value);
        if (freelancerIndex !== -1) {
          completedSteps += freelancerIndex;
        } else if (steps.common.includes(currentStep.value) || currentStep.value === 'results') {
          completedSteps += steps.freelancer.length;
          const commonIndex = steps.common.indexOf(currentStep.value);
          if (commonIndex !== -1) {
            completedSteps += commonIndex;
          } else if (currentStep.value === 'results') {
            completedSteps += steps.common.length;
          }
        }
      } else if (userData.value.workStatus === 'business_owner') {
        const businessIndex = steps.business.indexOf(currentStep.value);
        if (businessIndex !== -1) {
          completedSteps += businessIndex;
        } else if (steps.common.includes(currentStep.value) || currentStep.value === 'results') {
          completedSteps += steps.business.length;
          const commonIndex = steps.common.indexOf(currentStep.value);
          if (commonIndex !== -1) {
            completedSteps += commonIndex;
          } else if (currentStep.value === 'results') {
            completedSteps += steps.common.length;
          }
        }
      } else {
        // For other work statuses
        const commonIndex = steps.common.indexOf(currentStep.value);
        if (commonIndex !== -1) {
          completedSteps += commonIndex;
        } else if (currentStep.value === 'results') {
          completedSteps += steps.common.length;
        }
      }
    }
    
    // Update progress value
    progress.value = Math.min(Math.round((completedSteps / totalSteps) * 100), 100);
  };
  
  const selectAIDisclosure = (disclosure: AIDisclosureOption['value']) => {
    if (!userData.value.commonAI) {
      userData.value.commonAI = {};
    }
    userData.value.commonAI.disclosure = disclosure;
  };
  
  const selectAIInvestment = (investment: AIInvestmentOption['value']) => {
    if (!userData.value.commonAI) {
      userData.value.commonAI = {};
    }
    userData.value.commonAI.investment = investment;
  };
  
  const selectAIValueProposition = (valueProposition: AIValuePropositionOption['value']) => {
    if (!userData.value.commonAI) {
      userData.value.commonAI = {};
    }
    userData.value.commonAI.valueProposition = valueProposition;
  };
  
  const selectAIRateAdjustment = (rateAdjustment: AIRateAdjustmentOption['value']) => {
    if (!userData.value.commonAI) {
      userData.value.commonAI = {};
    }
    userData.value.commonAI.rateAdjustment = rateAdjustment;
  };
  
  const selectAIProjectImpact = (projectImpact: AIProjectImpactOption['value']) => {
    if (!userData.value.commonAI) {
      userData.value.commonAI = {};
    }
    userData.value.commonAI.projectImpact = projectImpact;
  };
  
  interface ExperienceOption {
    value: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6';
    label: string;
  }
  
  const experienceOptions: ExperienceOption[] = [
    { value: 'less_than_1', label: 'Menos de 1 año' },
    { value: '1_to_3', label: '1-3 años' },
    { value: '4_to_6', label: '4-6 años' },
    { value: 'more_than_6', label: 'Más de 6 años' }
  ];
  
  const selectExperience = (experience: 'less_than_1' | '1_to_3' | '4_to_6' | 'more_than_6') => {
    userData.value.experience = experience;
  };
  
  const getWorkStatusLabel = (): string => {
    const status = workStatusOptions.find(option => option.value === userData.value.workStatus);
    return status ? status.label.toLowerCase() : '';
  };
  
  const isValidEmail = (email?: string): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  const getServicesLabel = (): string => {
    return userData.value.services
      ?.map(service => servicesOptions.find(option => option.value === service)?.label)
      .filter(Boolean)
      .join(', ') || '';
  };
  
  const getExperienceLabel = (): string => {
    return experienceOptions.find(option => option.value === userData.value.experience)?.label || '';
  };
  
  // Genera una descripción del perfil del usuario para la pantalla de análisis
  const getProfileDescription = (): string => {
    let description = '';
    
    // Describir por tipo de trabajo
    if (userData.value.workStatus === 'freelancer') {
      description = 'de profesional freelancer';
      // Verificar si existe freelancer y su experiencia
      if (userData.value.freelancer?.experience) {
        const experienceLabel = freelancerExperienceOptions.find(
          option => option.value === userData.value.freelancer?.experience
        )?.label?.toLowerCase() || '';
        if (experienceLabel) {
          description += ` con ${experienceLabel} de experiencia`;
        }
      }
    } else if (userData.value.workStatus === 'business_owner') {
      description = 'de dueño de negocio';
      // Verificar si existe la propiedad business en userData
      const businessData = (userData.value as any).business;
      if (businessData?.type) {
        const typeLabel = businessTypeOptions.find(
          option => option.value === businessData.type
        )?.label?.toLowerCase() || '';
        if (typeLabel) {
          description += ` de ${typeLabel}`;
        }
      }
    } else if (userData.value.workStatus === 'full_time' || userData.value.workStatus === 'part_time') {
      const statusLabel = workStatusOptions.find(option => option.value === userData.value.workStatus)?.label?.toLowerCase() || '';
      if (statusLabel) {
        description = `de ${statusLabel}`;
      }
    }
    
    return description;
  };
  
  // Función para generar respuestas conversacionales basadas en las respuestas del usuario
  const generateFeedback = (currentStepValue: string): string => {
    // Podríamos tener diferentes mensajes basados en el paso actual y las respuestas previas
    if (currentStepValue === 'name') {
      return `¡Gracias por compartir tu nombre, <strong>${userData.value.name}</strong>! Ahora me gustaría conocer un poco más sobre tu situación laboral.`;
    }
    
    if (currentStepValue === 'work_status') {
      const statusLabel = getWorkStatusLabel();
      return `Entendido, ${userData.value.name}. Veo que eres <strong>${statusLabel}</strong>. Esta información me ayudará a personalizar mejor las recomendaciones para ti.`;
    }
    
    if (currentStepValue === 'freelancer_experience') {
      if (!userData.value.freelancer) return `¡Gracias por tu respuesta, ${userData.value.name}!`;
      
      const freelancer = userData.value.freelancer;
      const experienceLabel = freelancerExperienceOptions.find(option => option.value === freelancer.experience)?.label.toLowerCase() || '';
      let message = `¡Excelente, ${userData.value.name}! Tienes <strong>${experienceLabel}</strong> de experiencia como freelancer.`;
      
      if (freelancer.experience === 'less_than_1') {
        message += ' Estás comenzando en este mundo, pero ya has dado el primer paso que es el más importante. Vamos a ayudarte a crecer.'; 
      } else if (freelancer.experience === '1_to_3') {
        message += ' Ya has superado la etapa inicial y estás en un buen momento para consolidar tu carrera y crecer profesionalmente.'; 
      } else if (freelancer.experience === '4_to_6') {
        message += ' Tienes una experiencia sólida que te da credibilidad y conocimientos valiosos para afrontar proyectos complejos.'; 
      } else if (freelancer.experience === 'more_than_6') {
        message += ' Eres un profesional experimentado con una trayectoria que demuestra solidez y expertise en tu campo.'; 
      }
      
      return message;
    }
    
    if (currentStepValue === 'freelancer_clients') {
      if (!userData.value.freelancer) return `¡Gracias por tu respuesta, ${userData.value.name}!`;
      
      const freelancer = userData.value.freelancer;
      const clientsLabel = freelancerClientsOptions.find(option => option.value === freelancer.clientsPerMonth)?.label.toLowerCase() || '';
      let message = `Interesante, ${userData.value.name}. Trabajas con <strong>${clientsLabel}</strong> mensualmente.`;
      
      if (freelancer.clientsPerMonth === '1_2') {
        message += ' Esto te permite enfocarte profundamente en cada proyecto y dar un servicio muy personalizado.'; 
      } else if (freelancer.clientsPerMonth === '3_5') {
        message += ' Un número ideal para balancear diversidad de proyectos y atención personalizada.'; 
      } else if (freelancer.clientsPerMonth === '6_10' || freelancer.clientsPerMonth === 'more_than_10') {
        message += ' Manejas una cartera de clientes considerable, lo que indica una gran capacidad de gestión y organización.'; 
      }
      
      return message;
    }
  
    if (currentStepValue === 'freelancer_services') {
      const services = userData.value.freelancer?.services || [];
      if (services.length > 0) {
        const serviceLabels = services.map(service => 
          freelancerServicesOptions.find(option => option.value === service)?.label.toLowerCase() || ''
        ).filter(Boolean);
        
        let message = `Gracias por compartir, ${userData.value.name}. Veo que ofreces servicios de <strong>${serviceLabels.join(', ')}</strong>.`;
        if (services.includes('development')) {
          message += ' El desarrollo de software es un campo ideal para implementar herramientas de IA.'; 
        } else if (services.includes('design')) {
          message += ' El diseño es un área donde la IA está revolucionando las posibilidades creativas.'; 
        } else if (services.includes('marketing')) {
          message += ' El marketing digital potenciado con IA puede mejorar significativamente los resultados de tus campañas.';
        }
        
        return message;
      }
    }
    
    if (currentStepValue === 'business_type') {
      const businessTypeLabel = businessTypeOptions.find(option => option.value === userData.value.businessOwner?.businessType)?.label.toLowerCase() || '';
      return `Gracias por la información, ${userData.value.name}. Tu negocio como <strong>${businessTypeLabel}</strong> tiene características específicas que consideraré para las recomendaciones de automatización.`;
    }
    
    if (currentStepValue === 'business_size') {
      const sizeLabel = businessSizeOptions.find(option => option.value === userData.value.businessOwner?.employeeCount)?.label.toLowerCase() || '';
      let message = `Entendido, ${userData.value.name}. Tu empresa cuenta con <strong>${sizeLabel}</strong>.`;
      
      if (userData.value.businessOwner?.employeeCount === 'solo' || userData.value.businessOwner?.employeeCount === '2_5') {
        message += ' Las empresas pequeñas suelen beneficiarse enormemente de la automatización para maximizar recursos limitados.'; 
      } else {
        message += ' Con este tamaño de equipo, la IA puede ayudar a mejorar la colaboración y eficiencia interna.'; 
      }
      
      return message;
    }
    
    if (currentStepValue === 'ai_disclosure') {
      const disclosureLabel = aiDisclosureOptions.find(option => option.value === userData.value.commonAI?.disclosure)?.label.toLowerCase() || '';
      let message = `Interesante enfoque, ${userData.value.name}. <strong>${disclosureLabel}</strong> sobre tu uso de IA con clientes.`;
      
      if (userData.value.commonAI?.disclosure === 'always') {
        message += ' La transparencia suele generar mayor confianza con los clientes y posicionarte como un profesional innovador.'; 
      } else if (userData.value.commonAI?.disclosure === 'never') {
        message += ' Entiendo que prefieres mantener el enfoque en los resultados más que en las herramientas utilizadas.'; 
      }
      
      return message;
    }
    
    if (currentStepValue === 'ai_investment') {
      const investmentLabel = aiInvestmentOptions.find(option => option.value === userData.value.commonAI?.investment)?.label.toLowerCase() || '';
      let message = `Comprendo, ${userData.value.name}. <strong>${investmentLabel}</strong> en herramientas de IA mensualmente.`;
      
      if (userData.value.commonAI?.investment === 'none' || userData.value.commonAI?.investment === 'under_50') {
        message += ' Hay excelentes opciones gratuitas o de bajo costo que pueden darte buenos resultados iniciales.'; 
      } else {
        message += ' Esta inversión te permite acceder a herramientas más avanzadas y personalizadas.'; 
      }
      
      return message;
    }
    
    if (currentStepValue === 'ai_project_impact') {
      const impactLabel = aiProjectImpactOptions.find(option => option.value === userData.value.commonAI?.projectImpact)?.label.toLowerCase() || '';
      let message = `Gracias por compartir, ${userData.value.name}. Es interesante que percibes un impacto <strong>${impactLabel}</strong> de la IA en tus proyectos.`;
      
      if (userData.value.commonAI?.projectImpact === 'positive') {
        message += ' Esto indica que estás implementando estas herramientas de manera efectiva.'; 
      } else if (userData.value.commonAI?.projectImpact === 'negative') {
        message += ' Podemos identificar mejores estrategias y herramientas que se adapten mejor a tus necesidades.'; 
      } else if (userData.value.commonAI?.projectImpact === 'mixed') {
        message += ' Es común tener resultados mixtos mientras se encuentra el enfoque adecuado para cada caso.'; 
      }
      
      return message;
    }
    
    // Si no hay un mensaje específico para el paso, devolver un mensaje genérico
    return `Gracias por compartir esa información, ${userData.value.name}. Continuemos con el cuestionario para personalizar mejor tus recomendaciones.`;
  };
  
  const analyzeProfile = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  
    // Analizamos el perfil del usuario para personalizar las recomendaciones
    let professionalProfile = 'Innovador Tecnológico';
    let strengths = ['Creatividad', 'Adaptabilidad', 'Pensamiento Crítico'];
    let recommendations = [
      'Explora nuevas herramientas de IA para mejorar tus procesos.',
      'Considera colaborar con otros profesionales en proyectos innovadores.',
      'Mantente al día con las últimas tendencias tecnológicas.'
    ];
    
    // Generamos cursos personalizados basados en el perfil del usuario
    let courses = [];
    if (userData.value.workStatus === 'freelancer') {
      courses = [
        {
          title: 'Automatización Freelance con IA',
          description: 'Aprende a automatizar tareas repetitivas para aumentar tu productividad como freelancer.',
          difficulty: 'intermedio' as 'principiante' | 'intermedio' | 'avanzado',
          price: '89€',
          link: '#curso-freelance-ia'
        },
        {
          title: 'Propuestas Comerciales con IA para Freelancers',
          description: 'Crea propuestas de alta conversión utilizando herramientas de IA que impresionarán a tus clientes.',
          difficulty: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
          price: '69€',
          link: '#propuestas-comerciales'
        },
        {
          title: 'Optimización SEO con IA',
          description: 'Mejora la visibilidad de tu portafolio y contenidos con las últimas técnicas de SEO potenciadas por IA.',
          difficulty: 'avanzado' as 'principiante' | 'intermedio' | 'avanzado',
          price: '129€',
          link: '#seo-con-ia'
        }
      ];
    } else if (userData.value.workStatus === 'business_owner') {
      courses = [
        {
          title: 'IA para Emprendedores',
          description: 'Estrategias para implementar IA en tu negocio y obtener ventajas competitivas.',
          difficulty: 'intermedio' as 'principiante' | 'intermedio' | 'avanzado',
          price: '149€',
          link: '#ia-emprendedores'
        },
        {
          title: 'Automatización de Procesos de Negocio',
          description: 'Implementa flujos de trabajo automatizados que reducirán costos y aumentarán la eficiencia operativa.',
          difficulty: 'avanzado' as 'principiante' | 'intermedio' | 'avanzado',
          price: '199€',
          link: '#automatizacion-procesos'
        },
        {
          title: 'IA para Marketing y Ventas',
          description: 'Aprovecha el poder de la IA para optimizar tus estrategias de marketing y aumentar las conversiones.',
          difficulty: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
          price: '99€',
          link: '#ia-marketing-ventas'
        }
      ];
    } else {
      // Para empleados u otros
      courses = [
        {
          title: 'IA para Productividad Personal',
          description: 'Optimiza tu trabajo diario y destaca en tu empresa con herramientas de IA.',
          difficulty: 'principiante' as 'principiante' | 'intermedio' | 'avanzado',
          price: '79€',
          link: '#ia-productividad'
        },
        {
          title: 'Automatización de Informes y Análisis',
          description: 'Aprende a crear informes automáticos y análisis de datos usando IA que impresionarán a tus jefes.',
          difficulty: 'intermedio' as 'principiante' | 'intermedio' | 'avanzado',
          price: '109€',
          link: '#automatizacion-informes'
        },
        {
          title: 'Desarrollo Profesional con IA',
          description: 'Prepárate para el futuro laboral con habilidades de IA que serán indispensables en los próximos años.',
          difficulty: 'avanzado' as 'principiante' | 'intermedio' | 'avanzado',
          price: '159€',
          link: '#desarrollo-profesional-ia'
        }
      ];
    }
    
    // Recomendaciones de servicios de automatización
    let services = [
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
    
    // Personalización adicional basada en el uso de IA del usuario
    if (userData.value.commonAI?.investment === 'over_100') {
      // Para usuarios que ya invierten mucho en IA
      services.push({
        title: 'Consultoría en Integración Avanzada de IA',
        description: 'Optimiza tu inversión en IA con un plan personalizado para integrar todas tus herramientas.',
        type: 'productividad',
        price: 'Desde 299€/sesión',
        link: '#consultoria-ia'
      });
    }
    
    if (userData.value.commonAI?.projectImpact === 'positive') {
      // Para usuarios que ya están viendo resultados positivos con IA
      services.push({
        title: 'Escalado de Soluciones IA',
        description: 'Lleva tus éxitos con IA al siguiente nivel con soluciones escalables para proyectos más grandes.',
        type: 'automatización' as 'automatización' | 'productividad' | 'análisis' | 'creatividad',
        price: 'Desde 199€/mes',
        link: '#escalado-ia'
      });
    }
  
    // Compilamos el resultado final
    const diagnosticResult = {
      professionalProfile,
      strengths,
      recommendations,
      courses,
      services
    };
  
    // Set the result to userData
    userData.value.diagnostic = diagnosticResult;
    currentStep.value = 'results';
  };
  </script>
  
<template>
  <div class="mt-6 border-t pt-4">
    <h3 class="font-bold text-lg text-indigo-800 mb-2">
      Comparte tus resultados
    </h3>
    <div class="flex flex-wrap gap-3 justify-center mt-2">
      <UButton
        icon="i-mdi-content-copy" 
        color="gray" 
        variant="soft"
        @click="copyLink"
        :loading="copying"
      >
        Copiar enlace
      </UButton>
      <UButton
        icon="i-mdi-whatsapp" 
        color="green" 
        variant="soft"
        @click="shareOnWhatsApp"
      >
        WhatsApp
      </UButton>
      <UButton
        icon="i-mdi-linkedin" 
        color="blue" 
        variant="soft"
        @click="shareOnLinkedIn"
      >
        LinkedIn
      </UButton>
      <UButton
        icon="i-mdi-twitter" 
        color="sky" 
        variant="soft"
        @click="shareOnTwitter"
      >
        Twitter
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  profileName?: string;
  referralCode?: string;
}>();

const emit = defineEmits<{
  (e: 'share', platform: string): void;
}>();

const copying = ref(false);

// Generate the sharing URL with referral code
const getSharingUrl = () => {
  const baseUrl = window.location.origin;
  const referralPart = props.referralCode ? `?ref=${props.referralCode}` : '';
  return `${baseUrl}${referralPart}`;
};

// Generate sharing message
const getSharingMessage = () => {
  const profile = props.profileName || 'mi diagnóstico IA';
  return `¡Acabo de completar ${profile}! Descubre tu perfil y cómo puedes aprovechar la IA en tu trabajo.`;
};

// Copy link to clipboard
const copyLink = async () => {
  copying.value = true;
  try {
    await navigator.clipboard.writeText(getSharingUrl());
    setTimeout(() => {
      copying.value = false;
    }, 1500);
    emit('share', 'clipboard');
  } catch (error) {
    console.error('Error copying link:', error);
    copying.value = false;
  }
};

// Share on WhatsApp
const shareOnWhatsApp = () => {
  const url = encodeURIComponent(getSharingUrl());
  const message = encodeURIComponent(getSharingMessage());
  window.open(`https://wa.me/?text=${message} ${url}`, '_blank');
  emit('share', 'whatsapp');
};

// Share on LinkedIn
const shareOnLinkedIn = () => {
  const url = encodeURIComponent(getSharingUrl());
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  emit('share', 'linkedin');
};

// Share on Twitter
const shareOnTwitter = () => {
  const url = encodeURIComponent(getSharingUrl());
  const message = encodeURIComponent(getSharingMessage());
  window.open(`https://twitter.com/intent/tweet?text=${message}&url=${url}`, '_blank');
  emit('share', 'twitter');
};
</script>

// src/composables/useScrollReveal.ts
import { onMounted } from 'vue';
import scrollReveal from 'scrollreveal';

export function useScrollReveal() {
  onMounted(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const sr = scrollReveal();
        sr.reveal('.reveal', {
          distance: '50px',
          duration: 1000,
          easing: 'ease-in-out',
          origin: 'bottom',
          reset: true,
          interval: 200,
        });
      }, 0);
      // CountDown
    }
  });
}
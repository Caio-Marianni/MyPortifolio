"use client";

import { useEffect } from "react";

export default function ScrollRevealComponent() {
  useEffect(() => {
    async function initScrollReveal() {
      // Importa dinamicamente o módulo ScrollReveal (apenas no cliente)
      const ScrollRevealModule = await import("scrollreveal");
      const ScrollReveal = ScrollRevealModule.default;

      // Configurações para os elementos com as classes especificadas
      ScrollReveal().reveal('.reveal500', {
        distance: '50px',
        duration: 500,
        easing: 'ease-in-out',
        origin: 'bottom',
        reset: false,
      });
      ScrollReveal().reveal('.reveal2000Opacity', {
        distance: '0px',
        duration: 2000,
        easing: 'ease-in',
        origin: 'bottom',
        reset: false,
      });
      ScrollReveal().reveal('.revealRight', {
        distance: '80px',
        duration: 700,
        easing: 'ease-in-out',
        origin: 'right',
        reset: false,
      });
      ScrollReveal().reveal('.revealLeft', {
        distance: '80px',
        duration: 700,
        easing: 'ease-in-out',
        origin: 'left',
        reset: false,
      });
    }
    initScrollReveal();
  }, []);

  return null;
}

"use client";
import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export default function ScrollRevealComponent() {
  useEffect(() => {
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
  }, []);
  return null;
}

<template>
  <button
    @click="toggleTheme"
    class="theme-toggle rounded-full bg-transparent flex items-center justify-center transition focus:outline-none"
    :aria-label="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
  >
    <svg
      class="sun-and-moon"
      aria-hidden="true"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <!-- Moon Mask -->
      <mask id="moon-mask" class="moon">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <circle cx="24" cy="10" r="6" fill="black" />
      </mask>
      <!-- Sun -->
      <circle
        class="sun transition-transform duration-500 ease-[cubic-bezier(0.25, 0.8, 0.25, 1.0)]"
        cx="12"
        cy="12"
        r="6"
        mask="url(#moon-mask)"
        fill="currentColor"
      />
      <!-- Sun Beams -->
      <g
        class="sun-beams transition-transform duration-500 ease-[cubic-bezier(0.25, 0.8, 0.25, 1.0)]"
        stroke="currentColor"
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  </button>
</template>

<script setup>
import { ref } from "vue";

const isDarkMode = ref(false);

// Check for saved theme preference
if (localStorage.getItem("theme") === "dark") {
  isDarkMode.value = true;
  document.documentElement.classList.add("dark");
}

// Toggle theme function
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
};
</script>

<style scoped>
/* Apply CSS transitions and animations */
.sun-and-moon {
  & > :is(.moon, .sun, .sun-beams) {
    transform-origin: center;
  }
}

/* Dark mode animations */
html.dark .sun {
  transform: scale(1.5);
}

html.dark .sun-beams {
  opacity: 0;
  transform: rotate(-25deg);
}

html.dark .sun > circle {
  transform: translateX(-0px);
}
html.dark .moon > circle {
  transform: translateX(-7px);
}
</style>

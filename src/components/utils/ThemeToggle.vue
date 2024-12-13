<template>
  <button
    @click="toggleTheme"
    class="w-10 h-10 rounded-lg shadow-sm shadow-slate-400"
  >
    <span v-if="isDarkMode">☀️</span>
    <span v-else>🌙</span>
  </button>
</template>

<script>
export default {
  data() {
    return {
      isDarkMode: false,
    };
  },
  mounted() {
    // Verifica o tema armazenado no localStorage ao carregar a página
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      this.applyTheme();
    },
    applyTheme() {
      const html = document.documentElement;
      if (this.isDarkMode) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    },
  },
};
</script>

<style scoped>
button {
  cursor: pointer;
}
</style>

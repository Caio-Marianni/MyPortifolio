<template>
  <div :style="{ width: size + 'px', height: size + 'px', fill: color }">
    <!-- Renderiza o conteúdo filho com os atributos dinâmicos -->
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: Number,
    default: 24, // Tamanho padrão
  },
  color: {
    type: String,
    default: 'currentColor', // Cor padrão herda a cor do texto
  },
});
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>

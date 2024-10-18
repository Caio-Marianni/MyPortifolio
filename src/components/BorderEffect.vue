<script setup lang="ts">
import IconBorderEffect from '../assets/icons/IconBorderEffect.vue';
</script>

<template>
  <div class="z-10">
    <!-- borders -->
    <div class="absolute -top-1 -left-1 -rotate-90 -z-10">
      <IconBorderEffect />
    </div>
    <div class="absolute -top-1 -right-1 rotate">
      <IconBorderEffect />
    </div>
    <div class="absolute -bottom-1 -left-1 rotate-180">
      <IconBorderEffect />
    </div>
    <div class="absolute -bottom-1 -right-1 rotate-90">
      <IconBorderEffect />
    </div>
  </div>
</template>
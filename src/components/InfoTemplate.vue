<script setup>
import { vScrollReveal } from 'vue-scroll-reveal';
</script>

<template>
  <div>
    <div class="text-sm font-light text-[#f3f3f3]" v-scroll-reveal="{ delay:200, scale: 1, distance: '10px'}">
      <slot name="title"></slot>
    </div>
    <div class="text-xl font-normal text-LittleDetail" v-scroll-reveal="{ delay:400, scale: 1, distance: '10px'}">
      <slot name="text"></slot>
    </div>
  </div>
</template>
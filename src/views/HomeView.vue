<script setup>
import BorderEffect from "@/components/BorderEffect.vue";

// import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <div class="relative flex flex-col justify-center items-center gap-4 p-2 text-[#ffffff] lg:border lg:border-borderColor bg-containerColor w-full">
    <div class="flex w-40 bg-LittleDetail h-96">teste</div>
    <div class="flex w-40 bg-LittleDetail h-96">teste</div>
    <div class="flex w-40 bg-LittleDetail h-96">teste</div>
    <div class="hidden lg:flex">
      <BorderEffect />
    </div>
  </div>
  <!-- <TheWelcome /> -->
  <!-- <div class="flex w-20 h-72 bg-containerColor">teste</div> -->
  <!-- <div class="flex w-20 h-96 bg-containerColor">teste</div> -->
</template>

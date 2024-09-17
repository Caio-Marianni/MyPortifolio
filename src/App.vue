<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <!-- Navbar -->
  <header>
     <Navbar />
  </header>
  <!-- Content  -->
  <RouterView />
</template>

<!-- Add the pathj to the navigation item -->
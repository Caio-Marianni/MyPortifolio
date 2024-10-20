<script setup>
</script>

<template>
  <div>
    <div class="text-sm font-semibold text-LittleDetail">
      <slot name="title"></slot>
    </div>
    <div class="text-xl font-normal text-[#fff]">
      <slot name="text"></slot>
    </div>
  </div>
</template>
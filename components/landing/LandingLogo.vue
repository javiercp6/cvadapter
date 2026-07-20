<script lang="ts" setup>
const localePath = useLocalePath()
</script>

<template>

    <NuxtLink
      :to="localePath('/')"
      class=""
      active-class="bg-none"
    >
      <!-- <span
        class="text-transparent bg-gradient-to-br from-violet-800 to-fuchsia-700 bg-clip-text hover:opacity-80"
      >
        AdapterCV
      </span> -->
      <img src="/logo.png" alt="AdapterCV Logo">
    </NuxtLink>

</template>

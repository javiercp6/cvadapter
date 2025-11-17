<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

// La lógica de JavaScript no cambia, es independiente del tema visual.
const isDropdownOpen = ref(false)
const dropdownContainer = ref(null)

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function handleClickOutside(event) {
  if (isDropdownOpen.value && !dropdownContainer.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <!-- Contenedor relativo para el menú -->
  <div ref="dropdownContainer" class="relative">
    <!-- Botón del avatar que abre/cierra el menú -->
    <!-- <img
      type="button"
      class="w-10 h-10 rounded-full cursor-pointer"
      src="/cv-screenshot-one-col-eliot.png"
      alt="User dropdown"
      @click.stop="toggleDropdown"
    > -->

    <div class="relative cursor-pointer inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600" @click.stop="toggleDropdown">
      <span class="font-medium text-gray-600 dark:text-gray-300">JL</span>
    </div>

    <!--
      Menú desplegable.
      Se han eliminado todas las clases como 'dark:bg-gray-700', 'dark:text-white', etc.
    -->
    <div
      v-show="isDropdownOpen"
      class="absolute right-0 mt-2 z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
    >
      <div class="px-4 py-3 text-sm text-gray-900">
        <div>Bonnie Green</div>
        <div class="font-medium truncate">
          name@flowbite.com
        </div>
      </div>
      <ul class="py-2 text-sm text-gray-700">
        <li @click="isDropdownOpen = false">
          <a href="#" class="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
        </li>
        <li @click="isDropdownOpen = false">
          <a href="#" class="block px-4 py-2 hover:bg-gray-100">Settings</a>
        </li>
        <li @click="isDropdownOpen = false">
          <a href="#" class="block px-4 py-2 hover:bg-gray-100">Earnings</a>
        </li>
      </ul>
      <div class="py-1" @click="isDropdownOpen = false">
        <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
      </div>
    </div>
  </div>
</template>

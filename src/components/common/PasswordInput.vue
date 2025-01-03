<template>
  <div>
    <div class="relative max-w mt-2">
      <button
        @click="togglePasswordVisibility"
        type="button"
        class="text-gray-800 dark:text-gray-100 absolute right-3 inset-y-2 my-auto active:text-gray-800 dark:active:text-gray-100"
      >
        <template v-if="isPasswordHidden">
          <ion-icon name="eye-outline"></ion-icon>
        </template>
        <template v-else>
          <ion-icon name="eye-off-outline"></ion-icon>
        </template>
      </button>
      <input
        :type="isPasswordHidden ? 'password' : 'text'"
        v-model="modelValue"
        :placeholder="placeholder"
        class="w-full pr-12 pl-3 py-2 text-gray-800 dark:lg:text-black dark:text-white bg-transparent outline-none border border-black dark:border-gray-700 shadow-sm dark:shadow-none rounded-lg"
        required
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { defineModel } from 'vue';

const modelValue = defineModel({
  type: String,
  required: true,
});

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Enter your password'
  }
});

const isPasswordHidden = ref(true);

const togglePasswordVisibility = () => {
  isPasswordHidden.value = !isPasswordHidden.value;
};
</script>

<style scoped>
ion-icon {
  font-size: 24px;
}
</style>
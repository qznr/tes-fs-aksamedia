<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <TextInput
        id="username"
        label="Username"
        placeholder="Masukkan username"
        v-model="username"
        class="dark:lg:bg-transparent lg:bg-transparent dark:bg-dark-bg bg-white dark:text-white dark:lg:text-black dark:border-gray-700 dark:shadow-none"
      />
    </div>
    <div>
      <PasswordInput
        id="password"
        label="Password"
        placeholder="Masukkan password"
        v-model="password"
        class="dark:lg:bg-transparent lg:bg-transparent dark:bg-dark-bg bg-white dark:text-white dark:lg:text-black dark:border-gray-700 dark:shadow-none"
      />
    </div>
    <button
      type="submit"
      class="w-full text-white dark:lg:bg-black lg:bg-black dark:bg-white bg-black skew-x-[-20deg] hover:bg-opacity-65 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
    >
      <div class="skew-x-[20deg] dark:lg:text-white lg:text-white dark:text-black">Login</div>
    </button>
  </form>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import TextInput from '../common/TextInput.vue';
import PasswordInput from '../common/PasswordInput.vue';

const emit = defineEmits(['submit']);

const username = ref('');
const password = ref('');

const handleSubmit = () => {
  emit('submit', { username: username.value, password: password.value });
};
</script>
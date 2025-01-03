<script setup>
import { onMounted, ref } from 'vue';

const model = defineModel({
  type: String,
  required: true,
});

const input = ref(null);

onMounted(() => {
  if (input.value.hasAttribute('autofocus')) {
      input.value.focus();
  }
});

defineExpose({ focus: () => input.value.focus() });
</script>

<template>
  <input
    class="block w-full px-3 py-2 text-gray-800 bg-transparent outline-none border border-black shadow-sm rounded-lg"
    v-model="model"
    ref="input"
    placeholder=""
  />
</template>
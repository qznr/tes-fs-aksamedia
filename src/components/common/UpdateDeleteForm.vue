<template>
  <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:shadow-none">
    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">
      <slot name="title">Edit Item</slot>
    </h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <slot :form="form" :updateField="updateField"></slot>
      <div class="flex justify-between">
        <button type="button" @click="handleDelete"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <slot name="deleteButtonText">Delete</slot>
        </button>
        <button type="submit"
          class="bg-primary hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          <slot name="updateButtonText">Update</slot>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, defineEmits, defineProps, watch } from 'vue';

const props = defineProps({
  initialFormState: {
    type: Object,
    required: true
  },
  onSubmit: {
    type: Function,
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['update', 'delete']);

const form = reactive({ ...props.initialFormState });

watch(() => props.initialFormState, (newFormState) => {
  Object.assign(form, JSON.parse(JSON.stringify(newFormState))); // Deep copy to maintain reactivity
}, { deep: true });

const updateField = (field, value) => {
  if (typeof field === 'string') {
    if (field.includes('.')) {
      const keys = field.split('.');
      let current = form;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    } else {
      form[field] = value;
    }
  }
};

const handleSubmit = () => {
  props.onSubmit({ ...form });
};

const handleDelete = () => {
  props.onDelete(form.id);
};
</script>
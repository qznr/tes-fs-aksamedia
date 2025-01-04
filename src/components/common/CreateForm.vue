<template>
  <div class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:shadow-none">
    <h3 class="text-lg font-semibold mb-2 dark:text-white text-gray-900">
      <slot name="title">Add Item</slot>
    </h3>
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <slot :form="form" :updateField="updateField"></slot>

      <div class="flex justify-end">
        <button
          type="submit"
          class="bg-primary hover:bg-opacity-70 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          <slot name="submitButtonText">Submit</slot>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, defineEmits, defineProps } from 'vue';

const props = defineProps({
  initialFormState: {
    type: Object,
    required: true,
  },
  onSubmit: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['create']);

const form = reactive({ ...props.initialFormState });

const updateField = (field, value) => {
  if (typeof field === 'string') {
        if (field.includes('.')) {
            // Handle nested properties
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
  Object.assign(form, props.initialFormState);
};
</script>
<template>
  <UpdateDeleteForm :initialFormState="employeeFormInitialState" :onSubmit="handleUpdate" :onDelete="handleDelete">
    <template #title>
      Edit Employee
    </template>

    <template v-slot="{ form, updateField }">
      <!-- Tablet Form Fields -->
      <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              for="image"
              class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >Image URL</label
            >
            <input
              type="text"
              id="image"
              :value="form.image"
              @input="updateField('image', $event.target.value)"
              placeholder="https://i.pravatar.cc/100"
              class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label
              for="name"
              class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >Name</label
            >
            <input
              type="text"
              id="name"
              :value="form.name"
              @input="updateField('name', $event.target.value)"
              placeholder="John Doe"
              class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        <div>
          <label for="phone" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
          <input type="tel" id="phone" :value="form.phone" @input="updateField('phone', $event.target.value)" placeholder="123-456-7890" class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
          <div>
            <label
              for="division"
              class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >Division</label
            >
            <select
              id="division"
              :value="form.division.name"
              @input="updateField('division.name', $event.target.value)"
              class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option
                v-for="division in divisionOptions"
                :key="division"
                :value="division"
                >{{ division }}</option
              >
            </select>
          </div>
       </div>
         <div>
          <label
            for="position"
            class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >Position</label
          >
          <input
            type="text"
            id="position"
            :value="form.position"
            @input="updateField('position', $event.target.value)"
            placeholder="Software Engineer"
            class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
    </template>

    <template #updateButtonText>
      Update
    </template>

    <template #deleteButtonText>
      Delete
    </template>
  </UpdateDeleteForm>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import UpdateDeleteForm from './common/UpdateDeleteForm.vue';

const props = defineProps({
  selectedEmployee: {
    type: Object,
    default: null
  },
  divisionOptions: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['update', 'delete']);

const employeeFormInitialState = computed(() => {
  return props.selectedEmployee ? { ...props.selectedEmployee } : {};
});

const handleUpdate = (formData) => {
  emit('update', formData);
};

const handleDelete = (id) => {
  emit('delete', id);
};
</script>
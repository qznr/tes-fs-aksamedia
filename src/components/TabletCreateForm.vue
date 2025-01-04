<template>
  <CreateForm
    :initialFormState="employeeFormInitialState"
    :onSubmit="handleCreate"
  >
    <template #title>
      Add Employee
    </template>

    <template v-slot="{ form, updateField }">
      <!-- Tablet Form Fields (adjust layout as needed) -->
       <div class="grid grid-cols-2 gap-4">
          <div>
             <label
              for="image"
              class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >Image</label
            >
            <input
              type="file"
              id="image"
              @change="handleImageChange($event, updateField)"
              accept="image/*"
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
              v-model="form.name"
              placeholder="John Doe"
              class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        <div>
          <label for="phone" class="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Phone</label>
          <input type="tel" id="phone" v-model="form.phone" placeholder="123-456-7890" class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600" />
        </div>
          <div>
            <label
              for="division"
              class="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >Division</label
            >
            <select
              id="division"
              v-model="form.division"
              class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
            >
              <option
                v-for="division in divisionOptions"
                :key="division.id"
                :value="division.id"
                >{{ division.name }}</option
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
            v-model="form.position"
            placeholder="Software Engineer"
            class="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
    </template>

    <template #submitButtonText>
      Add
    </template>
  </CreateForm>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';
import CreateForm from './common/CreateForm.vue';
import { ref } from 'vue';

const props = defineProps({
    divisionOptions: {
        type: Array,
        required: true,
         default: () => []
    }
})

const emit = defineEmits(['create']);

const employeeFormInitialState = ref({
  image: null,
  name: '',
  phone: '',
  division: props.divisionOptions[0]?.id || null,
  position: '',
});

const handleImageChange = (event, updateField) => {
    const file = event.target.files[0];
    updateField('image', file);
};

const handleCreate = (formData) => {
  emit('create', formData);
};
</script>
<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <div
      class="flex-grow flex p-4 dark:bg-dark-bg dots"
      :class="{ 'flex-col': isMobile }"
    >
      <!-- Mobile -->
      <template v-if="isMobile">
        <div class="w-full p-4">
          <MobileCreateForm @create="createEmployee" :divisionOptions="divisionOptions"/>
        </div>

        <div class="w-full p-4">
          <div
            class="bg-white rounded-lg shadow-md p-6 mb-4 dark:bg-gray-800 dark:shadow-none h-full flex flex-col"
          >
            <h2
              class="text-2xl font-bold mb-4 dark:text-white text-gray-900"
            >
              Employees
            </h2>
            <div class="rounded-lg overflow-hidden flex-grow">
              <StackedList
                :data="employees"
                :itemComponent="EmployeeItem"
                empty-message="No employees available."
                :searchable="true"
                :searchColumns="['name']"
                :filterable="true"
                :filterCategories="filterCategories"
                :searchQuery="sharedSearchQuery"
                :activeFilters="sharedActiveFilters"
                :currentPage="sharedCurrentPage"
                @update:searchQuery="setSharedSearchQuery"
                @update:activeFilters="setSharedActiveFilters"
                @update:currentPage="setSharedCurrentPage"
                :pageSize="sharedPageSize"
                :selectedItem="sharedSelectedItem"
                @update:selectedItem="setSharedSelectedItem"
              />
            </div>
          </div>
        </div>

        <div class="w-full p-4">
          <MobileUpdateDeleteForm
            :selectedEmployee="sharedSelectedItem"
            :divisionOptions="divisionOptions"
            @update="updateEmployee"
            @delete="deleteEmployee"
          />
        </div>
      </template>

      <!-- Tablet -->
      <template v-else-if="isTablet">
        <div class="w-1/2 p-4">
          <div
            class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:shadow-none h-full flex flex-col"
          >
            <h2
              class="text-2xl font-bold mb-4 dark:text-white text-gray-900"
            >
              Employees
            </h2>
            <div class="rounded-lg overflow-hidden flex-grow">
              <StackedList
                :data="employees"
                :itemComponent="EmployeeItem"
                empty-message="No employees available."
                :searchable="true"
                :searchColumns="['name']"
                :filterable="true"
                :filterCategories="filterCategories"
                :searchQuery="sharedSearchQuery"
                :activeFilters="sharedActiveFilters"
                :currentPage="sharedCurrentPage"
                @update:searchQuery="setSharedSearchQuery"
                @update:activeFilters="setSharedActiveFilters"
                @update:currentPage="setSharedCurrentPage"
                :pageSize="sharedPageSize"
                :selectedItem="sharedSelectedItem"
                @update:selectedItem="setSharedSelectedItem"
              />
            </div>
          </div>
        </div>
        <div class="w-1/2 flex flex-col p-4 space-y-4">
          <!-- Top Right -->
          <div class="w-full p-4">
            <TabletCreateForm @create="createEmployee" :divisionOptions="divisionOptions"/>
          </div>
          <!-- Bot Right -->
          <div class="w-full p-4">
            <TabletUpdateDeleteForm
              :selectedEmployee="sharedSelectedItem"
              :divisionOptions="divisionOptions"
              @update="updateEmployee"
              @delete="deleteEmployee"
            />
          </div>
        </div>
      </template>

      <!-- Desktop -->
      <template v-else>
        <div class="w-1/2 p-4">
          <div
            class="bg-white rounded-lg shadow-md p-6 dark:bg-gray-800 dark:shadow-none h-full flex flex-col"
          >
            <h2
              class="text-2xl font-bold mb-4 dark:text-white text-gray-900"
            >
              Employees
            </h2>
            <div class="rounded-lg overflow-hidden flex-grow">
              <DataTable
                :data="employees"
                :columns="columns"
                :searchColumns="['name']"
                :filterableColumns="['division']"
                :filterCategories="filterCategories"
                :searchQuery="sharedSearchQuery"
                :activeFilters="sharedActiveFilters"
                :currentPage="sharedCurrentPage"
                @update:searchQuery="setSharedSearchQuery"
                @update:activeFilters="setSharedActiveFilters"
                @update:currentPage="setSharedCurrentPage"
                :pageSize="sharedPageSize"
                :selectedItem="sharedSelectedItem"
                @update:selectedItem="setSharedSelectedItem"
              >
                <template #image="{ item }">
                  <img
                    :src="item.image"
                    alt="Employee Image"
                    class="w-10 h-10 rounded-full"
                  />
                </template>
                <template #name="{ item }">
                  {{ item.name }}
                </template>
                <template #phone="{ item }">
                  {{ item.phone }}
                </template>
                <template #division="{ item }">
                  {{ item.division.name }}
                </template>
                <template #position="{ item }">
                  {{ item.position }}
                </template>
              </DataTable>
            </div>
          </div>
        </div>
        <div class="w-1/2 flex flex-col space-y-4">
          <!-- Top Right -->
          <div class="w-full p-4">
            <DesktopCreateForm @create="createEmployee" :divisionOptions="divisionOptions"/>
          </div>
          <!-- Bot Right -->
          <div class="w-full p-4">
            <DesktopUpdateDeleteForm
              :selectedEmployee="sharedSelectedItem"
              :divisionOptions="divisionOptions"
              @update="updateEmployee"
              @delete="deleteEmployee"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, watch, computed } from 'vue';
import Navbar from '../components/layout/Navbar.vue';
import DataTable from '../components/common/DataTable.vue';
import StackedList from '../components/common/StackedList.vue';
import EmployeeItem from '../components/EmployeeItem.vue';
import DesktopCreateForm from '../components/DesktopCreateForm.vue';
import TabletCreateForm from '../components/TabletCreateForm.vue';
import MobileCreateForm from '../components/MobileCreateForm.vue';
import DesktopUpdateDeleteForm from '../components/DesktopUpdateDeleteForm.vue';
import TabletUpdateDeleteForm from '../components/TabletUpdateDeleteForm.vue';
import MobileUpdateDeleteForm from '../components/MobileUpdateDeleteForm.vue';
import employeesData from '../assets/employees.json';
import { useLocalStorage } from '../services/localStorageService';

const { getItem, setItem } = useLocalStorage();

const isMobile = ref(window.innerWidth < 1024);
const isTablet = ref(window.innerWidth >= 1024 && window.innerWidth < 1636);

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024;
  isTablet.value = window.innerWidth >= 1024 && window.innerWidth < 1636
};

onMounted(() => {
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});

const columns = ref([
  { label: 'Image', key: 'image' },
  { label: 'Name', key: 'name' },
  { label: 'Phone', key: 'phone' },
  { label: 'Division', key: 'division' },
  { label: 'Position', key: 'position' },
]);

const divisionOptions = ['Mobile Apps', 'QA', 'Full Stack', 'Backend', 'Frontend', 'UI/UX Designer'];

const filterCategories = {
  division: {
    categories: divisionOptions,
    key: 'division.name'
  },
};

// Shared State (using reactive for easier updates)
const sharedState = reactive({
  searchQuery: '',
  activeFilters: [],
  currentPage: 1,
  pageSize: 7,
  selectedItem: null
});

// Separate employees state
const employees = ref([]);

// Load initial state from localStorage or use default values
const storedState = getItem('crudState');
const storedEmployees = getItem('employees');

if (storedEmployees) {
    employees.value = storedEmployees;
} else {
    employees.value = employeesData;
}

if (storedState) {
  Object.assign(sharedState, storedState);
}

// Set the default selected item if it doesn't exist
if (!sharedState.selectedItem && employees.value.length > 0) {
  sharedState.selectedItem = employees.value[0];
}

// Watch for changes in sharedState and update localStorage
watch(sharedState, (newSharedState) => {
    setItem('crudState', newSharedState);
}, { deep: true });

watch(employees, (newEmployees) => {
    setItem('employees', newEmployees);
}, { deep: true });

// Expose shared state variables and update functions to the template
const sharedSearchQuery = computed(() => sharedState.searchQuery);
const sharedActiveFilters = computed(() => sharedState.activeFilters);
const sharedCurrentPage = computed(() => sharedState.currentPage);
const sharedPageSize = computed(() => sharedState.pageSize);
const sharedSelectedItem = computed(() => sharedState.selectedItem)

const setSharedSearchQuery = (value) => {
  console.log('Setting shared search query:', value);
  sharedState.searchQuery = value;
  sharedState.currentPage = 1; // Reset to page 1 when search query changes
};

const setSharedActiveFilters = (value) => {
  console.log('Setting shared active filters:', value);
  sharedState.activeFilters = value;
  sharedState.currentPage = 1; // Reset to page 1 when filters change
};

const setSharedCurrentPage = (value) => {
  console.log('Setting shared current page:', value);
  sharedState.currentPage = value;
};

const setSharedSelectedItem = (item) => {
  console.log('Setting shared selected item:', item);
  sharedState.selectedItem = item ? { ...item } : null; // maintain reactivity for UpdateDeleteForm
}

const createEmployee = (newEmployee) => {
  console.log('Creating employee:', newEmployee);
  employees.value.push(newEmployee);
  sharedState.selectedItem = newEmployee; // set sharedState after creating
};

const updateEmployee = (updatedEmployee) => {
  console.log('Updating employee:', updatedEmployee);
  const index = employees.value.findIndex((e) => e.id === updatedEmployee.id);
  if (index !== -1) {
    employees.value.splice(index, 1, updatedEmployee);
    sharedState.selectedItem = updatedEmployee; // update sharedState
  }
};

const deleteEmployee = (employeeId) => {
  console.log('Deleting employee with ID:', employeeId);
  employees.value = employees.value.filter((e) => e.id !== employeeId);
  sharedState.selectedItem = null; // reset sharedState
};
</script>
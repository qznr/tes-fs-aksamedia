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
              <MobileCreateForm @create="createEmployee" :divisionOptions="divisionOptions" />
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
                ref="mobileStackedList"
                :fetchData="getEmployees"
                :itemComponent="EmployeeItem"
                empty-message="No employees available."
                :searchable="true"
                :searchColumns="['name']"
                :filterable="true"
                :filterCategories="{ 'division': divisions.map(division => ({ id: division.id, name: division.name })) }"
                :searchQuery="sharedSearchQuery"
                :activeFilters="sharedActiveFilters"
                :currentPage="sharedCurrentPage"
                @update:searchQuery="setSharedSearchQuery"
                @update:activeFilters="setSharedActiveFilters"
                @update:currentPage="setSharedCurrentPage"
                :selectedItem="sharedSelectedItem"
                @update:selectedItem="setSharedSelectedItem"
              />
            </div>
          </div>
        </div>
          <div class="w-full p-4">
            <MobileUpdateDeleteForm
                v-if="sharedSelectedItem"
                :selectedEmployee="sharedSelectedItem"
                :divisionOptions="divisionOptions"
                @update="updateEmployee"
                @delete="deleteEmployee"
                @update:imageChanged="handleImageChange"
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
                  ref="tabletStackedList"
                :fetchData="getEmployees"
                :itemComponent="EmployeeItem"
                empty-message="No employees available."
                :searchable="true"
                :searchColumns="['name']"
                :filterable="true"
                :filterCategories="{ 'division': divisions.map(division => ({ id: division.id, name: division.name })) }"
                :searchQuery="sharedSearchQuery"
                :activeFilters="sharedActiveFilters"
                :currentPage="sharedCurrentPage"
                @update:searchQuery="setSharedSearchQuery"
                @update:activeFilters="setSharedActiveFilters"
                @update:currentPage="setSharedCurrentPage"
                 :selectedItem="sharedSelectedItem"
                 @update:selectedItem="setSharedSelectedItem"
              />
            </div>
          </div>
        </div>
          <div class="w-1/2 flex flex-col p-4 space-y-4">
              <!-- Top Right -->
              <div class="w-full p-4">
                  <TabletCreateForm @create="createEmployee" :divisionOptions="divisionOptions" />
              </div>
              <!-- Bot Right -->
              <div class="w-full p-4">
                  <TabletUpdateDeleteForm
                      v-if="sharedSelectedItem"
                      :selectedEmployee="sharedSelectedItem"
                      :divisionOptions="divisionOptions"
                      @update="updateEmployee"
                      @delete="deleteEmployee"
                      @update:imageChanged="handleImageChange"
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
               ref="desktopDataTable"
                :fetchData="getEmployees"
                :columns="columns"
                :searchColumns="['name']"
                 :filterableColumns="['division']"
                 :filterCategories="{ 'division': divisions.map(division => ({ id: division.id, name: division.name })) }"
                :searchQuery="sharedSearchQuery"
                :activeFilters="sharedActiveFilters"
                :currentPage="sharedCurrentPage"
                @update:searchQuery="setSharedSearchQuery"
                @update:activeFilters="setSharedActiveFilters"
                @update:currentPage="setSharedCurrentPage"
                 :selectedItem="sharedSelectedItem"
                @update:selectedItem="setSharedSelectedItem"
              >
                <template #image="{ item }">
                  <img v-if="formatImageUrl(item.image)"
                    :src="formatImageUrl(item.image)"
                    alt="Employee Image"
                    class="w-10 h-10 rounded-full"
                  />
                  <ion-icon v-else name="person-circle-outline" class="w-10 h-10 text-gray-400 mr-3"></ion-icon>

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
            <DesktopCreateForm @create="createEmployee" :divisionOptions="divisionOptions" />
          </div>
          <!-- Bot Right -->
          <div class="w-full p-4">
           <DesktopUpdateDeleteForm
              v-if="sharedSelectedItem"
              :selectedEmployee="sharedSelectedItem"
              :divisionOptions="divisionOptions"
              @update="updateEmployee"
              @delete="deleteEmployee"
              @update:imageChanged="handleImageChange"
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
import { useLocalStorage } from '../services/localStorageService';
import apiService from '../services/apiService';

const { getItem, setItem } = useLocalStorage();

const isMobile = ref(window.innerWidth < 1024);
const isTablet = ref(window.innerWidth >= 1024 && window.innerWidth < 1636);

const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 1024;
    isTablet.value = window.innerWidth >= 1024 && window.innerWidth < 1636
};

onMounted(() => {
    window.addEventListener('resize', checkScreenSize);
    fetchDivisions();
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

const divisionOptions = ref([]);
const divisions = ref([]);
const desktopDataTable = ref(null);
const mobileStackedList = ref(null);
const tabletStackedList = ref(null)

const fetchDivisions = async () => {
    try {
        const response = await apiService.getDivisions();
        divisions.value = response.data.divisions;
        divisionOptions.value = divisions.value.map(division => ({id: division.id, name: division.name}));
    } catch (error) {
        console.error('Error fetching divisions:', error);
    }
};

// Shared State (using reactive for easier updates)
const sharedState = reactive({
    searchQuery: '',
    activeFilters: [],
    currentPage: 1,
    pageSize: 7,
    selectedItem: null,
    initialLoad: true,
    imageChanged: false,
});

// Load initial state from localStorage or use default values
const storedState = getItem('crudState');

if (storedState) {
    Object.assign(sharedState, storedState);
}

// Watch for changes in sharedState and update localStorage
watch(sharedState, (newSharedState) => {
    setItem('crudState', newSharedState);
}, { deep: true });


// Expose shared state variables and update functions to the template
const sharedSearchQuery = computed(() => sharedState.searchQuery);
const sharedActiveFilters = computed(() => sharedState.activeFilters);
const sharedCurrentPage = computed(() => sharedState.currentPage);
const sharedSelectedItem = computed(() => sharedState.selectedItem)

const setSharedSearchQuery = (value) => {
    console.log('Setting shared search query:', value);
    sharedState.searchQuery = value;
};

const setSharedActiveFilters = (value) => {
    console.log('Setting shared active filters:', value);
    sharedState.activeFilters = value;
};

const setSharedCurrentPage = (value) => {
    console.log('Setting shared current page:', value);
    sharedState.currentPage = value;
};

const setSharedSelectedItem = (item) => {
  console.log('Setting shared selected item:', item);
  sharedState.selectedItem = item ? { ...item } : null; // maintain reactivity for UpdateDeleteForm
    sharedState.imageChanged = false;
}

const getEmployees = async (params) => {
    try {
        const response = await apiService.getEmployees(params);
        if (sharedState.initialLoad && response.data.employees.length > 0) {
            sharedState.selectedItem = response.data.employees[0];
            sharedState.initialLoad = false;
        }
        return response;
    } catch (error) {
        console.error('Error fetching employees:', error);
        return { data: { employees: [] }, pagination: {} }; // Return empty data and pagination on error
    }
};

const createEmployee = async (newEmployee) => {
    console.log('Creating employee:', newEmployee);
    const formData = new FormData();

    if (newEmployee.image) {
        formData.append('image', newEmployee.image);
    }
    formData.append('name', newEmployee.name);
    formData.append('phone', newEmployee.phone);
    formData.append('division_id', newEmployee.division);
    formData.append('position', newEmployee.position);

    try {
      const response = await apiService.createEmployee(formData);
      sharedState.selectedItem = newEmployee;
        if (isMobile.value && mobileStackedList.value) {
          mobileStackedList.value.refetch();
        } else if (isTablet.value && tabletStackedList.value) {
          tabletStackedList.value.refetch();
        } else if (desktopDataTable.value) {
          desktopDataTable.value.refetch();
        }
    } catch (error) {
        console.error('Error creating employee:', error);
    }
};

const updateEmployee = async (updatedEmployee) => {
    console.log('Updating employee:', updatedEmployee);

    const formData = new FormData();
    if (sharedState.imageChanged && updatedEmployee.image) {
        formData.append('image', updatedEmployee.image);
    }
    formData.append('name', updatedEmployee.name);
    formData.append('phone', updatedEmployee.phone);
    formData.append('division_id', updatedEmployee.division);
    formData.append('position', updatedEmployee.position);
    try {
        const response = await apiService.updateEmployee(updatedEmployee.id, formData);
        sharedState.selectedItem = null;
        if (isMobile.value && mobileStackedList.value) {
          mobileStackedList.value.refetch();
        } else if (isTablet.value && tabletStackedList.value) {
          tabletStackedList.value.refetch();
        } else if (desktopDataTable.value) {
            desktopDataTable.value.refetch();
        }
    } catch (error) {
        console.error('Error updating employee:', error);
    }
};

const deleteEmployee = async (employeeId) => {
  console.log('Deleting employee with ID:', employeeId);
    try {
      await apiService.deleteEmployee(employeeId);
      sharedState.selectedItem = null;
        if (isMobile.value && mobileStackedList.value) {
            mobileStackedList.value.refetch();
        } else if (isTablet.value && tabletStackedList.value) {
          tabletStackedList.value.refetch();
        } else if (desktopDataTable.value) {
           desktopDataTable.value.refetch();
        }
    } catch (error) {
        console.error('Error deleting employee:', error);
    }
};

const handleImageChange = (value) => {
    console.log('Image Changed')
    sharedState.imageChanged = value
}

const formatImageUrl = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('/storage')) {
        return `${import.meta.env.VITE_API_BASE_URL}${imageUrl}`;
    }
    return imageUrl;
};
</script>
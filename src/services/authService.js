import { computed } from 'vue';
import { useLocalStorage } from './localStorageService';
import apiService from './apiService';
import { useRouter } from 'vue-router';

export const useAuth = () => {
    const { setItem, getItem, removeItem } = useLocalStorage();
    const isAuthenticated = computed(() => !!getItem('token'));
    const router = useRouter();

    const login = async (username, password) => {
        try {
            const response = await apiService.login({ username, password });
            console.log(response)
            setItem('token', response.data.token);
            setItem('user', response.data.admin);
            isAuthenticated.value = true;
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            let errorMessage = 'Login failed'; // Default error message
            
            // Check if error.response exists and has data
            if (error.message) {
                errorMessage = error.message;
            } else {
                // Handle network or other errors
                errorMessage = 'Network error or server not responding.';
            }

            return { success: false, error: errorMessage }; // Return error details
        }
    };

    const logout = async () => {
        try {
            await apiService.logout(); // Call the logout API
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            removeItem('token');
            removeItem('user');
            isAuthenticated.value = false;
            router.push('/').then(() => {
                window.location.reload();
              });
        }
    };

    return { isAuthenticated, login, logout };
};
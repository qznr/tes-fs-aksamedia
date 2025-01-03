// src/services/authService.js
import { ref } from 'vue';
import { useLocalStorage } from './localStorageService';
import ApiService from './ApiService';
import { useRouter } from 'vue-router';

export const useAuth = () => {
    const { setItem, getItem, removeItem } = useLocalStorage();
    const isAuthenticated = ref(!!getItem('token'));
    const router = useRouter();

    const login = async (username, password) => {
        try {
            const response = await ApiService.login({ username, password });
            console.log(response)
            setItem('token', response.data.token);
            setItem('user', response.data.admin);
            isAuthenticated.value = true;
            router.push('/');
        } catch (error) {
            console.error('Login failed:', error);
            let errorMessage = 'Login failed'; // Default error message

            // Check if error.response exists and has data
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else {
                    errorMessage = 'An error occurred during login.';
                }
            } else {
                // Handle network or other errors
                errorMessage = 'Network error or server not responding.';
            }

            return { success: false, error: errorMessage }; // Return error details
        }
    };

    const logout = async () => {
        try {
            await ApiService.logout(); // Call the logout API
        } catch (error) {
            console.error('Logout failed:', error);
            // Handle logout error if necessary
        } finally {
            // Clear local storage regardless of API call success
            removeItem('token');
            removeItem('user');
            isAuthenticated.value = false;
            router.push('/');
        }
    };

    return { isAuthenticated, login, logout };
};
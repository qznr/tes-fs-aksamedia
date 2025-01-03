import { ref } from 'vue';
import { useLocalStorage } from './localStorageService';
import { useRouter } from 'vue-router';

export const useAuth = () => {
  const { setItem, getItem, removeItem } = useLocalStorage();
  const router = useRouter();
  const isAuthenticated = ref(!!getItem('user'));

  const login = (username, password) => {
    if (username === import.meta.env.VITE_USERNAME && password === import.meta.env.VITE_PASSWORD) {
      const user = { username: username, fullName: '' };
      setItem('user', user);
      isAuthenticated.value = true;
      router.push('/');
    } else {
      alert('Login gagal');
    }
  };

  const logout = () => {
    removeItem('user');
    isAuthenticated.value = false;
    router.push('/login');
  };

  return { isAuthenticated, login, logout };
};
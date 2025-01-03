export const useLocalStorage = () => {
  const setItem = (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error serializing and saving to localStorage:', error);
    }
  };

  const getItem = (key) => {
    try {
      const item = localStorage.getItem(key);
      if (!item) {
        console.log("no item found")
      }
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error parsing from localStorage:', error);
      return null;
    }
  };

  const removeItem = (key) => {
    localStorage.removeItem(key);
  };

  const clear = () => {
    localStorage.clear();
  };

  return { setItem, getItem, removeItem, clear };
};

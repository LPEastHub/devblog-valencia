import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
    // State
    const token = ref(localStorage.getItem('token') || null);
    
    // 🛡️ Safely parse user data from local storage so it survives page refreshes
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);

    // Getters
    const isAuthenticated = computed(() => token.value !== null);
    
    // Optional helper to quickly check admin status globally
    const isAdmin = computed(() => user.value?.isAdmin || false);

    // Actions
    function setToken(newToken) {
        token.value = newToken;
        localStorage.setItem('token', newToken);
    }

    function setUserDetails(userData) {
        user.value = userData;
        // Save user data to storage so they don't lose admin/author rights on refresh
        localStorage.setItem('user', JSON.stringify(userData));
    }

    function clearAuth() {
        token.value = null;
        user.value = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    return {
        token,
        user, // Exported as 'user' to match component logic exactly
        isAuthenticated,
        isAdmin,
        setToken,
        setUserDetails,
        clearAuth
    };
});
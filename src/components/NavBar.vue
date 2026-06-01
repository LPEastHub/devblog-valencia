<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
    <div class="container">
      <router-link to="/" class="navbar-brand fw-bold fs-4 text-white" @click="closeMenu">
        🚀 My Blog
      </router-link>

      <button 
        class="navbar-toggler border-0 shadow-none" 
        type="button" 
        @click="toggleMenu"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="['collapse navbar-collapse', { show: isMenuOpen }]">
        <ul class="navbar-nav ms-auto align-items-center gap-2 mt-3 mt-lg-0">
          
          <li class="nav-item">
            <router-link to="/" class="nav-link px-3" @click="closeMenu">
              Home
            </router-link>
          </li>

          <template v-if="userStore.isAuthenticated">
            <li class="nav-item">
              <span class="nav-link text-warning px-3 small fw-semibold">
                👤 {{ userStore.user?.username || 'User' }} {{ userStore.isAdmin ? '(Admin)' : '' }}
              </span>
            </li>
            
            <li class="nav-item w-100 w-lg-auto text-center">
              <button 
                @click="handleLogout" 
                class="btn btn-outline-danger btn-sm rounded-pill px-4 fw-semibold mt-2 mt-lg-0"
              >
                Logout
              </button>
            </li>
          </template>

          <template v-else>
            <li class="nav-item w-100 w-lg-auto text-center">
              <router-link 
                to="/login" 
                class="nav-link px-3" 
                @click="closeMenu"
              >
                Login
              </router-link>
            </li>
            
            <li class="nav-item w-100 w-lg-auto text-center">
              <router-link 
                to="/register" 
                class="btn btn-primary btn-sm rounded-pill px-4 fw-semibold mt-2 mt-lg-0" 
                @click="closeMenu"
              >
                Register
              </router-link>
            </li>
          </template>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { toast } from 'vue3-toastify';

const router = useRouter();
const userStore = useUserStore();

// 🛠️ Mobile Menu Visibility State Controller
const isMenuOpen = ref(false);

// Flips the layout state back and forth (Open / Closed)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Explicitly forces the dropdown window to shut
const closeMenu = () => {
  isMenuOpen.value = false;
};

// Handles killing the current authentication session safely
const handleLogout = () => {
  closeMenu(); // Snaps the mobile window shut
  userStore.clearAuth(); // Wipes local storage & stores
  toast.success('Logged out successfully.');
  router.push('/login'); // Redirects to the login screening room
};
</script>

<style scoped>
/* Smooth sliding transitions when clicking the mobile menu toggle */
.collapse {
  transition: all 0.3s ease-in-out;
}

@media (max-width: 991.98px) {
  .navbar-nav {
    padding-top: 1rem;
    padding-bottom: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
    <div class="container">
      <router-link class="navbar-brand d-flex align-items-center" to="/">
        <span class="fs-4 fw-bold text-primary">🚀 Dev<span class="text-white">Blog</span></span>
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav" 
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link class="nav-link px-3" to="/">Home</router-link>
          </li>

          <template v-if="userStore.isAuthenticated">
            <li class="nav-item">
              <router-link class="nav-link px-3" to="/posts/create">Write Post</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link px-3" to="/profile">My Profile</router-link>
            </li>
            <li class="nav-item ms-lg-2">
              <button @click="handleLogout" class="btn btn-outline-danger btn-sm px-3 rounded-pill">
                Logout
              </button>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link class="nav-link px-3" to="/login">Login</router-link>
            </li>
            <li class="nav-item ms-lg-2">
              <router-link class="btn btn-primary btn-sm px-3 text-white rounded-pill" to="/register">
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
import { useUserStore } from '../stores/userStore';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.clearAuth();
  toast.info('Logged out successfully');
  router.push('/login');
};
</script>
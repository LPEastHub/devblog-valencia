<template>
  <div class="row justify-content-center align-items-center my-5">
    <div class="col-12 col-md-8 col-lg-5">
      <div class="card shadow border-0 p-4 rounded-4">
        <div class="card-body">
          <h2 class="text-center fw-bold mb-4 text-dark">Welcome Back</h2>
          <p class="text-muted text-center mb-4">Log in to manage your blog posts</p>

          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label for="email" class="form-label fw-semibold">Email Address</label>
              <input 
                v-model="email" 
                type="email" 
                id="email" 
                class="form-control form-control-lg" 
                placeholder="name@example.com" 
                required 
                :disabled="isLoading"
              />
            </div>

            <div class="mb-4">
              <label for="password" class="form-label fw-semibold">Password</label>
              <input 
                v-model="password" 
                type="password" 
                id="password" 
                class="form-control form-control-lg" 
                placeholder="••••••••" 
                required 
                :disabled="isLoading"
              />
            </div>

            <button 
              type="submit" 
              class="btn btn-primary btn-lg w-100 rounded-pill mb-3"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ isLoading ? 'Logging in...' : 'Sign In' }}
            </button>
          </form>

          <p class="text-center mb-0 mt-3 text-muted">
            Don't have an account yet? 
            <router-link to="/register" class="text-primary fw-semibold text-decoration-none">Register here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import api from '../api'; 
import { toast } from 'vue3-toastify';

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const router = useRouter();
const userStore = useUserStore();

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value
    });

    // 1. Save the token (the store handles localStorage internally)
    userStore.setToken(response.data.token);
    
    // 2. 📢 CRITICAL: Save the user object so Pinia knows about 'isAdmin'
    // This assumes your backend sends the user object in 'response.data.user'
    if (response.data.user) {
        userStore.setUserDetails(response.data.user);
    } else {
        // Fallback: If your backend sends it directly in the root of response.data
        userStore.setUserDetails({
            id: response.data.id || response.data._id,
            email: response.data.email,
            isAdmin: response.data.isAdmin
        });
    }
    
    toast.success('Welcome back!');
    router.push('/');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Invalid email or password.';
    toast.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};
</script>
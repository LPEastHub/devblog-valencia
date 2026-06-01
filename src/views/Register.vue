<template>
  <div class="row justify-content-center align-items-center my-5">
    <div class="col-12 col-md-8 col-lg-5">
      <div class="card shadow border-0 p-4 rounded-4">
        <div class="card-body">
          <h2 class="text-center fw-bold mb-4 text-dark">Create Account</h2>
          <p class="text-muted text-center mb-4">Join our developer community today</p>

          <form @submit.prevent="handleRegister">
            <div class="mb-3">
              <label for="reg-username" class="form-label fw-semibold">Username</label>
              <input 
                v-model="username" 
                type="text" 
                id="reg-username" 
                class="form-control form-control-lg" 
                placeholder="johndoe" 
                required 
                :disabled="isLoading"
              />
            </div>

            <div class="mb-3">
              <label for="reg-email" class="form-label fw-semibold">Email Address</label>
              <input 
                v-model="email" 
                type="email" 
                id="reg-email" 
                class="form-control form-control-lg" 
                placeholder="name@example.com" 
                required 
                :disabled="isLoading"
              />
            </div>

            <div class="mb-3">
              <label for="reg-password" class="form-label fw-semibold">Password</label>
              <input 
                v-model="password" 
                type="password" 
                id="reg-password" 
                class="form-control form-control-lg" 
                placeholder="Min 6 characters" 
                required 
                :disabled="isLoading"
              />
            </div>

            <div class="mb-4">
              <label for="confirm-password" class="form-label fw-semibold">Confirm Password</label>
              <input 
                v-model="confirmPassword" 
                type="password" 
                id="confirm-password" 
                class="form-control form-control-lg" 
                placeholder="Repeat your password" 
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
              {{ isLoading ? 'Creating account...' : 'Register' }}
            </button>
          </form>

          <p class="text-center mb-0 mt-3 text-muted">
            Already have an account? 
            <router-link to="/login" class="text-primary fw-semibold text-decoration-none">Sign In here</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { toast } from 'vue3-toastify';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    toast.error('Passwords do not match!');
    return;
  }

  isLoading.value = true;
  try {
    // 📢 CRITICAL: Ensure there is a leading slash before 'users/register'
    await api.post('/users/register', {
      username: username.value,
      email: email.value,
      password: password.value
    });

    toast.success('Registration successful! You can now log in.');
    router.push('/login');
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Registration failed.';
    toast.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};
</script>
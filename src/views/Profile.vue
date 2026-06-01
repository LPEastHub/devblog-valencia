<template>
  <div class="row justify-content-center align-items-center my-5">
    <div class="col-12 col-md-8 col-lg-6">
      <h2 class="fw-bold text-dark mb-4 text-center">My Profile</h2>

      <div class="card shadow-sm border-0 p-4 rounded-4">
        <div class="card-body">
          <h4 class="fw-semibold mb-3 border-bottom pb-2">Account Details</h4>
          
          <div class="mb-4">
            <p class="text-muted mb-1">Status</p>
            <p class="fw-bold text-success d-flex align-items-center">
              <span class="badge bg-success me-2">Active</span> 
              Logged in securely
            </p>
          </div>

          <h4 class="fw-semibold mb-3 border-bottom pb-2 mt-5">Update Password</h4>
          <p class="text-muted small mb-4">Secure your account by updating your password regularly.</p>

          <form @submit.prevent="handleUpdatePassword">
            <div class="mb-3">
              <label for="new-password" class="form-label fw-semibold">New Password</label>
              <input 
                v-model="newPassword" 
                type="password" 
                id="new-password" 
                class="form-control" 
                placeholder="Enter new password" 
                required 
                :disabled="isLoading"
              />
            </div>

            <div class="mb-4">
              <label for="confirm-password" class="form-label fw-semibold">Confirm New Password</label>
              <input 
                v-model="confirmPassword" 
                type="password" 
                id="confirm-password" 
                class="form-control" 
                placeholder="Repeat new password" 
                required 
                :disabled="isLoading"
              />
            </div>

            <button 
              type="submit" 
              class="btn btn-warning fw-semibold rounded-pill px-4"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              {{ isLoading ? 'Updating...' : 'Change Password' }}
            </button>
          </form>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api';
import { toast } from 'vue3-toastify';

const newPassword = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const handleUpdatePassword = async () => {
  // 1. Client-side validation
  if (newPassword.value !== confirmPassword.value) {
    toast.error('New passwords do not match!');
    return;
  }

  if (newPassword.value.length < 6) {
    toast.error('Password must be at least 6 characters long.');
    return;
  }

  isLoading.value = true;
  
  // 2. Send PUT request to our custom protected route
  try {
    const response = await api.put('/users/update-password', {
      newPassword: newPassword.value
    });

    toast.success(response.data.message || 'Password updated successfully!');
    
    // Clear the form fields after success
    newPassword.value = '';
    confirmPassword.value = '';
    
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to update password. Please try again.';
    toast.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};
</script>
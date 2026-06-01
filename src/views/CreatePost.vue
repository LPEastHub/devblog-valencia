<template>
  <div class="row justify-content-center my-5">
    <div class="col-12 col-md-10 col-lg-8">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-dark mb-0">Write a New Post</h2>
        <router-link to="/" class="btn btn-outline-secondary rounded-pill px-4">
          Cancel
        </router-link>
      </div>

      <div class="card shadow-sm border-0 p-4 rounded-4">
        <div class="card-body">
          <form @submit.prevent="submitPost">
            <div class="mb-4">
              <label for="post-title" class="form-label fw-semibold fs-5">Post Title</label>
              <input 
                v-model="title" 
                type="text" 
                id="post-title" 
                class="form-control form-control-lg" 
                placeholder="Enter a catchy title..." 
                required 
                :disabled="isLoading"
              />
            </div>

            <div class="mb-4">
              <label for="post-content" class="form-label fw-semibold fs-5">Content</label>
              <textarea 
                v-model="content" 
                id="post-content" 
                class="form-control" 
                rows="8" 
                placeholder="What's on your mind? Write your article here..." 
                required 
                :disabled="isLoading"
              ></textarea>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button 
                type="submit" 
                class="btn btn-primary btn-lg rounded-pill px-5 shadow-sm"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isLoading ? 'Publishing...' : 'Publish Post' }}
              </button>
            </div>
          </form>
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

const title = ref('');
const content = ref('');
const isLoading = ref(false);
const router = useRouter();

const submitPost = async () => {
  // Prevent empty submissions
  if (!title.value.trim() || !content.value.trim()) {
    toast.error('Title and content are required.');
    return;
  }

  isLoading.value = true;
  
  try {
    // Send POST request to your protected backend route
    const response = await api.post('/posts', {
      title: title.value,
      content: content.value
    });

    toast.success('Post published successfully!');
    
    // Redirect the user back to the Home page to see their new post
    router.push('/');
    
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to publish post. Please try again.';
    toast.error(errorMsg);
  } finally {
    isLoading.value = false;
  }
};
</script>
<template>
  <div class="row justify-content-center my-5">
    <div class="col-12 col-lg-9">
      
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Loading article...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger text-center shadow-sm rounded-4">
        {{ error }}
        <div class="mt-3">
          <router-link to="/" class="btn btn-outline-danger btn-sm">Return Home</router-link>
        </div>
      </div>

      <div v-else-if="post" class="card shadow-sm border-0 rounded-4">
        <div class="card-body p-4 p-md-5">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 border-bottom pb-4">
            <div>
              <h1 class="fw-bold text-dark mb-2">{{ post.title }}</h1>
              <p class="text-muted small mb-0">
                Published on {{ formatDate(post.creationDate || new Date()) }} by <strong>{{ post.author?.username || 'Unknown Author' }}</strong>
              </p>
            </div>
            
            <div v-if="userStore.isAuthenticated" class="mt-3 mt-md-0 d-flex gap-2">
              
              <router-link 
                v-if="userStore.user?.id === post.author?._id || userStore.user?._id === post.author?._id"
                :to="`/posts/edit/${post._id}`" 
                class="btn btn-warning btn-sm rounded-pill px-3 fw-semibold"
              >
                Edit Post
              </router-link>

              <button 
                v-if="userStore.user?.id === post.author?._id || userStore.user?._id === post.author?._id || userStore.isAdmin"
                @click="deletePost" 
                class="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                :disabled="isDeleting"
              >
                <span v-if="isDeleting" class="spinner-border spinner-border-sm me-1" role="status"></span>
                {{ isDeleting ? 'Deleting...' : 'Delete' }}
              </button>
              
            </div>
          </div>

          <div class="post-content" style="white-space: pre-wrap; line-height: 1.8;">
            {{ post.content }}
          </div>
          
          <div class="mt-5 pt-3 border-top">
            <router-link to="/" class="btn btn-light rounded-pill px-4">
              &larr; Back to all posts
            </router-link>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import api from '../api';
import { toast } from 'vue3-toastify';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const post = ref(null);
const isLoading = ref(true);
const isDeleting = ref(false);
const error = ref(null);

const fetchPost = async () => {
  try {
    const response = await api.get(`/posts/${route.params.id}`);
    post.value = response.data;
  } catch (err) {
    error.value = 'Could not find this post. It may have been deleted.';
    toast.error('Post not found.');
  } finally {
    isLoading.value = false;
  }
};

const deletePost = async () => {
  if (!confirm('Are you sure you want to delete this post? This cannot be undone.')) return;
  
  isDeleting.value = true;
  try {
    await api.delete(`/posts/${route.params.id}`);
    toast.success('Post deleted successfully!');
    router.push('/');
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Failed to delete post.';
    toast.error(errorMsg);
  } finally {
    isDeleting.value = false;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'long', day: 'numeric' 
  });
};

onMounted(() => {
  fetchPost();
});
</script>
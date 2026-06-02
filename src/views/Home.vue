<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="fw-bold text-dark">Latest Posts</h1>
      <router-link 
        v-if="userStore.isAuthenticated" 
        to="/posts/create" 
        class="btn btn-primary shadow-sm rounded-pill px-4"
      >
        + Write a Post
      </router-link>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-muted fw-semibold">Fetching the latest posts...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger text-center shadow-sm rounded-4" role="alert">
      {{ error }}
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-5 bg-white shadow-sm rounded-4 border">
      <h3 class="text-muted mb-3">It's a bit quiet here...</h3>
      <p class="text-muted mb-0">There are no blog posts published yet.</p>
    </div>

    <div v-else class="row g-4">
      <div v-for="post in posts" :key="post._id" class="col-12 col-md-6 col-lg-4">
        <div class="card blog-card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <h4 class="card-title fw-bold text-dark mb-3">{{ post.title }}</h4>
            
            <p class="card-text text-muted mb-4 flex-grow-1">
              {{ truncateText(post.content, 120) }}
            </p>
            
            <div class="mt-auto">
              <router-link :to="`/posts/${post._id}`" class="btn btn-outline-primary w-100 rounded-pill fw-semibold">
                Read More
              </router-link>
            </div>
          </div>
          
          <div class="card-footer bg-transparent border-top-0 text-muted small pb-3">
            Published on {{ formatDate(post.creationDate || new Date()) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import api from '../api';
import { toast } from 'vue3-toastify';

const userStore = useUserStore();

// Reactive State
const posts = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Fetch Posts from Backend
const fetchPosts = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await api.get('/posts');
    // We assign response.data to posts (adjust if your backend wraps it in an object like response.data.posts)
    posts.value = response.data; 
  } catch (err) {
    console.error('Error fetching posts:', err);
    error.value = 'Failed to load blog posts. Please try again later.';
    toast.error('Could not connect to the server.');
  } finally {
    isLoading.value = false;
  }
};

// Run fetchPosts immediately when the component loads
onMounted(() => {
  fetchPosts();
});

// Helper: Truncate long text so cards remain visually consistent
const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Helper: Format Dates neatly
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>
<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 pb-3 border-bottom">
          <div class="mb-3 mb-md-0">
            <h1 class="fw-bold text-dark h2 mb-1">My Dashboard</h1>
            <p class="text-muted mb-0 small">Manage and track your published articles</p>
          </div>
          
          <div class="d-flex align-items-center gap-3">
            <span class="badge bg-dark rounded-pill px-3 py-2 d-none d-sm-inline-block">
              {{ filteredPosts.length }} {{ filteredPosts.length === 1 ? 'Post' : 'Posts' }}
            </span>
            <router-link 
              to="/posts/create" 
              class="btn btn-success rounded-pill px-4 fw-semibold shadow-sm"
            >
              <i class="bi bi-plus-lg me-1"></i> + Create New Post
            </router-link>
          </div>
        </div>

        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-3 text-muted">Retrieving your articles...</p>
        </div>

        <div v-else-if="filteredPosts.length === 0" class="card shadow-sm border-0 rounded-4 text-center p-5 bg-light">
          <div class="card-body">
            <div class="mb-4">
               <span class="display-1 text-muted opacity-25">✍️</span>
            </div>
            <h3 class="fw-bold text-secondary mb-3">You haven't written anything yet!</h3>
            <p class="text-muted mb-4">Your dashboard is looking a bit empty. Start your blogging journey today.</p>
            <router-link to="/posts/create" class="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm">
              Write Your First Post
            </router-link>
          </div>
        </div>

        <div v-else class="row g-4">
          <div v-for="post in filteredPosts" :key="post._id" class="col-12 col-md-6">
            <div class="card h-100 shadow-sm border-0 rounded-4 hover-shadow transition-all">
              <div class="card-body p-4 d-flex flex-column justify-content-between">
                
                <div>
                  <h5 class="card-title fw-bold text-dark mb-2 text-truncate-2">
                    {{ post.title }}
                  </h5>
                  <p class="text-muted small mb-3">
                    Published on {{ formatDate(post.creationDate) }}
                  </p>
                  <p class="card-text text-muted line-clamp mb-4">
                    {{ post.content }}
                  </p>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-light">
                  <router-link 
                    :to="`/posts/${post._id}`" 
                    class="btn btn-outline-primary btn-sm rounded-pill px-3 fw-semibold"
                  >
                    Read Article
                  </router-link>

                  <div class="d-flex gap-2">
                    <router-link 
                      :to="`/posts/edit/${post._id}`" 
                      class="btn btn-warning btn-sm rounded-pill px-3 fw-semibold"
                    >
                      Edit
                    </router-link>

                    <button 
                      @click="handleDelete(post._id)" 
                      class="btn btn-danger btn-sm rounded-pill px-3 fw-semibold"
                      :disabled="isDeletingId === post._id"
                    >
                      <span v-if="isDeletingId === post._id" class="spinner-border spinner-border-sm me-1"></span>
                      {{ isDeletingId === post._id ? 'Removing...' : 'Delete' }}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '../stores/userStore';
import api from '../api';
import { toast } from 'vue3-toastify';

const userStore = useUserStore();

const allPosts = ref([]);
const isLoading = ref(true);
const isDeletingId = ref(null);

const fetchAllPosts = async () => {
  try {
    const response = await api.get('/posts');
    allPosts.value = response.data;
  } catch (err) {
    toast.error('Failed to pull articles from server.');
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const filteredPosts = computed(() => {
  return allPosts.value.filter(post => {
    const postAuthorId = post.author?._id || post.author;
    const activeUserId = userStore.user?.id || userStore.user?._id;
    return postAuthorId === activeUserId;
  });
});

const handleDelete = async (postId) => {
  if (!confirm('Are you sure you want to discard this post permanently?')) return;

  isDeletingId.value = postId;
  try {
    await api.delete(`/posts/${postId}`);
    toast.success('Post removed from the platform.');
    allPosts.value = allPosts.value.filter(p => p._id !== postId);
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Deletion rejected.';
    toast.error(errorMsg);
  } finally {
    isDeletingId.value = null;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'Recent';
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

onMounted(() => {
  fetchAllPosts();
});
</script>

<style scoped>
.transition-all {
  transition: all 0.25s ease-in-out;
}
.hover-shadow:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.1) !important;
}
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
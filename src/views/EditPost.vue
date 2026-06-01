<template>
  <div class="row justify-content-center my-5">
    <div class="col-12 col-md-10 col-lg-8">
      
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="fw-bold text-dark mb-0">Edit Post</h2>
        <button @click="router.back()" class="btn btn-outline-secondary rounded-pill px-4">
          Cancel
        </button>
      </div>

      <div class="card shadow-sm border-0 p-4 rounded-4">
        <div v-if="isFetching" class="text-center py-4">
          <div class="spinner-border text-primary" role="status"></div>
          <p class="mt-2 text-muted">Loading post data...</p>
        </div>

        <div v-else class="card-body">
          <form @submit.prevent="updatePost">
            <div class="mb-4">
              <label for="edit-title" class="form-label fw-semibold fs-5">Post Title</label>
              <input 
                v-model="title" 
                type="text" 
                id="edit-title" 
                class="form-control form-control-lg" 
                required 
                :disabled="isUpdating"
              />
            </div>

            <div class="mb-4">
              <label for="edit-content" class="form-label fw-semibold fs-5">Content</label>
              <textarea 
                v-model="content" 
                id="edit-content" 
                class="form-control" 
                rows="8" 
                required 
                :disabled="isUpdating"
              ></textarea>
            </div>

            <div class="d-flex justify-content-end mt-4">
              <button 
                type="submit" 
                class="btn btn-warning btn-lg rounded-pill px-5 shadow-sm fw-semibold"
                :disabled="isUpdating"
              >
                <span v-if="isUpdating" class="spinner-border spinner-border-sm me-2" role="status"></span>
                {{ isUpdating ? 'Saving Changes...' : 'Save Changes' }}
              </button>
            </div>
          </form>
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

const title = ref('');
const content = ref('');
const isFetching = ref(true);
const isUpdating = ref(false);

// Fetch existing data & evaluate secure authorization rights
const fetchPostData = async () => {
  try {
    const response = await api.get(`/posts/${route.params.id}`);
    const postData = response.data;

    // 🛡️ SECURITY URL INTRUDER CHECK
    // If user claims to be logged in but their ID doesn't match the author's reference id, block them
    if (!userStore.user || userStore.user.id !== postData.author?._id) {
      toast.error('Action Forbidden. You do not own this post.');
      router.push('/');
      return;
    }

    title.value = postData.title;
    content.value = postData.content;
  } catch (error) {
    toast.error('Failed to load post data.');
    router.push('/'); 
  } finally {
    isFetching.value = false;
  }
};

const updatePost = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    toast.error('Title and content cannot be empty.');
    return;
  }

  isUpdating.value = true;
  try {
    await api.put(`/posts/${route.params.id}`, {
      title: title.value,
      content: content.value
    });

    toast.success('Post updated successfully!');
    router.push(`/posts/${route.params.id}`);
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Failed to update post.';
    toast.error(errorMsg);
  } finally {
    isUpdating.value = false;
  }
};

onMounted(() => {
  fetchPostData();
});
</script>
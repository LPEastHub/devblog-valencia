<template>
  <footer class="bg-dark text-light py-4 mt-5 border-top border-secondary">
    <div class="container text-center">
      <p class="mb-1">&copy; {{ currentYear }} <span class="text-primary fw-bold">DevBlog</span>. All rights reserved.</p>
      <small class="text-muted">Built with Vue 3, Bootstrap, and Node.js</small>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
const currentYear = computed(() => new Date().getFullYear());
</script>
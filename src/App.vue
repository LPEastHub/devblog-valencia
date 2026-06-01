<template>
  <div id="app">
    <NavBar />

    <main class="container my-4">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>
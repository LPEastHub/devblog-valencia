import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '../stores/userStore';

// Using dynamic imports (lazy loading) for optimal performance
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/Register.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/posts/create',
        name: 'CreatePost',
        component: () => import('../views/CreatePost.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/posts/:id',
        name: 'PostDetail',
        component: () => import('../views/PostDetail.vue'),
        meta: { requiresAuth: false }
    },
    {
        path: '/posts/edit/:id',
        name: 'EditPost',
        component: () => import('../views/EditPost.vue'),
        meta: { requiresAuth: true }
    },
    // 📢 NEW ADDITION: Dashboard route for an author's specific posts
    {
        path: '/my-posts',
        name: 'MyPosts',
        component: () => import('../views/MyPosts.vue'),
        meta: { requiresAuth: true } // Keeps guests out of private dashboards
    },
    
    // ↩️ CATCH-ALL FALLBACK ROUTE: Redirects broken URLs safely back to the Home feed
    { 
        path: '/:pathMatch(.*)*', 
        redirect: '/' 
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Global Navigation Guard
router.beforeEach((to, from) => {
    const userStore = useUserStore();

    // 💡 CRITICAL RESILIENCY CHECK: If store state is wiped out on a hard page refresh, 
    // automatically restore the token from localStorage before running guard validations.
    if (!userStore.token && localStorage.getItem('token')) {
        userStore.setToken(localStorage.getItem('token'));
    }

    // 1. Guarding Protected Routes -> Block unauthenticated visitors from reaching private pages
    if (to.meta.requiresAuth && !userStore.isAuthenticated) {
        return { name: 'Login' };
    } 
    
    // 2. Guarding Guest Spaces -> Bounce logged-in users away from Login/Register pages
    if (to.meta.guestOnly && userStore.isAuthenticated) {
        return { name: 'Home' };
    }
    
    // 3. Clear to proceed -> If no conditions intercept, navigation executes natively.
});

export default router;
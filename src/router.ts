import { createWebHistory, createRouter } from 'vue-router'

import Login from './pages/login.vue'
import ResetPassword from './pages/reset-password.vue'
import ChangePassword from './pages/change-password.vue'
import Mfa from './pages/mfa.vue'
import Signup from './pages/signup.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/login/resetpassword', component: ResetPassword},
    { path: '/login/changepassword', component: ChangePassword},
    { path: '/login/mfa', name: 'mfa', component: Mfa, props: true},
    { path: '/login/signup', component: Signup }
  ] 

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
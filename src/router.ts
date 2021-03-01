import { createWebHistory, createRouter } from 'vue-router'

import Login from './pages/Login.vue'
import ResetPassword from './pages/ResetPassword.vue'
import ChangePassword from './pages/ChangePassword.vue'

const routes = [
    { path: '/login', component: Login },
    { path: '/login/resetpassword', component: ResetPassword},
    { path: '/login/changepassword', component: ChangePassword}
  ] 

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
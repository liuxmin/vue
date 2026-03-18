import {createRouter, createWebHistory} from 'vue-router'

export const constRoutes = [
    {
        path: '/login',
        component: () => import("@/views/login"),
        hidden: true,
    },
    {
        path: '/register',
        component: () => import("@/views/register"),
        hidden: true,
    },
    {
        path: '/',
        component: () => import('@/views/layout'),
        redirect: '/index',
        children: [
            {
                path: '/index',
                name: 'index',
                meta: {title: "首页"}
            }
        ]
    },

]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constRoutes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return {top: 0}
    },
})

export default router

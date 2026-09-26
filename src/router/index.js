import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/Dashboard.vue'), meta: { title: '出行看板' } },
  { path: '/plans', name: 'plans', component: () => import('../views/PlanList.vue'), meta: { title: '我的出行计划' } },
  { path: '/plans/new', name: 'plan-new', component: () => import('../views/PlanForm.vue'), meta: { title: '新建出行计划' } },
  { path: '/plans/:id', name: 'plan-detail', component: () => import('../views/PlanDetail.vue'), meta: { title: '计划详情' } },
  { path: '/plans/:id/edit', name: 'plan-edit', component: () => import('../views/PlanForm.vue'), meta: { title: '编辑出行计划' } },
  { path: '/achievements', name: 'achievements', component: () => import('../views/Achievements.vue'), meta: { title: '成就徽章' } },
  { path: '/leaderboard', name: 'leaderboard', component: () => import('../views/Leaderboard.vue'), meta: { title: '排行榜' } },
  { path: '/profile', name: 'profile', component: () => import('../views/Profile.vue'), meta: { title: '个人中心' } },
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
})

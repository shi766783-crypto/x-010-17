<script setup>
import { useRouter } from 'vue-router'
import { useTravelStore } from '../stores/travel'
import { formatDate, formatMoney } from '../utils/format'
import { planTotalSpend, planPackingRate } from '../services/selectors'

const store = useTravelStore()
const router = useRouter()

function tripTypeClass(type) {
  return { 出国: 'tag-red', 长途: 'tag-orange', 出差: 'tag-blue' }[type] || 'tag-green'
}

function onDelete(plan) {
  if (confirm(`确认删除「${plan.name}」吗？此操作不可恢复。`)) {
    store.deletePlan(plan.id)
  }
}
</script>

<template>
  <div>
    <div class="flex-between mb-16">
      <p class="text-secondary">共 {{ store.plans.length }} 个出行计划</p>
      <button class="btn btn-primary" @click="router.push('/plans/new')">+ 新建出行计划</button>
    </div>

    <div v-if="store.sortedPlans.length" class="plan-grid">
      <div
        v-for="plan in store.sortedPlans"
        :key="plan.id"
        class="plan-card"
        :class="{ 'plan-card-pinned': store.isPinned(plan.id) }"
        @click="router.push(`/plans/${plan.id}`)"
      >
        <div class="plan-cover">
          <img v-if="plan.photo" :src="plan.photo" alt="目的地照片" />
          <div v-else class="plan-cover-placeholder">{{ plan.destination.slice(0, 1) }}</div>
          <span v-if="store.isPinned(plan.id)" class="pin-badge">📌 置顶</span>
        </div>
        <div class="plan-body">
          <div class="flex-between">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <span class="tag" :class="tripTypeClass(plan.tripType)">{{ plan.tripType }}</span>
          </div>
          <p class="plan-dest text-secondary">{{ plan.destination }} · {{ plan.destinationType }}</p>
          <p class="plan-date text-muted">
            {{ formatDate(plan.startDate) }} 至 {{ formatDate(plan.endDate) }} · {{ plan.days }} 天
          </p>
          <div class="plan-meta">
            <span>{{ plan.memberCount }} 人 · {{ plan.transport }}</span>
          </div>
          <div class="plan-stats">
            <div class="plan-stat">
              <span class="text-muted">花费</span>
              <strong :class="planTotalSpend(plan) > plan.budget ? 'text-danger' : ''">
                {{ formatMoney(planTotalSpend(plan)) }}
                <small v-if="plan.budget"> / {{ formatMoney(plan.budget) }}</small>
              </strong>
            </div>
            <div class="plan-stat">
              <span class="text-muted">打包</span>
              <strong>{{ planPackingRate(plan) }}%</strong>
            </div>
          </div>
        </div>
        <div class="plan-actions" @click.stop>
          <button class="btn btn-ghost btn-sm" @click="router.push(`/plans/${plan.id}`)">详情</button>
          <button class="btn btn-ghost btn-sm" @click="router.push(`/plans/${plan.id}/edit`)">编辑</button>
          <button class="btn btn-ghost btn-sm" @click="store.togglePin(plan.id)">
            {{ store.isPinned(plan.id) ? '取消置顶' : '置顶' }}
          </button>
          <button class="btn btn-danger btn-sm" @click="onDelete(plan)">删除</button>
        </div>
      </div>
    </div>

    <div v-else class="card empty">
      <p class="empty-icon">+</p>
      <p>还没有出行计划</p>
      <button class="btn btn-primary mt-16" @click="router.push('/plans/new')">新建出行计划</button>
    </div>
  </div>
</template>

<style scoped>
.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.plan-card {
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.15s, transform 0.15s;
  display: flex;
  flex-direction: column;
}

.plan-card-pinned {
  box-shadow: 0 0 0 2px var(--primary), var(--shadow);
}

.plan-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.plan-card-pinned:hover {
  box-shadow: 0 0 0 2px var(--primary), var(--shadow-md);
}

.plan-cover {
  position: relative;
  height: 140px;
  background: linear-gradient(135deg, #4f6ef7, #7c5cf0);
}

.pin-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  background: rgba(30, 36, 51, 0.72);
}

.plan-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plan-cover-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 48px;
  font-weight: 700;
}

.plan-body {
  padding: 16px;
  flex: 1;
}

.plan-name {
  font-size: 16px;
  margin-bottom: 2px;
}

.plan-dest {
  font-size: 14px;
}

.plan-date {
  font-size: 13px;
}

.plan-meta {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.plan-stats {
  display: flex;
  gap: 24px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

.plan-stat {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

.plan-stat strong {
  font-size: 15px;
}

.plan-stat small {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 400;
}

.plan-actions {
  display: flex;
  gap: 8px;
  padding: 0 16px 16px;
}
</style>

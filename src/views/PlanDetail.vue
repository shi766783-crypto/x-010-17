<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTravelStore } from '../stores/travel'
import { formatDate, formatMoney } from '../utils/format'
import { planTotalSpend, planPackingRate, planTodoProgress } from '../services/selectors'
import LuggageList from '../components/plan/LuggageList.vue'
import TodoList from '../components/plan/TodoList.vue'
import RecordSection from '../components/plan/RecordSection.vue'
import SummarySection from '../components/plan/SummarySection.vue'

const store = useTravelStore()
const route = useRoute()
const router = useRouter()

const plan = computed(() => store.planById(route.params.id))
const activeTab = ref('overview')

const tabs = [
  { key: 'overview', label: '概览' },
  { key: 'luggage', label: '行李清单' },
  { key: 'todo', label: '待办清单' },
  { key: 'record', label: '行程与花费' },
  { key: 'summary', label: '出行总结' },
]

function onDelete() {
  if (confirm(`确认删除「${plan.value.name}」吗？`)) {
    store.deletePlan(plan.value.id)
    router.push('/plans')
  }
}
</script>

<template>
  <div v-if="plan">
    <!-- 头部信息 -->
    <div class="card detail-head">
      <div class="head-left">
        <h2 class="detail-name">{{ plan.name }}</h2>
        <div class="detail-tags">
          <span class="tag tag-blue">{{ plan.tripType }}</span>
          <span class="tag tag-green">{{ plan.destinationType }}</span>
          <span class="tag tag-gray">{{ plan.transport }}</span>
        </div>
        <p class="detail-dest text-secondary">{{ plan.destination }}</p>
        <p class="text-muted">
          {{ formatDate(plan.startDate) }} 至 {{ formatDate(plan.endDate) }} · {{ plan.days }} 天 ·
          {{ plan.memberCount }} 人
        </p>
      </div>
      <div class="head-right">
        <img v-if="plan.photo" :src="plan.photo" class="detail-photo" alt="目的地照片" />
        <button class="btn btn-ghost btn-sm" @click="router.push(`/plans/${plan.id}/edit`)">编辑</button>
        <button class="btn btn-danger btn-sm" @click="onDelete">删除</button>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- 概览 -->
    <div v-if="activeTab === 'overview'" class="card">
      <div class="overview-grid">
        <div class="ov-item"><span>住宿信息</span><strong>{{ plan.accommodation || '未填写' }}</strong></div>
        <div class="ov-item"><span>预算总额</span><strong>{{ formatMoney(plan.budget) }}</strong></div>
        <div class="ov-item"><span>当前花费</span><strong>{{ formatMoney(planTotalSpend(plan)) }}</strong></div>
        <div class="ov-item">
          <span>行李打包</span><strong>{{ planPackingRate(plan) }}%</strong>
        </div>
        <div class="ov-item">
          <span>待办完成</span><strong>{{ planTodoProgress(plan) }}%</strong>
        </div>
        <div class="ov-item">
          <span>预算结余</span>
          <strong :class="plan.budget - planTotalSpend(plan) >= 0 ? 'text-success' : 'text-danger'">
            {{ formatMoney(plan.budget - planTotalSpend(plan)) }}
          </strong>
        </div>
      </div>
      <div v-if="plan.notes" class="ov-notes">
        <span class="text-muted">备注</span>
        <p>{{ plan.notes }}</p>
      </div>
      <div class="ov-members">
        <span class="text-muted">出行成员</span>
        <div class="member-chips">
          <span v-for="m in plan.members" :key="m.id" class="tag tag-blue">{{ m.name }}</span>
        </div>
      </div>
    </div>

    <!-- 行李清单 -->
    <div v-else-if="activeTab === 'luggage'" class="card">
      <div class="grid-2">
        <LuggageList
          v-for="m in plan.members"
          :key="m.id"
          :plan-id="plan.id"
          :member-id="m.id"
          :member-name="m.name"
        />
      </div>
    </div>

    <!-- 待办清单 -->
    <div v-else-if="activeTab === 'todo'" class="card">
      <TodoList :plan-id="plan.id" />
    </div>

    <!-- 行程与花费 -->
    <div v-else-if="activeTab === 'record'" class="card">
      <RecordSection :plan="plan" />
    </div>

    <!-- 出行总结 -->
    <div v-else-if="activeTab === 'summary'" class="card">
      <SummarySection :plan="plan" />
    </div>
  </div>

  <div v-else class="card empty">
    <p>计划不存在或已被删除</p>
    <button class="btn btn-ghost mt-16" @click="router.push('/plans')">返回计划列表</button>
  </div>
</template>

<style scoped>
.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.detail-name {
  font-size: 22px;
  margin-bottom: 8px;
}

.detail-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.detail-dest {
  font-size: 15px;
  margin-bottom: 4px;
}

.head-right {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.detail-photo {
  width: 160px;
  height: 100px;
  object-fit: cover;
  border-radius: var(--radius-sm);
}

.tabs {
  display: flex;
  gap: 4px;
  margin: 16px 0;
  background: var(--surface);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 6px;
}

.tab {
  flex: 1;
  border: none;
  background: transparent;
  padding: 9px;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 14px;
}

.tab.active {
  background: var(--primary);
  color: #fff;
  font-weight: 500;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.ov-item {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.ov-item span {
  font-size: 12px;
  color: var(--text-secondary);
}

.ov-item strong {
  font-size: 16px;
  margin-top: 2px;
}

.ov-notes,
.ov-members {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.ov-notes p {
  margin-top: 6px;
}

.member-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}
</style>

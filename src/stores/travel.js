import { defineStore } from 'pinia'
import { planStorage, pinStorage } from '../services/storage'
import { generateLuggageTemplate, getDestinationType } from '../services/luggage'
import { generateDefaultTodos } from '../services/todo'
import { computeAchievements, TOTAL_ACHIEVEMENTS } from '../services/achievements'
import { computeDashboardStats, computeMemberLeaderboard } from '../services/stats'
import { daysBetween } from '../utils/format'
import { uid } from '../utils/id'

// 根据出行人数与可选姓名生成成员列表
function buildMemberNames(input) {
  const count = Math.max(1, Number(input.memberCount) || 1)
  const provided = (input.memberNames || []).map((s) => String(s).trim()).filter(Boolean)
  return Array.from({ length: count }, (_, i) => provided[i] || `成员${i + 1}`)
}

export const useTravelStore = defineStore('travel', {
  state: () => ({
    plans: [],
    // 置顶的计划 id 列表，越靠前越先展示；与 plans 分离持久化
    pinnedPlanIds: [],
  }),

  getters: {
    achievements: (state) => computeAchievements(state.plans),
    totalAchievements: () => TOTAL_ACHIEVEMENTS,
    dashboardStats: (state) => computeDashboardStats(state.plans),
    leaderboard: (state) => computeMemberLeaderboard(state.plans),
    planById: (state) => (id) => state.plans.find((p) => p.id === id),
    isPinned: (state) => (id) => state.pinnedPlanIds.includes(id),
    // 列表展示顺序：置顶计划优先，其余保持原有排序
    sortedPlans: (state) => {
      const pinned = state.pinnedPlanIds
        .map((id) => state.plans.find((p) => p.id === id))
        .filter(Boolean)
      const rest = state.plans.filter((p) => !state.pinnedPlanIds.includes(p.id))
      return [...pinned, ...rest]
    },
  },

  actions: {
    // ===== 持久化 =====
    load() {
      this.plans = planStorage.read([])
      const pinned = pinStorage.read([])
      // 加载时剔除已不存在的计划 id，避免置顶标记残留
      const planIds = new Set(this.plans.map((p) => p.id))
      this.pinnedPlanIds = Array.isArray(pinned) ? pinned.filter((id) => planIds.has(id)) : []
    },
    persist() {
      planStorage.write(this.plans)
      pinStorage.write(this.pinnedPlanIds)
    },

    // ===== 出行计划 =====
    createPlan(input) {
      const days = daysBetween(input.startDate, input.endDate)
      const destinationType = getDestinationType(input.tripType)
      const memberNames = buildMemberNames(input)
      const members = memberNames.map((name) => ({ id: uid(), name }))
      const luggage = members.map((m) => ({
        memberId: m.id,
        items: generateLuggageTemplate({ tripType: input.tripType, days }),
      }))

      const plan = {
        id: uid(),
        name: input.name,
        destination: input.destination,
        destinationType,
        tripType: input.tripType,
        startDate: input.startDate,
        endDate: input.endDate,
        days,
        memberCount: members.length,
        transport: input.transport,
        accommodation: input.accommodation,
        budget: Number(input.budget) || 0,
        notes: input.notes,
        photo: input.photo || '',
        members,
        luggage,
        todos: generateDefaultTodos(),
        records: [],
        summary: null,
        createdAt: new Date().toISOString(),
      }
      this.plans.unshift(plan)
      return plan.id
    },

    updatePlan(id, input) {
      const plan = this.planById(id)
      if (!plan) return
      const days = daysBetween(input.startDate, input.endDate)
      Object.assign(plan, {
        name: input.name,
        destination: input.destination,
        destinationType: getDestinationType(input.tripType),
        tripType: input.tripType,
        startDate: input.startDate,
        endDate: input.endDate,
        days,
        transport: input.transport,
        accommodation: input.accommodation,
        budget: Number(input.budget) || 0,
        notes: input.notes,
        photo: input.photo || '',
      })
    },

    deletePlan(id) {
      this.plans = this.plans.filter((p) => p.id !== id)
      // 删除计划时一并清理其置顶标记
      this.pinnedPlanIds = this.pinnedPlanIds.filter((pid) => pid !== id)
    },

    // ===== 置顶 =====
    togglePin(id) {
      if (this.pinnedPlanIds.includes(id)) {
        // 取消置顶：回到正常排序位置
        this.pinnedPlanIds = this.pinnedPlanIds.filter((pid) => pid !== id)
      } else if (this.planById(id)) {
        // 新置顶的计划排在置顶组最前
        this.pinnedPlanIds.unshift(id)
      }
    },

    // ===== 行李清单 =====
    _findLuggageList(plan, memberId) {
      let list = plan.luggage.find((l) => l.memberId === memberId)
      if (!list) {
        list = { memberId, items: [] }
        plan.luggage.push(list)
      }
      return list
    },

    togglePack(planId, memberId, itemId) {
      const plan = this.planById(planId)
      if (!plan) return
      const list = plan.luggage.find((l) => l.memberId === memberId)
      const target = list?.items.find((i) => i.id === itemId)
      if (target) target.packed = !target.packed
    },

    addCustomItem(planId, memberId, name, category) {
      const plan = this.planById(planId)
      if (!plan) return
      const list = this._findLuggageList(plan, memberId)
      list.items.push({ id: uid(), name, category, custom: true, packed: false })
    },

    removeItem(planId, memberId, itemId) {
      const plan = this.planById(planId)
      if (!plan) return
      const list = plan.luggage.find((l) => l.memberId === memberId)
      if (!list) return
      list.items = list.items.filter((i) => i.id !== itemId)
    },

    // ===== 待办清单 =====
    toggleTodo(planId, todoId) {
      const plan = this.planById(planId)
      const todo = plan?.todos.find((t) => t.id === todoId)
      if (todo) todo.done = !todo.done
    },

    addTodo(planId, name) {
      const plan = this.planById(planId)
      if (plan) plan.todos.push({ id: uid(), name, done: false })
    },

    removeTodo(planId, todoId) {
      const plan = this.planById(planId)
      if (plan) plan.todos = plan.todos.filter((t) => t.id !== todoId)
    },

    // ===== 行程与花费 =====
    addRecord(planId, record) {
      const plan = this.planById(planId)
      if (plan) plan.records.push({ id: uid(), ...record })
    },

    updateRecord(planId, recordId, record) {
      const plan = this.planById(planId)
      const target = plan?.records.find((r) => r.id === recordId)
      if (target) Object.assign(target, record)
    },

    deleteRecord(planId, recordId) {
      const plan = this.planById(planId)
      if (plan) plan.records = plan.records.filter((r) => r.id !== recordId)
    },

    // ===== 出行总结 =====
    saveSummary(planId, summary) {
      const plan = this.planById(planId)
      if (plan) plan.summary = summary
    },
  },
})

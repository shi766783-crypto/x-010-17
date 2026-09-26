import { planPackingRate, planTodosAllDone, planTotalSpend } from './selectors'

// 成就徽章定义（12 种）
// check 函数接收 { plans } 上下文，返回是否达成
export const ACHIEVEMENTS = [
  {
    id: 'first-trip',
    name: '首次出行',
    description: '创建第一个出行计划',
    glyph: '首',
    color: '#4f6ef7',
    check: ({ plans }) => plans.length >= 1,
  },
  {
    id: 'frequent-traveler',
    name: '常旅客',
    description: '累计出行 3 次及以上',
    glyph: '旅',
    color: '#7c5cf0',
    check: ({ plans }) => plans.length >= 3,
  },
  {
    id: 'global-traveler',
    name: '环球旅行家',
    description: '完成一次出国出行',
    glyph: '环',
    color: '#0ea5e9',
    check: ({ plans }) => plans.some((p) => p.tripType === '出国'),
  },
  {
    id: 'luggage-master',
    name: '行李达人',
    description: '某次出行行李打包完成率达 100%',
    glyph: '包',
    color: '#10b981',
    check: ({ plans }) => plans.some((p) => planPackingRate(p) === 100),
  },
  {
    id: 'packing-pro',
    name: '打包能手',
    description: '某次出行行李打包完成率达 80%',
    glyph: '装',
    color: '#22c55e',
    check: ({ plans }) => plans.some((p) => planPackingRate(p) >= 80),
  },
  {
    id: 'todo-clearer',
    name: '待办清道夫',
    description: '某次出行完成全部待办事项',
    glyph: '办',
    color: '#f59e0b',
    check: ({ plans }) => plans.some((p) => planTodosAllDone(p)),
  },
  {
    id: 'budget-master',
    name: '预算控制大师',
    description: '某次出行花费未超过预算',
    glyph: '控',
    color: '#f97316',
    check: ({ plans }) =>
      plans.some((p) => {
        const budget = Number(p.budget) || 0
        return budget > 0 && p.records?.length > 0 && planTotalSpend(p) <= budget
      }),
  },
  {
    id: 'frugal-star',
    name: '精打细算',
    description: '某次出行花费控制在预算 80% 以内',
    glyph: '省',
    color: '#ef4444',
    check: ({ plans }) =>
      plans.some((p) => {
        const budget = Number(p.budget) || 0
        return budget > 0 && p.records?.length > 0 && planTotalSpend(p) <= budget * 0.8
      }),
  },
  {
    id: 'photographer',
    name: '旅行摄影师',
    description: '上传目的地照片与行程照片',
    glyph: '影',
    color: '#ec4899',
    check: ({ plans }) =>
      plans.some((p) => p.photo && (p.records || []).some((r) => r.photo)),
  },
  {
    id: 'recorder',
    name: '出行记录家',
    description: '记录一次每日行程',
    glyph: '记',
    color: '#8b5cf6',
    check: ({ plans }) => plans.some((p) => (p.records || []).length >= 1),
  },
  {
    id: 'five-star',
    name: '五星好评',
    description: '为一次出行打出 5 星评分',
    glyph: '星',
    color: '#eab308',
    check: ({ plans }) => plans.some((p) => p.summary && p.summary.rating === 5),
  },
  {
    id: 'all-rounder',
    name: '全能管家',
    description: '一次出行同时完成总结、待办、行李与行程记录',
    glyph: '全',
    color: '#14b8a6',
    check: ({ plans }) =>
      plans.some(
        (p) =>
          p.summary &&
          planTodosAllDone(p) &&
          planPackingRate(p) === 100 &&
          (p.records || []).length >= 1
      ),
  },
]

// 计算当前已解锁的成就列表
export function computeAchievements(plans) {
  const ctx = { plans }
  return ACHIEVEMENTS.map((a) => ({ ...a, unlocked: a.check(ctx) }))
}

export const TOTAL_ACHIEVEMENTS = ACHIEVEMENTS.length

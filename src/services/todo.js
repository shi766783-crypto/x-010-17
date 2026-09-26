import { TODO_DEFAULTS } from '../constants'
import { uid } from '../utils/id'

// 生成默认待办清单
export function generateDefaultTodos() {
  return TODO_DEFAULTS.map((name) => ({ id: uid(), name, done: false }))
}

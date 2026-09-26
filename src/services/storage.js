// localStorage 通用封装：按命名空间隔离，统一异常处理与序列化
const PREFIX = 'family-travel-manager'

export function createStorage(namespace) {
  const key = `${PREFIX}:${namespace}`
  return {
    read(fallback = null) {
      try {
        const raw = localStorage.getItem(key)
        return raw == null ? fallback : JSON.parse(raw)
      } catch (error) {
        console.error(`[storage] 读取 ${key} 失败`, error)
        return fallback
      }
    },
    write(value) {
      try {
        localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`[storage] 写入 ${key} 失败`, error)
      }
    },
    remove() {
      localStorage.removeItem(key)
    },
  }
}

export const planStorage = createStorage('plans')

// 置顶计划 id 列表，独立于计划数据单独保存
export const pinnedPlanStorage = createStorage('pinned-plans')

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
// 置顶标记独立存储：只保存计划 id 列表，与计划数据分离
export const pinStorage = createStorage('pinned-plans')

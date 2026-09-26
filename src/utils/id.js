// 生成唯一 ID（时间戳 + 随机数），无需额外依赖
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
}

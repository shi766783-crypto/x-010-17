<script setup>
import { computed } from 'vue'

const DEFAULT_COLORS = [
  '#4f6ef7',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#0ea5e9',
  '#ec4899',
  '#14b8a6',
]

const props = defineProps({
  data: { type: Array, default: () => [] },
  colors: { type: Array, default: null },
  formatter: { type: Function, default: (v) => v },
})

const palette = computed(() => props.colors || DEFAULT_COLORS)

const total = computed(() => props.data.reduce((s, d) => s + (Number(d.value) || 0), 0))

const gradient = computed(() => {
  if (!total.value) return 'conic-gradient(#eef0f4 0 100%)'
  let acc = 0
  const parts = props.data.map((d, i) => {
    const start = acc
    acc += ((Number(d.value) || 0) / total.value) * 100
    return `${palette.value[i % palette.value.length]} ${start}% ${acc}%`
  })
  return `conic-gradient(${parts.join(', ')})`
})
</script>

<template>
  <div class="donut-layout">
    <div class="donut" :style="{ background: gradient }">
      <div class="hole">
        <span class="hole-label">总花费</span>
        <span class="hole-value">{{ formatter(total) }}</span>
      </div>
    </div>
    <ul class="legend">
      <li v-for="(d, i) in data" :key="i" class="legend-item">
        <span class="dot" :style="{ background: palette[i % palette.length] }"></span>
        <span class="legend-label">{{ d.label }}</span>
        <span class="legend-val">{{ formatter(d.value) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.donut-layout {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.donut {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.hole {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.hole-label {
  font-size: 11px;
  color: var(--text-muted);
}

.hole-value {
  font-size: 16px;
  font-weight: 700;
}

.legend {
  list-style: none;
  flex: 1;
  min-width: 160px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 13px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  color: var(--text-secondary);
}

.legend-val {
  font-weight: 500;
}
</style>

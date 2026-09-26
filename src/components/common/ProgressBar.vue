<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  color: { type: String, default: '' },
  showLabel: { type: Boolean, default: true },
})

const percent = computed(() => {
  const p = (props.value / (props.max || 1)) * 100
  return Math.min(100, Math.max(0, Math.round(p)))
})
</script>

<template>
  <div class="progress">
    <div v-if="showLabel" class="progress-head">
      <slot name="label"><span></span></slot>
      <span class="progress-val">{{ percent }}%</span>
    </div>
    <div class="track">
      <div
        class="fill"
        :style="{ width: percent + '%', background: color || 'var(--primary)' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.progress-head {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.progress-val {
  font-weight: 600;
  color: var(--text);
}

.track {
  height: 8px;
  background: #eef0f4;
  border-radius: 20px;
  overflow: hidden;
}

.fill {
  height: 100%;
  border-radius: 20px;
  transition: width 0.3s;
}
</style>

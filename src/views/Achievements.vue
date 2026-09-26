<script setup>
import { computed } from 'vue'
import { useTravelStore } from '../stores/travel'

const store = useTravelStore()

const unlockedCount = computed(
  () => store.achievements.filter((a) => a.unlocked).length
)
</script>

<template>
  <div>
    <div class="card flex-between">
      <div>
        <h3 class="card-title" style="margin: 0">成就徽章</h3>
        <p class="text-secondary">完成出行中的各种任务，解锁徽章</p>
      </div>
      <div class="achievement-progress">
        <strong class="text-xl">{{ unlockedCount }}</strong>
        <span class="text-muted"> / {{ store.totalAchievements }}</span>
      </div>
    </div>

    <div class="badge-list mt-16">
      <div
        v-for="a in store.achievements"
        :key="a.id"
        class="badge"
        :class="{ locked: !a.unlocked }"
      >
        <div class="badge-icon" :style="{ background: a.color }">{{ a.glyph }}</div>
        <div class="badge-name">{{ a.name }}</div>
        <div class="badge-desc">{{ a.description }}</div>
        <span v-if="a.unlocked" class="tag tag-green" style="margin-top: 6px">已解锁</span>
        <span v-else class="tag tag-gray" style="margin-top: 6px">未解锁</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.achievement-progress {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
</style>

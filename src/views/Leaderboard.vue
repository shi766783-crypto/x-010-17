<script setup>
import { computed, ref } from 'vue'
import { useTravelStore } from '../stores/travel'

const store = useTravelStore()
const board = computed(() => store.leaderboard)
const tab = ref('travel')

const travelBoard = computed(() => board.value.travelMasterBoard)
const luggageBoard = computed(() => board.value.luggageMasterBoard)

function rankClass(i) {
  return i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''
}
</script>

<template>
  <div>
    <div class="tabs" style="box-shadow: none; padding: 0; background: transparent; gap: 8px">
      <button class="tab board-tab" :class="{ active: tab === 'travel' }" @click="tab = 'travel'">
        出行达人榜
      </button>
      <button class="tab board-tab" :class="{ active: tab === 'luggage' }" @click="tab = 'luggage'">
        行李管家榜
      </button>
    </div>

    <!-- 出行达人榜 -->
    <div v-if="tab === 'travel'" class="card">
      <h3 class="card-title">出行达人榜 <span class="text-muted" style="font-size: 13px; font-weight: 400">按出行次数与总结质量综合排序</span></h3>
      <table v-if="travelBoard.length" class="table">
        <thead>
          <tr><th>排名</th><th>成员</th><th>出行次数</th><th>平均评分</th><th>综合分</th></tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in travelBoard" :key="m.name">
            <td><span class="rank" :class="rankClass(i)">{{ i + 1 }}</span></td>
            <td>{{ m.name }}</td>
            <td>{{ m.trips }}</td>
            <td>{{ m.avgRating || '—' }}</td>
            <td>{{ m.travelScore.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">暂无数据，创建出行计划后即可上榜</p>
    </div>

    <!-- 行李管家榜 -->
    <div v-else class="card">
      <h3 class="card-title">行李管家榜 <span class="text-muted" style="font-size: 13px; font-weight: 400">按打包完成率排序</span></h3>
      <table v-if="luggageBoard.length" class="table">
        <thead>
          <tr><th>排名</th><th>成员</th><th>打包完成率</th><th>出行次数</th></tr>
        </thead>
        <tbody>
          <tr v-for="(m, i) in luggageBoard" :key="m.name">
            <td><span class="rank" :class="rankClass(i)">{{ i + 1 }}</span></td>
            <td>{{ m.name }}</td>
            <td>
              <div class="rate-cell">
                <span>{{ m.avgPackingRate }}%</span>
                <div class="rate-track"><div class="rate-fill" :style="{ width: m.avgPackingRate + '%' }"></div></div>
              </div>
            </td>
            <td>{{ m.trips }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="empty">暂无数据，创建出行计划后即可上榜</p>
    </div>
  </div>
</template>

<style scoped>
.board-tab {
  flex: 0 0 auto;
  padding: 9px 24px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.rank {
  display: inline-grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: #eef0f4;
  font-weight: 600;
  font-size: 13px;
}

.rank-1 {
  background: #fef3c7;
  color: #b45309;
}

.rank-2 {
  background: #e5e7eb;
  color: #4b5563;
}

.rank-3 {
  background: #fde8d7;
  color: #c2410c;
}

.rate-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rate-track {
  width: 120px;
  height: 8px;
  background: #eef0f4;
  border-radius: 10px;
  overflow: hidden;
}

.rate-fill {
  height: 100%;
  background: var(--primary);
  border-radius: 10px;
}
</style>

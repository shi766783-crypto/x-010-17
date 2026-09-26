<script setup>
import { computed, reactive, ref } from 'vue'
import { useTravelStore } from '../../stores/travel'
import { EXPENSE_CATEGORIES } from '../../constants'
import { planTotalSpend, planSpendBreakdown } from '../../services/selectors'
import { formatMoney, formatDate } from '../../utils/format'
import Modal from '../common/Modal.vue'
import ImageUpload from '../common/ImageUpload.vue'

const props = defineProps({
  plan: { type: Object, required: true },
})

const store = useTravelStore()

const records = computed(() =>
  [...(props.plan.records || [])].sort((a, b) => (a.date < b.date ? -1 : 1))
)

const totalSpend = computed(() => planTotalSpend(props.plan))
const breakdown = computed(() => planSpendBreakdown(props.plan))
const budget = computed(() => Number(props.plan.budget) || 0)
const balance = computed(() => budget.value - totalSpend.value)

function recordTotal(r) {
  return EXPENSE_CATEGORIES.reduce((s, { key }) => s + (Number(r[key]) || 0), 0)
}

// ===== 新增 / 编辑表单 =====
const showForm = ref(false)
const editingId = ref(null)
const form = reactive(emptyForm())

function emptyForm() {
  return {
    date: '',
    itinerary: '',
    transportCost: '',
    mealCost: '',
    ticketCost: '',
    shoppingCost: '',
    otherCost: '',
    notes: '',
    photo: '',
  }
}

function openAdd() {
  editingId.value = null
  Object.assign(form, emptyForm())
  showForm.value = true
}

function openEdit(record) {
  editingId.value = record.id
  Object.assign(form, {
    date: record.date,
    itinerary: record.itinerary,
    transportCost: record.transportCost || '',
    mealCost: record.mealCost || '',
    ticketCost: record.ticketCost || '',
    shoppingCost: record.shoppingCost || '',
    otherCost: record.otherCost || '',
    notes: record.notes,
    photo: record.photo || '',
  })
  showForm.value = true
}

function save() {
  if (!form.date) return
  const record = {
    date: form.date,
    itinerary: form.itinerary,
    transportCost: Number(form.transportCost) || 0,
    mealCost: Number(form.mealCost) || 0,
    ticketCost: Number(form.ticketCost) || 0,
    shoppingCost: Number(form.shoppingCost) || 0,
    otherCost: Number(form.otherCost) || 0,
    notes: form.notes,
    photo: form.photo,
  }
  if (editingId.value) {
    store.updateRecord(props.plan.id, editingId.value, record)
  } else {
    store.addRecord(props.plan.id, record)
  }
  showForm.value = false
}
</script>

<template>
  <div>
    <!-- 花费汇总 -->
    <div class="summary-cards">
      <div class="sum-card">
        <span class="sum-label">总花费</span>
        <strong>{{ formatMoney(totalSpend) }}</strong>
      </div>
      <div class="sum-card">
        <span class="sum-label">预算</span>
        <strong>{{ formatMoney(budget) }}</strong>
      </div>
      <div class="sum-card" :class="balance >= 0 ? 'good' : 'bad'">
        <span class="sum-label">{{ balance >= 0 ? '结余' : '超支' }}</span>
        <strong>{{ formatMoney(Math.abs(balance)) }}</strong>
      </div>
    </div>

    <!-- 分类花费 -->
    <div class="breakdown">
      <span
        v-for="{ key, label } in EXPENSE_CATEGORIES"
        :key="key"
        class="tag tag-gray"
      >{{ label }} {{ formatMoney(breakdown[label]) }}</span>
    </div>

    <div class="flex-between mb-16">
      <h3 class="card-title" style="margin: 0">行程记录</h3>
      <button type="button" class="btn btn-primary btn-sm" @click="openAdd">+ 记录行程</button>
    </div>

    <!-- 记录列表 -->
    <div v-if="records.length" class="record-list">
      <div v-for="r in records" :key="r.id" class="record">
        <div class="record-main">
          <div class="record-date">{{ formatDate(r.date) }}</div>
          <div class="record-title">{{ r.itinerary || '（无行程内容）' }}</div>
          <div class="record-costs">
            <span
              v-for="{ key, label } in EXPENSE_CATEGORIES"
              v-show="Number(r[key])"
              :key="key"
            >{{ label }} {{ formatMoney(r[key]) }}</span>
          </div>
          <div v-if="r.notes" class="record-notes">{{ r.notes }}</div>
        </div>
        <img v-if="r.photo" :src="r.photo" class="record-photo" alt="行程照片" />
        <div class="record-actions">
          <span class="record-total">{{ formatMoney(recordTotal(r)) }}</span>
          <button type="button" class="btn btn-ghost btn-sm" @click="openEdit(r)">编辑</button>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            @click="store.deleteRecord(plan.id, r.id)"
          >删除</button>
        </div>
      </div>
    </div>
    <p v-else class="empty">还没有行程记录，点击上方按钮开始记录</p>

    <!-- 表单弹窗 -->
    <Modal :show="showForm" :title="editingId ? '编辑行程' : '记录行程'" @close="showForm = false">
      <div class="form-group">
        <label class="form-label"><span class="required">*</span> 日期</label>
        <input v-model="form.date" type="date" class="input" />
      </div>
      <div class="form-group">
        <label class="form-label">行程内容</label>
        <input v-model="form.itinerary" class="input" placeholder="例如：游览西湖、逛老街" />
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">交通花费</label>
          <input v-model="form.transportCost" type="number" min="0" class="input" placeholder="0" />
        </div>
        <div class="form-group">
          <label class="form-label">餐饮花费</label>
          <input v-model="form.mealCost" type="number" min="0" class="input" placeholder="0" />
        </div>
        <div class="form-group">
          <label class="form-label">门票花费</label>
          <input v-model="form.ticketCost" type="number" min="0" class="input" placeholder="0" />
        </div>
        <div class="form-group">
          <label class="form-label">购物花费</label>
          <input v-model="form.shoppingCost" type="number" min="0" class="input" placeholder="0" />
        </div>
        <div class="form-group">
          <label class="form-label">其他花费</label>
          <input v-model="form.otherCost" type="number" min="0" class="input" placeholder="0" />
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">备注</label>
        <textarea v-model="form.notes" class="textarea" placeholder="补充说明"></textarea>
      </div>
      <div class="form-group">
        <ImageUpload v-model="form.photo" label="行程照片" />
      </div>
      <template #footer>
        <button type="button" class="btn btn-ghost" @click="showForm = false">取消</button>
        <button type="button" class="btn btn-primary" @click="save">保存</button>
      </template>
    </Modal>
  </div>
</template>

<style scoped>
.summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.sum-card {
  background: var(--bg);
  border-radius: var(--radius-sm);
  padding: 14px;
  display: flex;
  flex-direction: column;
}

.sum-card.good strong {
  color: var(--success);
}

.sum-card.bad strong {
  color: var(--danger);
}

.sum-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.sum-card strong {
  font-size: 18px;
  margin-top: 2px;
}

.breakdown {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record {
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 12px 16px;
}

.record-main {
  flex: 1;
  min-width: 0;
}

.record-date {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
}

.record-title {
  font-weight: 500;
}

.record-costs {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--text-secondary);
}

.record-notes {
  font-size: 12px;
  color: var(--text-muted);
  margin-top: 2px;
}

.record-photo {
  width: 64px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
}

.record-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.record-total {
  font-weight: 600;
  margin-right: 6px;
}
</style>

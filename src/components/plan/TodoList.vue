<script setup>
import { computed, ref } from 'vue'
import { useTravelStore } from '../../stores/travel'
import { planTodoProgress } from '../../services/selectors'
import ProgressBar from '../common/ProgressBar.vue'

const props = defineProps({
  planId: { type: String, required: true },
})

const store = useTravelStore()
const plan = computed(() => store.planById(props.planId))
const todos = computed(() => plan.value?.todos || [])
const progress = computed(() => planTodoProgress(plan.value))

const newName = ref('')

function add() {
  const name = newName.value.trim()
  if (!name) return
  store.addTodo(props.planId, name)
  newName.value = ''
}
</script>

<template>
  <div>
    <div class="todo-add">
      <input
        v-model="newName"
        class="input"
        placeholder="添加待办事项"
        @keyup.enter="add"
      />
      <button type="button" class="btn btn-primary btn-sm" @click="add">添加</button>
    </div>

    <ProgressBar :value="progress" class="mt-16">
      <template #label><span>待办完成进度</span></template>
    </ProgressBar>

    <ul v-if="todos.length" class="todo-list mt-16">
      <li v-for="todo in todos" :key="todo.id" class="todo-item" :class="{ done: todo.done }">
        <label class="todo-label">
          <input
            type="checkbox"
            :checked="todo.done"
            @change="store.toggleTodo(planId, todo.id)"
          />
          <span class="todo-name">{{ todo.name }}</span>
        </label>
        <button
          type="button"
          class="todo-remove"
          title="删除"
          @click="store.removeTodo(planId, todo.id)"
        >×</button>
      </li>
    </ul>
    <p v-else class="empty">暂无待办事项</p>
  </div>
</template>

<style scoped>
.todo-add {
  display: flex;
  gap: 8px;
}

.todo-list {
  list-style: none;
}

.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 8px;
  border-bottom: 1px solid var(--border);
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.todo-label input {
  accent-color: var(--primary);
  width: 16px;
  height: 16px;
}

.todo-item.done .todo-name {
  text-decoration: line-through;
  color: var(--text-muted);
}

.todo-remove {
  border: none;
  background: transparent;
  color: var(--text-muted);
  font-size: 16px;
  opacity: 0;
}

.todo-item:hover .todo-remove {
  opacity: 1;
}

.todo-remove:hover {
  color: var(--danger);
}
</style>

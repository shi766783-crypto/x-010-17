<script setup>
const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  size: { type: String, default: '22px' },
})

const emit = defineEmits(['update:modelValue'])

function set(value) {
  if (!props.readonly) emit('update:modelValue', value)
}
</script>

<template>
  <span class="stars">
    <span
      v-for="n in 5"
      :key="n"
      class="star"
      :class="{ on: n <= modelValue, readonly }"
      :style="{ fontSize: size }"
      @click="set(n)"
    >★</span>
  </span>
</template>

<style scoped>
.stars {
  display: inline-flex;
  gap: 2px;
}

.star {
  color: #d1d5db;
  cursor: pointer;
  transition: color 0.1s;
  user-select: none;
}

.star.on {
  color: #f59e0b;
}

.star.readonly {
  cursor: default;
}
</style>

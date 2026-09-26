<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
const inputRef = ref(null)

function onChange(event) {
  const file = event.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', reader.result)
  reader.readAsDataURL(file)
  event.target.value = ''
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="image-upload">
    <span v-if="label" class="form-label">{{ label }}</span>
    <div v-if="modelValue" class="preview">
      <img :src="modelValue" alt="预览图" />
      <button type="button" class="remove" title="移除照片" @click="clear">×</button>
    </div>
    <button v-else type="button" class="btn btn-ghost btn-sm" @click="inputRef.click()">
      上传照片
    </button>
    <input ref="inputRef" type="file" accept="image/*" hidden @change="onChange" />
  </div>
</template>

<style scoped>
.preview {
  position: relative;
  width: 120px;
  height: 90px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--border);
}

.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  line-height: 1;
  font-size: 16px;
}
</style>

<template>
  <div class="skeleton" :class="`skeleton--${type}`">
    <div v-if="avatar" class="sk-avatar"></div>
    <div v-if="image" class="sk-image"></div>
    <div class="sk-lines">
      <div v-for="n in lines" :key="n" class="sk-line" :class="{ short: n % 2 === 0 }"></div>
    </div>
    <div v-if="button" class="sk-button"></div>
  </div>
  </template>

<script setup>
const props = defineProps({
  type: { type: String, default: 'card' },
  lines: { type: Number, default: 3 },
  avatar: { type: Boolean, default: false },
  image: { type: Boolean, default: false },
  button: { type: Boolean, default: false }
})
</script>

<style scoped>
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.06);
}

.skeleton--card { width: 100%; height: 100%; }
.skeleton--list { width: 100%; }
.skeleton--profile { width: 100%; }

.sk-avatar {
  width: 48px; height: 48px; border-radius: 50%;
  background: #eee; position: relative; overflow: hidden;
}

.sk-image {
  width: 100%; height: 180px; border-radius: 12px;
  background: #eee; position: relative; overflow: hidden;
}

.sk-lines { display: flex; flex-direction: column; gap: 8px; }
.sk-line { height: 14px; border-radius: 8px; background: #eee; position: relative; overflow: hidden; }
.sk-line.short { width: 70%; }

.sk-button { width: 120px; height: 36px; border-radius: 10px; background: #eee; position: relative; overflow: hidden; }

/* shimmer */
.sk-avatar::after,
.sk-image::after,
.sk-line::after,
.sk-button::after {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0) 100%);
  transform: translateX(-100%);
  animation: shimmer 1.6s ease-in-out infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>

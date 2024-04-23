<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const lightWrapper = ref(null);
const lightWrapper2 = ref(null);

const handleMouseMove = (event) => {
  const { clientX, clientY } = event;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const deltaX = clientX - centerX;
  const deltaY = clientY - centerY;

  // Adjust these factors to control the movement intensity
  const factorX = 0.05;
  const factorY = 0.05;

  if (lightWrapper.value) {
    const lights = lightWrapper.value.children;
    lights[0].style.transform = `translate(${deltaX * factorX * 0.8}px, ${deltaY * factorY * 0.8}px) rotate(-15deg)`;
    lights[1].style.transform = `translate(${deltaX * factorX * 1.2}px, ${deltaY * factorY * 1.2}px) rotate(0deg)`;
    lights[2].style.transform = `translate(${deltaX * factorX * 0.6}px, ${deltaY * factorY * 0.6}px) rotate(24deg)`;
  }

  if (lightWrapper2.value) {
    const lights = lightWrapper.value.children;
    lights[0].style.transform = `translate(${deltaX * factorX}px, ${deltaY * factorY}px) rotate(0deg)`;
  }
};

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<template>
  <div ref="lightWrapper" class="light-wrapper">
    <div class="light-2"></div>
    <div class="light-3"></div>
    <div class="light-4"></div>
  </div>

  <div ref="lightWrapper2" class="light-wrapper-2">
    <div class="light-1"></div>
  </div>
</template>

<style scoped>
.light-wrapper,
.light-wrapper-2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.light-wrapper-2 {
  z-index: 999;
  pointer-events: none;
}

.light-1 {
  position: absolute;
  width: 300px;
  height: 300px;
  top: -50px;
  left: max(-50px, calc(50vw - 750px));
  background-color: rgba(255, 255, 255, 0.15);
  filter: blur(90px);
}

.light-2 {
  position: absolute;
  width: 800px;
  height: 2000px;
  bottom: -500px;
  left: max(-500px, calc(50vw - 1200px));
  background: linear-gradient(238.82deg, #0075FF 32.98%, #25444A 51.29%);
  transform: rotate(-24deg);
  filter: blur(90px);
  border-radius: 300px;
  opacity: 0.75;
}

.light-3 {
  display: none;
  position: absolute;
  width: 400px;
  height: 400px;
  top: 400px;
  right: max(-200px, calc(50vw - 800px));
  background-color: rgba(255, 255, 255, 0.15);
  filter: blur(150px);
}

.light-4 {
  position: absolute;
  width: 600px;
  height: 1200px;
  bottom: -50px;
  right: max(-350px, calc(50vw - 1000px));
  background: linear-gradient(238.82deg, #0075FF 32.98%, #25444A 51.29%);
  transform: rotate(24deg);
  filter: blur(90px);
  border-radius: 300px;
  opacity: 0.75;
}

@media (min-width: 960px) {
  .light-1 {
    width: 400px;
    height: 400px;
    top: -100px;
  }

  .light-2 {
    transform: rotate(-15deg);
  }

  .light-3,
  .light-4 {
    display: block;
  }
}
</style>
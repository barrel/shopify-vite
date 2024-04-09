<template>
  <div class="light-wrapper">
    <div class="light-1"></div>
    <div class="light-2"></div>
    <div class="light-3"></div>
    <div class="light-4"></div>
  </div>
</template>

<style scoped>
.light-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
}

.light-1 {
  position: absolute;
  width: 300px;
  height: 300px;
  top: -50px;
  left: -50px;
  background-color: rgba(255, 255, 255, 0.15);
  filter: blur(90px);
}

.light-2 {
  position: absolute;
  width: 800px;
  height: 2000px;
  bottom: -500px;
  left: -500px;
  background: linear-gradient(238.82deg, #0075FF 32.98%, #25444A 51.29%);
  transform: rotate(-24deg);
  filter: blur(90px);
}

.light-3 {
  display: none;
  position: absolute;
  width: 400px;
  height: 400px;
  top: 400px;
  right: -200px;
  background-color: rgba(255, 255, 255, 0.15);
  filter: blur(150px);
}

.light-4 {
  position: absolute;
  width: 800px;
  height: 2000px;
  bottom: -500px;
  right: -500px;
  background: linear-gradient(238.82deg, #0075FF 32.98%, #25444A 51.29%);
  transform: rotate(24deg);
  filter: blur(90px);
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
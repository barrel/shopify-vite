<script setup lang="ts">
import BrandButtons from './BrandButtons.vue'
</script>

<template>
  <div class="VPHero has-image">
    <div class="container">
      <h1 class="hero-heading">
        Vite integration for Shopify themes by <a href="https://barrelny.com">Barrel</a>.
      </h1>
      <div class="hero-text">
        Experience seamless integration and optimal configurations.
        Boost both development and production with a single snippet.
      </div>
      <BrandButtons />
    </div>
  </div>
</template>

<style scoped>
.VPHero {
  margin-top: calc((var(--vp-nav-height) + var(--vp-layout-top-height, 0px)) * -1);
  padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 48px) 24px 129px;
}

@media (min-width: 640px) {
  .VPHero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 48px 215px;
  }
}

@media (min-width: 960px) {
  .VPHero {
    padding: calc(var(--vp-nav-height) + var(--vp-layout-top-height, 0px) + 80px) 64px 215px;
  }
}

.container {
  margin: 0 auto;
  max-width: 1152px;
  text-align: left;
}

.hero-heading {
  font-family: var(--vp-font-family-heading);
  font-size: 40px;
  line-height: 1.2;
  letter-spacing: -0.04em;
  max-width: 926px;
}

.hero-heading a {
  text-decoration: underline;
  text-decoration-thickness: from-font;
  text-underline-offset: 4px;
}

.hero-text {
  margin-top: 12px;
  font-size: 18px;
  line-height: 1.45;
  max-width: 680px;
}

.brand-buttons {
  margin-top: 28px;
}

@media (min-width: 960px) {
  .hero-heading {
    font-size: 75px;
    line-height: 1.1;
  }

  .hero-text {
    font-size: 24px;
    line-height: 1.45;
    margin-top: 22px;
  }

  .brand-buttons {
    flex-direction: row;
    gap: 15px;
  }
}
</style>

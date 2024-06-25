<script setup lang="ts">
import BrandButtons from './BrandButtons.vue'
</script>

<template>
  <div class="home-callout">
    <div class="container">
      <div class="home-callout-text">
        Upgrade your Shopify theme with Volt - Shopify Vite Plugin
      </div>
      <BrandButtons />
    </div>
  </div>
</template>

<style scoped>
.home-callout {
  padding: 90px 24px 80px;
}

.container {
  margin: 0 auto;
  max-width: 1152px;
  text-align: left;
}

.home-callout-text {
  font-family: var(--vp-font-family-heading);
  font-size: 27px;
  line-height: 1.45;
  letter-spacing: -0.04em;
  text-align: center;
  max-width: 650px;
  margin-left: auto;
  margin-right: auto;
}

.brand-buttons {
  margin-top: 40px;
  align-items: center;
}

@media (min-width: 680px) {
  .home-callout {
    padding-left: 48px;
    padding-right: 48px;
  }

  .home-callout-text {
    font-size: 40px;
  }

  .brand-buttons {
    flex-direction: row;
    justify-content: center;
    margin-top: 24px;
  }
}

@media (min-width: 960px) {
  .home-callout {
    padding-top: 154px;
    padding-bottom: 157px;
  }

  .home-callout-text {
    font-size: 48px;
  }
}
</style>

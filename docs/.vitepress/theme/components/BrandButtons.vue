<script setup>
import LinkIcon from './LinkIcon.vue'
</script>

<template>
  <div class="brand-buttons">
    <div>
      <a
        class="brand-button brand-button--github"
        href="https://github.com/barrel/shopify-vite"
        target="_blank"
      >
        View on GitHub
        <LinkIcon />
      </a>
    </div>
    <div>
      <a
        class="brand-button brand-button--primary"
        href="/guide/"
      >
        Get Started
      </a>
    </div>
  </div>
</template>
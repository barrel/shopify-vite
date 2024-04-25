<script setup lang="ts">
import { useData } from "vitepress";

const data = useData();
const nav = data.site.value?.themeConfig?.nav || [];
const socialLinks = data.site.value?.themeConfig?.socialLinks || [];
</script>

<template>
  <div class="footer">
    <div class="container">
      <div class="footer__logo">
        <img src="/logo-footer.svg" alt="Shopify Vite Plugin" />
      </div>
      <div class="footer__nav">
        <ul class="footer-nav__list">
          <template v-for="item in nav">
            <li class="footer-nav__item">
              <a :href="item.link" class="footer-nav__link">
                {{ item.text }}
              </a>
            </li>
          </template>
        </ul>
      </div>
      <div class="footer__copyright">
        Released under the MIT License.<br />
        Made with ❤️ by <a href="https://barrelny.com" target="_blank">Barrel</a>
      </div>

      <div class="footer__social">
        <ul class="footer-social__list">
          <template v-for="item in socialLinks">
            <li class="footer-social__item">
              <a :href="item.link" target="_blank">
                <img :src="`/${item.icon}.svg`" :alt="item.icon" />
              </a>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.footer {
  padding: 24px;
}

.container {
  margin: 0 auto;
  max-width: calc(var(--vp-layout-max-width) - 64px);
  text-align: left;
  display: grid;
  gap: 30px;
}

.footer__logo img {
  max-width: 250px;
}

.footer-nav__list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer-nav__link {
  font-family: var(--vp-font-family-heading);
  font-size: 27px;
  line-height: 1.45;
  letter-spacing: -0.04em;
}

.footer-nav__link:hover {
  color: var(--vp-c-brand-lighter);
}

.footer__copyright {
  font-size: 16px;
  line-height: 1.45;
}

.footer__copyright a {
  text-decoration: underline;
}

.footer__copyright a:hover {
  color: var(--vp-c-brand-lighter);
}

.footer-social__list {
  display: flex;
  justify-content: space-between;
  max-width: 326px;
}

.footer-social__item img {
  width: 34px;
}

@media (min-width: 640px) {
  .footer {
    padding: 32px;
  }
}

@media (min-width: 960px) {
  .footer {
    padding-bottom: 50px;
  }

  .container {
    grid-template-columns: max(360px, 40%) 1fr 1fr;
    column-gap: 10px;
    row-gap: 50px;
  }

  .footer__logo img {
    max-width: 300px;
  }

  .footer__copyright {
    margin-left: auto;
  }

  .footer__social {
    grid-column: 2;
  }

  .footer-social__list {
    max-width: 220px;
  }
}

@media (min-width: 1280px) {
  .container {
    grid-template-columns: 50% 1fr 1fr;
    row-gap: 80px;
  }

  .footer__logo img {
    max-width: 478px;
  }

  .footer-nav__link {
    font-weight: 500;
  }

  .footer-social__list {
    max-width: 290px;
  }
}
</style>

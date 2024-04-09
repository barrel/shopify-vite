<template>
  <div class="about-barrel">
    <div class="about-barrel__heading">
      About the developers:
      <img class="barrel-icon" src="/barrel-icon.svg" alt="Barrel" />
    </div>

    <div class="about-barrel__content">
      <p>
        The Shopify Vite Plugin was developed by Barrel.<br />
        Barrel partners with brands to design, build, and optimize web experiences.
      </p>

      <p>
        <a href="https://barrelny.com" target="_blank">Learn more about Barrel</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-barrel {
  background-color: rgba(29, 29, 32, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 20px;
  padding: 33px 40px 66px 26px;
  width: calc(100% - 48px);
  margin-left: auto;
  margin-right: auto;
}

.about-barrel__heading {
  font-size: 18px;
  line-height: 1.45;
  margin-bottom: 30px;
  white-space: nowrap;
}

.barrel-icon {
  display: block;
  margin-top: 8px;
  width: 111px;
}

.about-barrel__content {
  font-size: 14px;
  line-height: 1.45;
  max-width: 460px;
}

.about-barrel__content p + p {
  margin-top: 20px;
}

@media (min-width: 680px) {
  .about-barrel {
    width: calc(100% - 96px);
    max-width: 1152px;
    padding-bottom: 33px;
  }
}

@media (min-width: 960px) {
  .about-barrel {
    padding: 36px 80px 20px;
    display: flex;
  }

  .about-barrel__heading {
    margin-bottom: 0;
  }

  .about-barrel__content {
    margin-left: 25%;
  }
}
</style>
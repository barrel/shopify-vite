import { h  } from 'vue'
import Theme from 'vitepress/theme'
import Lights from './components/Lights.vue'
import HomeHero from './components/HomeHero.vue'
import HomeFeaturesBottom from './components/HomeFeaturesBottom.vue'
import './styles/vars.css'

export default {
  ...Theme,
  Layout () {
    return h(Theme.Layout, null, {
      'layout-top': () => h(Lights),
      'home-hero-after': () => h(HomeHero),
      'home-features-after': () => h(HomeFeaturesBottom),
    })
  }
}

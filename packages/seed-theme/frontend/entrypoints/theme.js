/**
 * Theme.js
 */

import '../styles/theme.css'

/* Modules */
import '../../modules/background-video/background-video'
import '../../modules/cart/cart'
import '../../modules/cart-item/cart-item'
import '../../modules/hero-slider/hero-slider'
import '../../modules/product-form/product-form'
import '../../modules/product-gallery/product-gallery'
import '../../modules/product-grid-toggle/product-grid-toggle'

import('../scripts/dynamic-thing').then((mod) => {
  console.log('done!')
})

import imageUrl from '../assets/images/img2.png?url'
console.log({ imageUrl })

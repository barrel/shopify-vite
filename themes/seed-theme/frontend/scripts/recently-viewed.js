import Cookies from 'cookies-js'
import _ from 'lodash'

const COOKIE_NAME = 'recently_viewed'
const EXPIRE_TIME = 60 * 60 * 24 * 7 // set cookie expire time to 7 days
const MAX_LIMIT = 10

// Add a product handle to the list of recently-viewed products
export const setRecentlyViewed = (handle) => {
  let recentlyViewed = getRecentlyViewed()
  // Remove current product if it exists
  recentlyViewed = _.filter(recentlyViewed, (h) => h !== handle)
  // Push new product to start of list
  recentlyViewed.unshift(handle)

  const newCookieValue = recentlyViewed.slice(0, MAX_LIMIT).join('|')

  Cookies.set(COOKIE_NAME, newCookieValue, { expires: EXPIRE_TIME })
}

// Load and parse cookie to return array of recently-viewed product handles
export const getRecentlyViewed = () => {
  const cookieValue = Cookies.get(COOKIE_NAME) || ''

  return cookieValue.length ? cookieValue.split('|') : []
}

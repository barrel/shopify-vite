import Cookies from 'cookies-js'
import _ from 'lodash'

const COOKIE_NAME = 'recently_viewed'
const EXPIRE_TIME = 60 * 60 * 24 * 7 // set cookie expire time to 7 days

export const setRecentlyViewed = (handle) => {
  let recentlyViewed = getRecentlyViewed()

  recentlyViewed = _.filter(recentlyViewed, (h) => h !== handle)
  recentlyViewed.push(handle)

  const newCookieValue = recentlyViewed.slice(-5).join('|')

  Cookies.set(COOKIE_NAME, newCookieValue, { expires: EXPIRE_TIME })
}

export const getRecentlyViewed = () => {
  const cookieValue = Cookies.get(COOKIE_NAME) || ''

  return cookieValue.length ? cookieValue.split('|') : []
}

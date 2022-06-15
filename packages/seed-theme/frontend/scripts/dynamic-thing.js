console.log('hi!')

import('lodash').then((module) => {
  console.log(module)
  console.log(import.meta.url)
})

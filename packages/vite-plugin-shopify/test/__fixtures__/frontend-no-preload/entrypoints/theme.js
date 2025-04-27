import('../foo.js')
  .then(({ default: foo }) => {
    console.log(foo)
  })
  .catch((err) => {
    console.error(err)
  })

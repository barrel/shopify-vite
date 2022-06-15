class BackgroundVideo extends HTMLElement {
  constructor () {
    super()

    this.video = this.querySelector('video')
    this.pauseButton = this.querySelector('background-video-pause-button')

    this.video.addEventListener('canplay', () => {
      this.video.classList.remove('opacity-0')
    })
  }

  pause () {
    this.video.pause()
    this.pauseButton.setAttribute('data-playing', 'false')
    this.pauseButton.setAttribute('aria-label', this.pauseButton.getAttribute('data-play'))
  }

  resume () {
    this.video.play()
    this.pauseButton.setAttribute('data-playing', 'true')
    this.pauseButton.setAttribute('aria-label', this.pauseButton.getAttribute('data-pause'))
  }
}

customElements.define('background-video', BackgroundVideo)

class BackgroundVideoPauseButton extends HTMLElement {
  constructor () {
    super()

    this.bgVideo = this.closest('background-video')

    this.addEventListener('click', () => {
      if (!this.bgVideo.video.paused) {
        this.bgVideo.pause()
      } else {
        this.bgVideo.resume()
      }
    })
  }
}

customElements.define('background-video-pause-button', BackgroundVideoPauseButton)

/**
 * 产生粒子背景
 */
function particle(colorsArr = ['69,183,135', '240,74,58', '14,176,201', '250,211,55', '154,190,175', '238,72,99', '147,181,207', '210,118,163']) {
  const colors = colorsArr
  // const colors =
  // const doc = document
  // const rootEl = doc.documentElement
  // const body = doc.body
  // /* global ScrollReveal */
  // // const sr = window.sr = ScrollReveal({ mobile: false })

  // rootEl.classList.remove('no-js')
  // rootEl.classList.add('js')

  // window.addEventListener('load', function() {
  //   body.classList.add('is-loaded')
  // })

  // Reveal animations
  // function revealAnimations() {
  //   sr.reveal('.feature-extended .device-mockup', {
  //     duration: 600,
  //     distance: '100px',
  //     easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  //     origin: 'bottom',
  //     viewFactor: 0.6
  //   })
  //   sr.reveal('.feature-extended .feature-extended-body', {
  //     duration: 600,
  //     distance: '40px',
  //     easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  //     origin: 'top',
  //     viewFactor: 0.6
  //   })
  // }

  // if (body.classList.contains('has-animations')) {
  //   // window.addEventListener('load', revealAnimations)
  // }

  // Particle animation
  const Bubble = function(parentNode) {
    const self = this
    self.parentNode = parentNode
    self.getCanvasSize()
    window.addEventListener('resize', function() {
      self.getCanvasSize()
    })
    self.mouseX = 0
    self.mouseY = 0
    window.addEventListener('mousemove', function(e) {
      self.mouseX = e.clientX
      self.mouseY = e.clientY
    })
    self.randomise()
  }

  Bubble.prototype.getCanvasSize = function() {
    const self = this
    self.canvasWidth = self.parentNode.clientWidth
    self.canvasHeight = self.parentNode.clientHeight
  }

  Bubble.prototype.generateDecimalBetween = function(min, max) {
    return (Math.random() * (min - max) + max).toFixed(2)
  }

  Bubble.prototype.update = function() {
    const self = this
    self.translateX = self.translateX - self.movementX
    self.translateY = self.translateY - self.movementY
    self.posX += ((self.mouseX / (self.staticity / self.magnetism)) - self.posX) / self.smoothFactor
    self.posY += ((self.mouseY / (self.staticity / self.magnetism)) - self.posY) / self.smoothFactor

    if (self.translateY + self.posY < 0 || self.translateX + self.posX < 0 || self.translateX + self.posX > self.canvasWidth) {
      self.randomise()
      self.translateY = self.canvasHeight
    }
  }

  Bubble.prototype.randomise = function() {
    const self = this
    // self.colors = ['85,107,139', '38,141,247', '66,52,248', '255,108,80', '243, 244, 255', '96, 100, 131']
    self.colors = colors
    self.velocity = 30 // Bubble levitation velocity (the higher the slower)
    self.smoothFactor = 50 // The higher, the smoother
    self.staticity = 30 // Increase value to make bubbles move slower on mousemove
    self.magnetism = 0.1 + Math.random() * 4
    self.color = self.colors[Math.floor(Math.random() * self.colors.length)]
    self.alpha = self.generateDecimalBetween(5, 10) / 10
    self.size = self.generateDecimalBetween(1, 4)
    self.posX = 0
    self.posY = 0
    self.movementX = self.generateDecimalBetween(-2, 2) / self.velocity
    self.movementY = self.generateDecimalBetween(1, 20) / self.velocity
    self.translateX = self.generateDecimalBetween(0, self.canvasWidth)
    self.translateY = self.generateDecimalBetween(0, self.canvasHeight)
  }

  const Background = function(selector) {
    const self = this
    self.canvas = document.getElementById(selector)
    self.ctx = this.canvas.getContext('2d')
    self.dpr = window.devicePixelRatio
  }

  Background.prototype.start = function() {
    const self = this
    self.canvasSize()
    window.addEventListener('resize', function() {
      self.canvasSize()
    })
    self.bubblesList = []
    self.generateBubbles()
    self.animate()
  }

  Background.prototype.canvasSize = function() {
    const self = this
    self.container = self.canvas.parentNode
    // Determine window width and height
    self.w = self.container.offsetWidth
    self.h = self.container.offsetHeight
    self.wdpi = self.w * self.dpr
    self.hdpi = self.h * self.dpr
    // Set canvas width and height
    self.canvas.width = self.wdpi
    self.canvas.height = self.hdpi
    // Set width and height attributes
    self.canvas.style.width = self.w + 'px'
    self.canvas.style.height = self.h + 'px'
    // Scale down canvas
    self.ctx.scale(self.dpr, self.dpr)
  }

  Background.prototype.animate = function() {
    const self = this
    self.ctx.clearRect(0, 0, self.canvas.clientWidth, self.canvas.clientHeight)
    self.bubblesList.forEach(function(bubble) {
      bubble.update()
      self.ctx.translate(bubble.translateX, bubble.translateY)
      self.ctx.beginPath()
      self.ctx.arc(bubble.posX, bubble.posY, bubble.size, 0, 2 * Math.PI)
      self.ctx.fillStyle = 'rgba(' + bubble.color + ',' + bubble.alpha + ')'
      self.ctx.fill()
      self.ctx.setTransform(self.dpr, 0, 0, self.dpr, 0, 0)
    })
    /* global requestAnimationFrame */
    requestAnimationFrame(this.animate.bind(this))
  }

  Background.prototype.addBubble = function(bubble) {
    return this.bubblesList.push(bubble)
  }

  Background.prototype.generateBubbles = function() {
    const self = this
    for (let i = 0; i < self.bubbleDensity(); i++) {
      self.addBubble(new Bubble(self.canvas.parentNode))
    }
  }

  Background.prototype.bubbleDensity = function() { // 气泡密度
    return 18
  }

  // window.addEventListener('load', function() {
  const heroParticles = new Background('bg-particles') // 传入canvas的id
  // const footerParticles = new Background('footer-particles')
  heroParticles.start()
  // footerParticles.start()
  // })

  window.requestAnimFrame = (function() {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60)
      }
    )
  })()
}
export default particle

// Set the scratch color here (hex string, e.g. '#800020')
const SCRATCH_COLOR = '#fff';
// Set to true for transparent scratch (reveals immediately)
const SCRATCH_TRANSPARENT = true;

// Path to the scratch image
const SCRATCH_IMAGE = "/assets/rose.png";

// Optional: Set custom scaling for the scratch image (set to null to use canvas size)
// Example: { scale: 0.8 } or { width: 200, height: 100 }
const SCRATCH_IMAGE_SCALE = { scale: 0.4 }; // or { scale: 0.8 } or { width: 200, height: 100 }

class ScratchCard {
  constructor (cardElement) {
  this.cardElement = cardElement;
  this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  this.cover = cardElement.querySelector('.scratch-card-cover');
  this.canvasRender = cardElement.querySelector('.scratch-card-canvas-render');
  this.coverContainer = cardElement.querySelector('.scratch-card-cover-container');
  this.text = cardElement.querySelector('.scratch-card-text');
  this.image = cardElement.querySelector('.scratch-card-image');
  this.canvas = cardElement.querySelector('canvas');
  this.context = this.canvas.getContext('2d');
  
  // 1. Handle High DPI (Retina) scaling
  this.devicePixelRatio = window.devicePixelRatio || 1;
  this.canvasWidth = this.canvas.offsetWidth;
  this.canvasHeight = this.canvas.offsetHeight;
  
  // Set the internal resolution (drawing surface)
  this.canvas.width = this.canvasWidth * this.devicePixelRatio;
  this.canvas.height = this.canvasHeight * this.devicePixelRatio;
  
  // Scale the context so drawing commands use CSS pixel coordinates
  this.context.scale(this.devicePixelRatio, this.devicePixelRatio);
  
  this.positionX = null;
  this.positionY = null;
  this.clearDetectionTimeout = null;
  this.setImageTimeout = null;

  if (this.isSafari) {
    this.canvas.classList.add('hidden');
  }

  if (SCRATCH_TRANSPARENT) {
    this.context.globalCompositeOperation = 'source-over';
    if (this.cover) this.cover.style.display = 'none';

    const goldImg = new window.Image();
    goldImg.src = SCRATCH_IMAGE;
    goldImg.onload = () => {
      // 2. STRETCH FIX: Use the CSS dimensions to fill the context 
      // The context.scale() handled above ensures this fills the high-res surface.
      this.context.drawImage(goldImg, 0, 0, this.canvasWidth, this.canvasHeight);
    };

    goldImg.onerror = () => {
      this.context.fillStyle = SCRATCH_COLOR;
      this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    };
  }
  this.initEvents();
}

  initEvents() {
    this.canvas.addEventListener('pointerdown', (e) => {
      this.cover.classList.remove('shine');
      ({ x: this.positionX, y: this.positionY } = this.getPosition(e));
      clearTimeout(this.clearDetectionTimeout);
      this.canvas.addEventListener('pointermove', this.plot);
      window.addEventListener('pointerup', (e) => {
        this.canvas.removeEventListener('pointermove', this.plot);
        this.clearDetectionTimeout = setTimeout(() => {
          this.checkFillPercentage();
        }, 500);
      }, { once: true });
    });
    this.plot = this.plot.bind(this);
  }

  getPosition({ clientX, clientY }) {
    const { left, top } = this.canvas.getBoundingClientRect();
    return {
      x: clientX - left,
      y: clientY - top,
    };
  }

  plotLine(x1, y1, x2, y2) {
    var diffX = Math.abs(x2 - x1);
    var diffY = Math.abs(y2 - y1);
    var dist = Math.sqrt(diffX * diffX + diffY * diffY);
    var step = dist / 50;
    var i = 0;
    var t;
    var x;
    var y;
    if (SCRATCH_TRANSPARENT) {
      this.context.globalCompositeOperation = 'destination-out';
      this.context.fillStyle = 'rgba(0,0,0,1)';
    } else {
      this.context.globalCompositeOperation = 'source-over';
      this.context.fillStyle = SCRATCH_COLOR;
    }
    while (i < dist) {
      t = Math.min(1, i / dist);
      x = x1 + (x2 - x1) * t;
      y = y1 + (y2 - y1) * t;
      this.context.beginPath();
      this.context.arc(x, y, 16, 0, Math.PI * 2);
      this.context.fill();
      i += step;
    }
    // Reset composite mode after drawing
    this.context.globalCompositeOperation = 'source-over';
  }

  setImageFromCanvas() {
    this.canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      let previousUrl = this.canvasRender.src;
      this.canvasRender.src = url;
      if (!previousUrl) {
        this.canvasRender.classList.remove('hidden');
      } else {
        URL.revokeObjectURL(previousUrl);
      }
      previousUrl = url;
    });
  }

  plot(e) {
    const { x, y } = this.getPosition(e);
    this.plotLine(this.positionX, this.positionY, x, y);
    this.positionX = x;
    this.positionY = y;
    if (this.isSafari) {
      clearTimeout(this.setImageTimeout);
      this.setImageTimeout = setTimeout(() => {
        this.setImageFromCanvas();
      }, 5);
    }
  }

  checkFillPercentage() {
    const imageData = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    const pixelData = imageData.data;
    let matchPixelCount = 0;
    if (SCRATCH_TRANSPARENT) {
      // Count transparent pixels (alpha < 32)
      for (let i = 0; i < pixelData.length; i += 4) {
        const alpha = pixelData[i + 3];
        if (alpha < 32) {
          matchPixelCount++;
        }
      }
    } else {
      // Convert hex color to RGB
      function hexToRgb(hex) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
        const num = parseInt(c, 16);
        return [
          (num >> 16) & 255,
          (num >> 8) & 255,
          num & 255
        ];
      }
      const [targetR, targetG, targetB] = hexToRgb(SCRATCH_COLOR);
      const tolerance = 10;
      for (let i = 0; i < pixelData.length; i += 4) {
        const red = pixelData[i];
        const green = pixelData[i + 1];
        const blue = pixelData[i + 2];
        const alpha = pixelData[i + 3];
        if (
          Math.abs(red - targetR) <= tolerance &&
          Math.abs(green - targetG) <= tolerance &&
          Math.abs(blue - targetB) <= tolerance &&
          alpha === 255
        ) {
          matchPixelCount++;
        }
      }
    }
    const fillPercentage = matchPixelCount * 100 / (this.canvasWidth * this.canvasHeight);
    if (fillPercentage >= 25) {
      this.coverContainer.classList.add('clear');
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: {
            y: this.text ? (this.text.getBoundingClientRect().bottom + 60) / window.innerHeight : 0.5,
          },
        });
      }
      if (this.text) this.text.textContent = '';
      if (this.image) this.image.classList.add('animate');
      this.coverContainer.addEventListener('transitionend', () => {
        this.coverContainer.classList.add('hidden');
      }, { once: true });
    }
  }
}

document.querySelectorAll('.scratch-card').forEach(card => {
  new ScratchCard(card);
});
var $ = require('jquery');

// Constants
var GRAVITY = 1;
var X_SPREAD = 60;
var ASPECT_RATIO = 3/2; // width/height
var SIZE_MIN = 100;
var SIZE_VARIANCE = 20;
var ROT_MAX = 30;

// A popcorn kernel
function Kernel() {
  // Defaults
  this.rot = 0;
  this.vx = (Math.random() * X_SPREAD) - (X_SPREAD/2);
  this.vy = (Math.random() * -20) - 30;
  this.rotacc = (Math.random() * ROT_MAX) - (ROT_MAX/2);
  var size = (Math.random() * SIZE_VARIANCE) + SIZE_MIN;
  this.width = size * ASPECT_RATIO;
  this.height = size * 1/ASPECT_RATIO;
  this.x = $('body').width()/2;
  this.y = 0;

  // Create the element
  this.$el = $('<img src="img/popcornkern.svg"/>')
    .addClass('kernel')
    .width(this.width)
    .height(this.height);

  // Update the position
  this.update();
}

// Update the UI
Kernel.prototype.update = function () {
  // Update the physics
  this.vy += GRAVITY;
  this.x += this.vx;
  this.y += this.vy;
  this.rot += this.rotacc;
  this.$el.css('bottom', -this.y - this.height);
  this.$el.css('left', this.x - this.width/2);
  this.$el.css('transform', 'rotate(' + this.rot + 'deg)');
};

module.exports = Kernel;
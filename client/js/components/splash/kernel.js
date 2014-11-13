var $ = require('jquery');

// Constants
var GRAVITY = 1;

// A popcorn kernel
function Kernel() {
  // Defaults
  this.rot = 0;
  this.vx = 0;
  this.vy = 0;
  this.x = 0;
  this.y = 0;
  this.$el = $('<img src="img/popcornkern.svg"/>').addClass('kernel');
  this.update();
}

// Update the UI
Kernel.prototype.update = function () {
  // Update the physics
  this.vy += GRAVITY;
  this.x += this.vx;
  this.y += this.vy;
  this.rot += 1;
};

module.exports = Kernel;
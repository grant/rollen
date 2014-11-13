var $ = require('jquery');
var Kernel = require('../components/splash/kernel');
var raf = require('raf');

var CREATE_POPCORN_SPEED = 3; // frames

$(function () {
  // Setup
  var time = 0;
  var $kernels = $('.popcorn-kernels');
  var kernels = [];

  function createKernel () {
    var kernel = new Kernel();

    // Add to DOM
    $kernels.append(kernel.$el);

    // Add to kernel list
    kernels.push(kernel);
  }

  function updateKernels () {
    // Only update if the current tab is active
    for (var i = kernels.length - 1; i >= 0; --i) {
      var kernel = kernels[i];
      kernel.update();

      // Remove kernel if off screen
      if (kernel.y > kernel.height) {
        kernel.remove();
        kernels.splice(i, 1);
      }
    }

    // Kernel time
    ++time;
    if (time % CREATE_POPCORN_SPEED === 0) {
      createKernel();
    }
  }

  // Request animation frame
  raf(function tick () {
    raf(tick);
    updateKernels();
  });
});
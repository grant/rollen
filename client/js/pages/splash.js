var $ = require('jquery');
var Kernel = require('../components/splash/kernel');
var raf = require('raf');

var CREATE_POPCORN_SPEED = 400; // ms

$(function () {
  // Setup
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
    for (var i = kernels.length - 1; i >= 0; --i) {
      var kernel = kernels[i];
      kernel.update();

      // Remove kernel if off screen
      if (kernel.y > kernel.height) {
        kernel.remove();
        kernels.splice(i, 1);
      }
    }
  }

  // Request animation frame
  raf(function tick () {
    raf(tick);
    updateKernels();
  });
  setInterval(createKernel, CREATE_POPCORN_SPEED);
});
var $ = require('jquery');
var Kernel = require('../components/splash/kernel');

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
    for (var i in kernels) {
      var kernel = kernels[i];
      kernel.update();
    }
  }

  createKernel();
  setInterval(updateKernels, 30);
  // setInterval(createKernel, 100);
});
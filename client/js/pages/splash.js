var $ = require('jquery');

$(function () {
  // Setup
  var $kernels = $('.popcorn-kernels');
  var kernels = [];

  function createKernel () {
    var $kernel = $('<img src="img/popcornkern.svg"/>').addClass('kernel');
    $kernels.css('transform', 'scale(0.2) rotate(33.2deg)');
    // $kernels.css('transform', '');
    $kernels.append($kernel);
  }

  createKernel();
});
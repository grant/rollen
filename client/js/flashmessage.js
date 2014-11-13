function FlashMessage(domId, delayTime) {
    var self = this;
    var element = document.getElementById(domId);
    var delay = delayTime;
    var isFlashing = false;

    self.setMessage = function(str) {
        element.innerHTML = str;
    };

    self.flash = function(callback) {
        if(!isFlashing) {
            isFlashing = true;
            $(element).fadeIn('slow').delay(delay).fadeOut('slow', function() {
                isFlashing = false;
                if(callback) {
                    callback();
                }
            });
        }
    };
}

module.exports = FlashMessage;
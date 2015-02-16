var optimizedResize = function ($window, $timeout) {
    var callbacks = [];
    var running = false;

    var timeout = $window.requestAnimationFrame ||
        function (callback) {
            return $timeout(callback, 66, false);
        };

    return {
        add: function (callback) {
            if (callback) {
                if (callbacks.length === 0) {
                    window.addEventListener('resize', resize);
                }
                callbacks.push(callback);
            }
        }
    };

    function resize() {
        if (!running) {
            running = true;
            timeout(runCallbacks);
        }
    }

    // run the actual callbacks
    function runCallbacks() {
        callbacks.forEach(function (callback) {
            callback();
        });

        running = false;
    }
};

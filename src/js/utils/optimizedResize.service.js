/*
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
*/

class OptimizedResize {
    constructor($window, $timeout) {
        this.window = $window;
        this.timeout = $window.requestAnimationFrame || (callback => $timeout(callback, 66, false));

        this.callbacks = [];
        this.running = false;
    }

    add(callback) {
        if (!callback) {
            return;
        }

        if (this.callbacks.length === 0) {
            this.window.addEventListener('resize', () => this.resize());
        }

        this.callbacks.push(callback);
    }

    resize() {
        if (!this.running) {
            this.running = true;
            this.timeout(() => this.runCallbacks);
        }
    }

    runCallbacks() {
        this.callbacks.forEach(callback => callback());
        this.running = false;
    }
}

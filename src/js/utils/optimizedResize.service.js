class OptimizedResize {
    constructor($window, $timeout) {
        this.window = $window;
        this.$timeout = $timeout;

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
            this.timeout(() => this.runCallbacks());
        }
    }

    runCallbacks() {
        this.callbacks.forEach(callback => callback());
        this.running = false;
    }
    
    timeout(callback) {
        this.window.requestAnimationFrame
            ? this.window.requestAnimationFrame(callback)
            : this.$timeout(callback, 66, false);
    }
}

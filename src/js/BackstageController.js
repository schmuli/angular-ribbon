function BackstageController() {
    this.opened = false;
}

Object.defineProperties(BackstageController.prototype, {
    open: {
        value: function () {
            this.opened = true;
        }
    },
    close: {
        value: function () {
            this.opened = false;
        }
    }
});

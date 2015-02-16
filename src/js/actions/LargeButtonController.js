function LargeButtonController() {
}

Object.defineProperties(LargeButtonController.prototype, {
    setCommand: {
        value: function (command) {
            this.command = command;
        }
    },
    visible: {
        get: function () {
            return !!this.command && (!this.command.hasOwnProperty('visible') || this.command.visible);
        }
    },
    disabled: {
        get: function () {
            return !!this.command && this.command.disabled;
        }
    },
    title: {
        get: function () {
            return !!this.command ? this.command.title : '';
        }
    },
    image: {
        get: function () {
            return !!this.command ? this.command.image : '';
        }
    },
    execute: {
        value: function () {
            if (this.command.action) {
                this.command.action(this.command.title);
            }
        }
    }
});

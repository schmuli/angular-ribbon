/*
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
*/

class LargeButtonController {
    setCommand(command) {
        this.command = command;
    }

    visible() {
        return !!this.command && (!this.command.hasOwnProperty('visible') || this.command.visible);
    }

    disabled() {
        return !!this.command && this.command.disabled;
    }

    title() {
        return !!this.command ? this.command.title : '';
    }

    image() {
        return !!this.command ? this.command.image : '';
    }

    execute() {
        if (this.command.action) {
            this.command.action(this.command.title);
        }
    }
}

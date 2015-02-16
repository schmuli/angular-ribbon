function PopupButtonController(scope, actions) {
    this.scope = scope;
    this.actions = actions;
}

PopupButtonController.prototype = Object.create(LargeButtonController.prototype);

Object.defineProperties(PopupButtonController.prototype, {
    setCommand: {
        value: function (command, popupUrl) {
            LargeButtonController.prototype.setCommand.call(this, command);
            this.popupUrl = popupUrl;
        }
    },
    opened: {
        get: function () {
            return this.visible && !this.disabled && this._opened;
        }
    },
    open: {
        value: function (e) {
            e.stopPropagation();

            if (!this.popupUrl) {
                return;
            }

            if (this._opened) {
                this._opened = false;
                return;
            }

            this.actions.open(this, this.command.autoClose !== false);
        }
    },
    close: {
        value: function (digest) {
            this._opened = false;
            if (digest) {
                this.scope.$digest();
            }
        }
    }
});


class PopupButtonController extends LargeButtonController {
    constructor(scope, actions) {
        this.scope = scope;
        this.actions = actions;

        this._opened = false;
    }

    setCommand(command, popupUrl) {
        super.setCommand(command);
        this.popupUrl = popupUrl;
    }

    opened() {
        return this.visible && !this.disabled && this._opened;
    }

    open(e) {
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

    close(digest) {
        this._opened = false;
        if (digest) {
            this.scope.$digest();
        }
    }
}

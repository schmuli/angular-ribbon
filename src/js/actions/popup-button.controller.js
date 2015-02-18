import { LargeButtonController } from './large-button.controller';

export class PopupButtonController extends LargeButtonController {
    get opened() {
        return this.visible && !this.disabled && this._opened;
    }

    constructor(scope, actions) {
        this.scope = scope;
        this.actions = actions;

        this._opened = false;
    }

    setCommand(command, popupUrl) {
        super.setCommand(command);
        this.popupUrl = popupUrl;
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

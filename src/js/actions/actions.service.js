class Actions {
    constructor($document, ribbonEvents) {
        this.$document = $document;

        this.globalClose = this.globalClose.bind(this);

        ribbonEvents.on('tabActivated', () => {
            this.close(false);
        });

        this.controller = null;
    }

    open(ctrl, autoClose) {
        this.close(false);

        this.controller = ctrl;
        this.controller._opened = true;

        if (autoClose) {
            this.$document.on('click', this.globalClose);
        }
    }

    globalClose() {
        this.close(true);
    }

    close(digest) {
        if (this.controller === null) {
            return;
        }

        this.controller.close(digest);
        this.controller = null;

        this.$document.off('click', this.globalClose);
    }
}

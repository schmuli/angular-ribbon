/*
var actions = function ($document, ribbonEvents) {
    var controller = null;

    ribbonEvents.on('tabActivated', function () {
        close(false);
    });

    return {
        open: function (ctrl, autoClose) {
            close(false);

            controller = ctrl;
            controller._opened = true;

            if (autoClose) {
                $document.on('click', globalClose);
            }
        }
    };

    function close(digest) {
        if (controller === null) {
            return;
        }

        controller.close(digest);
        controller = null;

        $document.off('click', globalClose);
    }

    function globalClose() {
        close(true);
    }
};
*/

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
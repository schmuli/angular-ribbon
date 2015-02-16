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

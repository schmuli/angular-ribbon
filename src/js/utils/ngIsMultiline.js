var ngIsMultilineDirective = function ($timeout, ribbonEvents) {
    return function link(scope, element) {
        setupCheck({
            el: element[0],
            off: null,
            scope: scope
        });
    };

    function setupCheck(params) {
        $timeout(function () {
            check(params);
        }, 0, false);
    }

    function check(params) {
        if (params.el.offsetParent === null) {
            wait(params);
        } else {
            if (params.off) {
                params.off();
            }
            checkMultiline(params.el);
        }
    }

    function wait(params) {
        if (!params.off) {
            params.off = ribbonEvents.on('tabActivated', function () {
                setupCheck(params);
            });
        }
    }

    function checkMultiline(el) {
        if (el.getClientRects().length > 1) {
            el.classList.add('multiline');
        }
    }
};

export var ClickHandler = function ($timeout) {
    /*
     var action = firstClick;
     var timerPromise;
     var ignoreSecondClick = false;

     function firstClick() {
     ignoreSecondClick = onClick && onClick.apply(this, arguments);

     action = secondClick;

     timerPromise = $timeout(function () {
     action = firstClick;
     }, 200);
     }

     function secondClick() {
     if (!ignoreSecondClick) {
     onDoubleClick && onDoubleClick.apply(this, arguments);
     }

     action = firstClick;
     timerPromise && $timeout.cancel(timerPromise);
     }

     return function () {
     action.apply(this, arguments);
     }
     */
    return function (onClick, onDoubleClick) {
        var clicks = 0;

        return function () {
            clicks++;

            var args = arguments;
            var _this = this;
            if (clicks === 1) {
                $timeout(function () {
                    (clicks === 1 ? onClick : onDoubleClick).apply(_this, args);
                    clicks = 0;
                }, 200);
            }
        };
    };
};

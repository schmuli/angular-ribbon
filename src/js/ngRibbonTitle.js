var ngRibbonTitleDirective = function ($document, ribbonEvents, optimizedResize) {
    return {
        scope: {
            title: '='
        },
        require: '^ngRibbon',
        templateUrl: 'ribbon-title.html',
        link: function (scope, element) {
            var titleElement = element[0].querySelector('.title');

            calculatePositionAsync(titleElement);
            optimizedResize.add(function () {
                calculatePositionAsync(titleElement);
            });
            ribbonEvents.on('tabActivated', function () {
                calculatePositionAsync(titleElement);
            });
        }
    };

    function calculatePositionAsync(titleElement) {
        setTimeout(function () {
            var left = calculatePosition(titleElement);
            if (titleElement.style.left !== left) {
                titleElement.style.left = left;
            }
        }, 0);
    }

    function calculatePosition(titleElement) {
        var currentPosition = titleElement.getBoundingClientRect();
        var left = $document[0].body.clientWidth / 2 - currentPosition.width / 2;
        titleElement.style.display = 'none';
        var overlap = document.elementFromPoint(left, currentPosition.top);
        titleElement.style.display = '';
        if (overlap && overlap.parentElement.classList.contains('contextual-group')) {
            var overlapPosition = overlap.getBoundingClientRect();
            return (overlapPosition.left + overlapPosition.width + 1) + 'px';
        } else {
            return 'calc(50% - ' + (currentPosition.width / 2) + 'px)';
        }
    }
};

angular.module('ngRibbon.utils', [])
    .factory('clickHandler', ['$timeout', ClickHandler])
    .factory('optimizedResize', ['$window', '$timeout', OptimizedResize])
    .factory('ribbonEvents', ['$rootScope', RibbonEvents])
    .directive('ngIsMultiline', ['$timeout', 'ribbonEvents', ngIsMultilineDirective]);

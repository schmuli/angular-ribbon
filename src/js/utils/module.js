angular.module('ngRibbon.utils', [])
    .factory('clickHandler', ['$timeout', ClickHandler])
    .service('optimizedResize', ['$window', '$timeout', OptimizedResize])
    .service('ribbonEvents', ['$rootScope', RibbonEvents])
    .directive('ngIsMultiline', ['$timeout', 'ribbonEvents', ngIsMultilineDirective]);

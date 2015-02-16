angular.module('ngRibbon.utils', [])
    .factory('clickHandler', ['$timeout', clickHandler])
    .factory('optimizedResize', ['$window', '$timeout', optimizedResize])
    .factory('ribbonEvents', ['$rootScope', ribbonEvents])
    .directive('ngIsMultiline', ['$timeout', 'ribbonEvents', ngIsMultilineDirective]);

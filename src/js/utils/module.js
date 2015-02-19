import { ClickHandler } from './click-handler.service';
import { OptimizedResize } from './optimized-resize.service';
import { RibbonEvents } from './ribbon-events.service';
import { isMultilineDirective } from './is-multiline.directive';

export default angular.module('ribbon.utils', [])
    .factory('clickHandler', ['$timeout', ClickHandler])
    .service('optimizedResize', ['$window', '$timeout', OptimizedResize])
    .service('ribbonEvents', ['$rootScope', RibbonEvents])
    .directive('isMultiline', ['$timeout', 'ribbonEvents', isMultilineDirective]);

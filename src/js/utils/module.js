import { ClickHandler } from './click-handler.service';
import { OptimizedResize } from './optimized-resize.service';
import { RibbonEvents } from './ribbon-events.service';
import { ngIsMultilineDirective } from './is-multiline.directive';

export default angular.module('ngRibbon.utils', [])
    .factory('clickHandler', ['$timeout', ClickHandler])
    .service('optimizedResize', ['$window', '$timeout', OptimizedResize])
    .service('ribbonEvents', ['$rootScope', RibbonEvents])
    .directive('ngIsMultiline', ['$timeout', 'ribbonEvents', ngIsMultilineDirective]);

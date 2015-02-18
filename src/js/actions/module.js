import { Actions } from './actions.service';
import { LargeButtonController } from './large-button.controller';
import { PopupButtonController } from './popup-button.controller';
import { ngLargeButtonDirective } from './large-button.directive';
import { ngSplitButtonDirective } from './split-button.directive';
import { ngDropButtonDirective } from './drop-button.directive';

export default angular.module('ngRibbon.actions', [])
    .service('actions', ['$document', 'ribbonEvents', Actions])
    .controller('LargeButtonController', [LargeButtonController])
    .controller('PopupButtonController', ['$scope', 'actions', PopupButtonController])
    .directive('ngLargeButton', [ngLargeButtonDirective])
    .directive('ngSplitButton', [ngSplitButtonDirective])
    .directive('ngDropButton', [ngDropButtonDirective]);

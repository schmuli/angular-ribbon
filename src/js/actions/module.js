import { Actions } from './actions.service';
import { LargeButtonController } from './large-button.controller';
import { PopupButtonController } from './popup-button.controller';
import { largeButtonDirective } from './large-button.directive';
import { splitButtonDirective } from './split-button.directive';
import { dropButtonDirective } from './drop-button.directive';

export default angular.module('ribbon.actions', [])
    .service('actions', ['$document', 'ribbonEvents', Actions])
    .controller('LargeButtonController', [LargeButtonController])
    .controller('PopupButtonController', ['$scope', 'actions', PopupButtonController])
    .directive('largeButton', [largeButtonDirective])
    .directive('splitButton', [splitButtonDirective])
    .directive('dropButton', [dropButtonDirective]);

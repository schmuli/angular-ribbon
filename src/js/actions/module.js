angular.module('ngRibbon.actions', [])
    .service('actions', ['$document', 'ribbonEvents', Actions])
    .controller('LargeButtonController', [LargeButtonController])
    .controller('PopupButtonController', ['$scope', 'actions', PopupButtonController])
    .directive('ngLargeButton', [ngLargeButtonDirective])
    .directive('ngSplitButton', [ngSplitButtonDirective])
    .directive('ngDropButton', [ngDropButtonDirective]);

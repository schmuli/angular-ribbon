angular.module('ngRibbon.actions', [])
    .factory('actions', ['$document', 'ribbonEvents', Actions])
    .controller('LargeButtonController', [LargeButtonController])
    .controller('PopupButtonController', ['$scope', 'actions', PopupButtonController])
    .directive('ngLargeButton', [ngLargeButtonDirective])
    .directive('ngSplitButton', [ngSplitButtonDirective])
    .directive('ngDropButton', [ngDropButtonDirective]);

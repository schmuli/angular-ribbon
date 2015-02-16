angular.module('ngRibbon.menu', [])
    .controller('RibbonMenuController', [RibbonMenuController])
    .directive('ngRibbonMenu', [ngRibbonMenuDirective])
    .directive('ngRibbonMenuItem', [ngRibbonMenuItemDirective])
    .directive('ngRibbonMenuSeparator', [ngRibbonMenuSeparatorDirective]);

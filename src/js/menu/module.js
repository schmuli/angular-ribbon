import { RibbonMenuController } from './ribbon-menu.controller';
import { ngRibbonMenuDirective } from './ribbon-menu.directive';
import { ngRibbonMenuItemDirective } from './ribbon-menu-item.directive';
import { ngRibbonMenuSeparatorDirective } from './ribbon-menu-separator.directive';

export default angular.module('ngRibbon.menu', [])
    .controller('RibbonMenuController', [RibbonMenuController])
    .directive('ngRibbonMenu', [ngRibbonMenuDirective])
    .directive('ngRibbonMenuItem', [ngRibbonMenuItemDirective])
    .directive('ngRibbonMenuSeparator', [ngRibbonMenuSeparatorDirective]);

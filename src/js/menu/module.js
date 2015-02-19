import { RibbonMenuController } from './ribbon-menu.controller';
import { ribbonMenuDirective } from './ribbon-menu.directive';
import { ribbonMenuItemDirective } from './ribbon-menu-item.directive';
import { ribbonMenuSeparatorDirective } from './ribbon-menu-separator.directive';

export default angular.module('ribbon.menu', [])
    .controller('RibbonMenuController', [RibbonMenuController])
    .directive('ribbonMenu', [ribbonMenuDirective])
    .directive('ribbonMenuItem', [ribbonMenuItemDirective])
    .directive('ribbonMenuSeparator', [ribbonMenuSeparatorDirective]);

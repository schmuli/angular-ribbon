import actions from 'actions/module';
import menu from 'menu/module';
import utils from 'utils/module';

import { DynamicRibbonProvider } from './dynamic-ribbon.service';
import { ContextualColors } from './contextual-colors.service';

import { RibbonController } from './ribbon.controller';
import { BackstageController } from './ribbon-backstage.controller';

import { ribbonDirective } from './ribbon.directive';
import { ribbonTitleDirective } from './ribbon-title.directive';
import { ribbonBackstageDirective } from './ribbon-backstage.directive';
import { ribbonBackstageContentDirective } from './ribbon-backstage-content.directive';
import { ribbonTabDirective } from './ribbon-tab.directive';
import { ribbonGroupDirective } from './ribbon-group.directive';

var dependencies = [
    'ngAnimate',
    'ribbon.templates',
    
    actions.name,
    menu.name,
    utils.name
];

angular.module('ribbon', dependencies)
    .provider('dynamicRibbon', [DynamicRibbonProvider])
    .service('contextualColors', [ContextualColors]) 
    .controller('RibbonController', ['$scope', '$element', '$document', 'ribbonEvents', 'contextualColors', 'clickHandler', RibbonController])
    .controller('BackstageController', [BackstageController])
    .directive('ribbon', ['$templateCache', 'clickHandler', 'dynamicRibbon', ribbonDirective])
    .directive('ribbonTitle', ['$document', 'ribbonEvents', 'optimizedResize', ribbonTitleDirective])
    .directive('ribbonBackstage', [ribbonBackstageDirective])
    .directive('ribbonBackstageContent', [ribbonBackstageContentDirective])
    .directive('ribbonTab', [ribbonTabDirective])
    .directive('ribbonGroup', ['$compile', 'dynamicRibbon', ribbonGroupDirective]);

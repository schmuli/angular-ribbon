import actions from 'actions/module';
import menu from 'menu/module';
import utils from 'utils/module';

import { DynamicRibbonProvider } from './dynamic-ribbon.service';
import { ContextualColors } from './contextual-colors.service';

import { RibbonController } from './ribbon.controller';
import { BackstageController } from './ribbon-backstage.controller';

import { ngRibbonDirective } from './ribbon.directive';
import { ngRibbonTitleDirective } from './ribbon-title.directive';
import { ngRibbonBackstageDirective } from './ribbon-backstage.directive';
import { ngRibbonBackstageContentDirective } from './ribbon-backstage-content.directive';
import { ngRibbonTabDirective } from './ribbon-tab.directive';
import { ngRibbonGroupDirective } from './ribbon-group.directive';

var dependencies = [
    'ngAnimate',
    'ngRibbon.templates',
    
    actions.name,
    menu.name,
    utils.name
];

angular.module('ngRibbon', ['ngAnimate', 'ngRibbon.actions', 'ngRibbon.menu', 'ngRibbon.utils', 'ngRibbon.templates'])
    .provider('dynamicRibbon', [DynamicRibbonProvider])
    .service('contextualColors', [ContextualColors]) 
    .controller('RibbonController', ['$scope', '$element', '$document', 'ribbonEvents', 'contextualColors', 'clickHandler', RibbonController])
    .controller('BackstageController', [BackstageController])
    .directive('ngRibbon', ['$templateCache', 'clickHandler', 'dynamicRibbon', ngRibbonDirective])
    .directive('ngRibbonTitle', ['$document', 'ribbonEvents', 'optimizedResize', ngRibbonTitleDirective])
    .directive('ngRibbonBackstage', [ngRibbonBackstageDirective])
    .directive('ngRibbonBackstageContent', [ngRibbonBackstageContentDirective])
    .directive('ngRibbonTab', [ngRibbonTabDirective])
    .directive('ngRibbonGroup', ['$compile', 'dynamicRibbon', ngRibbonGroupDirective]);

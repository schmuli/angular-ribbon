angular.module('ngRibbon', ['ngRibbon.menu', 'ngRibbon.utils'])
    .directive('ngRibbon', function () {
        var _backstage;
        
        function BackstageController(title) {
            this.title = title;
        }

        Object.defineProperties(BackstageController.prototype, {
            open: {
                value: function () {
                    this.isOpen = true;
                }
            },
            close: {
                value: function () {
                    this.isOpen = false;
                }
            }
        });

        function RibbonController(ribbonTabs) {
            this.ribbonTabs = ribbonTabs;
        }
        
        Object.defineProperties(RibbonController.prototype, {
            hasBackstage: {
                get: function () {
                    return !!_backstage;
                }
            },
            backstage: {
                get: function () {
                    return _backstage;
                }
            },
            setBackstage: {
                value: function (title) {
                    _backstage = new BackstageController(title);
                    return _backstage;
                }
            },
            tabs: {
                get: function () {
                    return this.ribbonTabs.tabs;
                }
            },
            contextualGroups: {
                get: function () {
                    return this.ribbonTabs.contextualGroups;
                }
            },
            addTab: {
                value: function (title, contextual) {
                    var tab = this.ribbonTabs.addTab(title, contextual);
                    if (tab.active) {
                        this.activeTab = tab;
                    }
                }
            },
            activate: {
                value: function (tab) {
                    if (this.activeTab) {
                        this.activeTab.active = false;
                        this.activeTab = null;
                    }

                    this.activeTab = tab;
                    this.activeTab.active = true;
                }
            }
        });

        return {
            scope: {
                title: '='
            },
            transclude: true,
            templateUrl: 'ribbon.html',
            controller: ['ribbonTabs', RibbonController],
            controllerAs: 'ribbon',
            bindToController: true
        };
    })
    .directive('ngRibbonTitle', function (optimizedResize) {        
        return {
            scope: {
                title: '='
            },
            require: '^ngRibbon',
            template: '<div ng-style="position()">{{ title }}</div>',
            link: function (scope, element, attrs, ribbonController) {
                var titleElement = element.find('div');
          
                var originalPosition;
                optimizedResize.add(function () {
                    originalPosition = undefined;
                    scope.$digest();
                });
                
                scope.position = function () {
                    var position = calculatePosition(titleElement[0], originalPosition);
                    if (position && !originalPosition) {
                        originalPosition = position;
                    }
                    return position ? { marginLeft: position + 'px' } : undefined;
                }
            }
        };
        
        function calculatePosition(titleElement, originalPosition) {
            var currentPosition = titleElement.getBoundingClientRect();                  
            var overlap = document.elementFromPoint(currentPosition.left, currentPosition.top);
            if (overlap && overlap.parentElement.classList.contains('contextual-group')) {
                var overlapPosition = overlap.getBoundingClientRect();
                var newLeft = overlapPosition.left + overlapPosition.width + 1;
                return newLeft;
            } else {
                return originalPosition;
            }
        }
    })
    .directive('ngRibbonBackstage', function () {
        return {
            scope: {
                title: '='
            },
            transclude: true,
            templateUrl: 'backstage.html',
            require: '^ngRibbon',
            link: function (scope, element, attrs, ribbonController) {
                scope.backstage = ribbonController.setBackstage(scope.title);
            }
        };
    })
    .directive('ngRibbonTab', function () {
        return {
            scope: {
                title: '=',
                contextual: '@?',
                color: '@?'
            },
            template: '<div ng-transclude></div>',
            transclude: true,
            replace: true,
            require: '^ngRibbon',
            link: function (scope, element, attrs, ribbonController) {
                var contextual = scope.contextual
                    ? { title: scope.contextual, color: scope.color }
                    : undefined;
                    
                ribbonController.addTab(scope.title, contextual);
            }
        };
    })
    .directive('ngRibbonGroup', function () {
        return {};
    })
    .factory('ribbonTabs', function () {
        var _tabs = [];
        var _contextualGroups = [];
        
        return {
            tabs: _tabs,
            contextualGroups: _contextualGroups,
            addTab: function (title, contextual) {
                var active = _tabs.length === 0;
                var tab = {
                    title: title,
                    active: active
                };
                if (!contextual) {
                    addTab(tab);
                } else {
                    addContextualTab(contextual, tab);
                }
                return tab;
            }
        };

        function addTab(tab) {
            _tabs.push(tab);
        }
        
        function addContextualTab(group, tab) {
            var contextual = _contextualGroups.filter(function (cg) {
                return cg.title === group.title;
            });
            if (contextual.length === 0) {
                _contextualGroups.push({
                    title: group.title,
                    colors: {
                        color: group.color,
                        backgroundColor: shadeBlend(0.97, group.color), //'#E6F3E6',
                        borderTopColor: group.color
                    },
                    tabs: [tab]
                });
            } else {
                contextual[0].tabs.push(tab);
            }
        }
        
        function shadeBlend(p,c0,c1) {
            var n=p<0?p*-1:p,u=Math.round,w=parseInt;
            if(c0.length>7){
                var f=c0.split(","),t=(c1?c1:p<0?"rgb(0,0,0)":"rgb(255,255,255)").split(","),R=w(f[0].slice(4)),G=w(f[1]),B=w(f[2]);
                return "rgb("+(u((w(t[0].slice(4))-R)*n)+R)+","+(u((w(t[1])-G)*n)+G)+","+(u((w(t[2])-B)*n)+B)+")"
            }else{
                var f=w(c0.slice(1),16),t=w((c1?c1:p<0?"#000000":"#FFFFFF").slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF;
                return "#"+(0x1000000+(u(((t>>16)-R1)*n)+R1)*0x10000+(u(((t>>8&0x00FF)-G1)*n)+G1)*0x100+(u(((t&0x0000FF)-B1)*n)+B1)).toString(16).slice(1)
            }
        }
    });

angular.module('ngRibbon.menu', [])
    .directive('ngRibbonMenu', function () {
        function RibbonMenuController() {
            this.menuItems = [];
        }

        Object.defineProperties(RibbonMenuController.prototype, {
            addMenuItem: {
                value: function (menuItem) {
                    if (this.menuItems.length === 0) {
                        this.select(menuItem);
                    }
                    this.menuItems.push(menuItem);
                }
            },
            addSeparator: {
                value: function () {
                    this.menuItems.push({
                        separator: true
                    });
                }
            },
            select: {
                value: function (menuItem) {
                    var action = menuItem.action;
                    if (action) {
                        action();
                        return;
                    }

                    if (this.selectedMenuItem) {
                        this.selectedMenuItem.selected = false;
                        this.selectedMenuItem = null;
                    }

                    this.selectedMenuItem = menuItem;
                    this.selectedMenuItem.selected = true;
                }
            }
        });

        return {
            scope: true,
            templateUrl: 'ribbon-menu.html',
            transclude: true,
            controller: RibbonMenuController,
            controllerAs: 'menu',
            bindToController: true
        };
    })
    .directive('ngRibbonMenuSeparator', function () {
        return {
            require: '^ngRibbonMenu',
            link: function (scope, element, attrs, ribbonMenuController) {
                ribbonMenuController.addSeparator();
            }
        };
    })
    .directive('ngRibbonMenuItem', function () {
        return {
            scope: {
                title: '=',
                action: '&?'
            },
            require: '^ngRibbonMenu',
            link: function (scope, element, attrs, ribbonMenuController) {
                var menuItem = {
                    title: scope.title,
                    action: !!attrs.action ? scope.action : null,
                    _selected: false
                };
                Object.defineProperties(menuItem, {
                    selected: {
                        get: function () {
                            return menuItem._selected;
                        },
                        set: function (value) {
                            menuItem._selected = value;
                            element.toggleClass('selected', value);
                        }
                    }
                });
                ribbonMenuController.addMenuItem(menuItem);
            }
        };
    });

angular.module('ngRibbon.actions', []);

angular.module('ngRibbon.utils', [])
    .factory('optimizedResize', function ($window) {
        var callbacks = [];
        var running = false;
        
        var timeout = $window.requestFrameAnimation || 
            function (callback) { return $window.setTimeout(callback, 66); };
        
        return {
            add: function(callback) {
                if (callback) {
                    if (callbacks.length === 0) {
                        window.addEventListener('resize', resize);
                    }
                    callbacks.push(callback);
                }
            }
        };
        
        function resize() {
            if (!running) {            
                running = true;
                timeout(runCallbacks);
            }
        }
        
        // run the actual callbacks
        function runCallbacks() {
            callbacks.forEach(function(callback) {
                callback();
            });

            running = false;
        }
    });

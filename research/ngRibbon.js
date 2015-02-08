angular.module('ngRibbon', ['ngRibbon.menu', 'ngRibbon.utils'])
    .directive('ngRibbon', function () {
        function ContextualGroup(parent, title, color) {
            this.parent = parent;
            this.title = title;
            this.color = 'color-' + color;
            this.tabs = [];

            this.initialize();
        }

        Object.defineProperties(ContextualGroup.prototype, {
            initialize: {
                value: function () {
                    var context = this.parent.ribbonContext;
                    if (context.hasOwnProperty(this.title)) {
                        return;
                    }

                    var _this = this;
                    Object.defineProperty(context, this.title, {
                        get: function () {
                            return _this.visible;
                        },
                        set: function (value) {
                            _this.visible = value;
                            _this.onVisibleChanged();
                        }
                    });
                }
            },
            hasActive: {
                get: function () {
                    return this.tabs.filter(function (tab) {
                        return tab.active;
                    }).length > 0;
                }
            },
            onVisibleChanged: {
                value: function () {
                    if (this.visible && !this.parent.collapsed) {
                        this.parent.activate(this.tabs[0]);
                    } else if (this.hasActive) {
                        this.parent.activate();
                    }
                }
            }
        });

        function RibbonController(scope, document, contextualColors) {
            this.scope = scope;
            this.document = document;
            this.contextualColors = contextualColors;
            this.tabs = [];
            this.contextualGroups = [];
            this._collapsed = false;
        }

        Object.defineProperties(RibbonController.prototype, {
            hasBackstage: {
                get: function () {
                    return !!this.backstage;
                }
            },
            collapsed: {
                get: function () {
                    return this._collapsed && !this.activeTab;
                }
            },
            toggleCollapse: {
                value: function () {
                    this._collapsed = !this._collapsed;
                    if (this._collapsed) {
                        this.clearActiveTab();
                    }
                }
            },
            activate: {
                value: function (tab, e) {
                    if (this.activeTab) {
                        if (this.activeTab === tab) {
                            if (this._collapsed) {
                                this.clearActiveTab();
                            }
                            return;
                        }
                        this.clearActiveTab();
                    }

                    if (!tab) {
                        tab = this.tabs[0];
                    }

                    this.activeTab = tab;
                    this.activeTab.active = true;

                    if (this._collapsed) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.globalClearActiveTab();
                    }
                }
            },
            globalClearActiveTab: {
                value: function () {
                    if (this.globalRegistered) {
                        return;
                    }
                    this.globalRegistered = true;
                    var _this = this;
                    this.document.one('click', function () {
                        _this.clearActiveTab();
                        _this.globalRegistered = false;
                        _this.scope.$digest();
                    });
                }
            },
            clearActiveTab: {
                value: function () {
                    this.activeTab.active = false;
                    this.activeTab = null;
                }
            },
            addTab: {
                value: function (title, contextualTitle) {
                    var active = this.tabs.length === 0;
                    var tab = {
                        title: title,
                        active: active
                    };
                    if (active) {
                        this.activeTab = tab;
                    }

                    if (!contextualTitle) {
                        this.tabs.push(tab);
                    } else {
                        this.addContextualTab(tab, contextualTitle);
                    }
                }
            },
            addContextualTab: {
                value: function (tab, contextualTitle) {
                    var contextual = this.findContextual(contextualTitle);
                    if (!contextual) {
                        contextual = new ContextualGroup(this, contextualTitle, this.contextualColors.next());
                        this.contextualGroups.push(contextual);
                    }
                    contextual.tabs.push(tab);
                }
            },
            findContextual: {
                value: function (title) {
                    var contextual = this.contextualGroups.filter(function (group) {
                        return group.title === title;
                    });
                    return contextual.length > 0 ? contextual[0] : null;
                }
            }
        });

        return {
            scope: {
                title: '=',
                ribbonContext: '=context'
            },
            transclude: true,
            templateUrl: 'ribbon.html',
            controller: ['$scope', '$document', 'contextualColors', RibbonController],
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
            link: function (scope, element) {
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
                    return position ? {marginLeft: position + 'px'} : undefined;
                }
            }
        };

        function calculatePosition(titleElement, originalPosition) {
            var currentPosition = titleElement.getBoundingClientRect();
            var overlap = document.elementFromPoint(currentPosition.left, currentPosition.top);
            if (overlap && overlap.parentElement.classList.contains('contextual-group')) {
                var overlapPosition = overlap.getBoundingClientRect();
                return overlapPosition.left + overlapPosition.width + 1;
            } else {
                return originalPosition;
            }
        }
    })
    .directive('ngRibbonBackstage', function () {
        function BackstageController() {
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

        return {
            scope: {
                title: '='
            },
            transclude: true,
            templateUrl: 'backstage.html',
            require: ['^ngRibbon', 'ngRibbonBackstage'],
            controller: [BackstageController],
            controllerAs: 'backstage',
            bindToController: true,
            link: function (scope, element, attrs, controllers) {
                controllers[0].backstage = controllers[1];
            }
        };
    })
    .directive('ngRibbonTab', function () {
        return {
            scope: {
                title: '=',
                contextual: '@?'
            },
            template: '<div ng-transclude></div>',
            transclude: true,
            replace: true,
            require: '^ngRibbon',
            link: function (scope, element, attrs, ribbonController) {
                ribbonController.addTab(scope.title, scope.contextual);
            }
        };
    })
    .directive('ngRibbonGroup', function () {
        return {};
    })
    .factory('contextualColors', function () {
        var index = 1;

        return {
            next: function () {
                var color = index;
                index += 1;
                if (index > 6) {
                    index = 1;
                }
                return color;
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
            function (callback) {
                return $window.setTimeout(callback, 66);
            };

        return {
            add: function (callback) {
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
            callbacks.forEach(function (callback) {
                callback();
            });

            running = false;
        }
    });

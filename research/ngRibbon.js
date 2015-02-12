angular.module('ngRibbon', ['ngAnimate', 'ngRibbon.menu', 'ngRibbon.utils', 'ngRibbon.actions'])
    .directive('ngRibbon', function ($templateCache, clickHandler, dynamicRibbon) {
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

        function RibbonController(scope, element, document, contextualColors) {
            this.scope = scope;
            this.element = element;
            this.document = document;
            this.contextualColors = contextualColors;
            this.tabs = [];
            this.dynamicTabs = [];
            this.contextualGroups = [];
            this._collapsed = false;
        }

        function activate(tab) {
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

            this.scope.$broadcast('tabActivated', { title: tab.title, contextual: tab.contextual });

            if (this._collapsed) {
                this.globalClearActiveTab();
            }
        }

        function toggleCollapse(tab) {
            if (tab && !this._collapsed && !tab.active) {
                activate.call(this, tab);
                return;
            }

            this._collapsed = !this._collapsed;
            if (this._collapsed) {
                this.clearActiveTab();
            } else if (tab && !tab.active) {
                activate.call(this, tab);
            }
        }

        Object.defineProperties(RibbonController.prototype, {
            hasBackstage: {
                get: function () {
                    return !!this.backstage;
                }
            },
            collapsed: {
                get: function () {
                    return this._collapsed;
                }
            },
            hasActiveTab: {
                get: function () {
                    return !!this.activeTab;
                }
            },
            activate: {
                value: clickHandler(activate, toggleCollapse)
            },
            toggleCollapse: {
                value: toggleCollapse
            },
            globalClearActiveTab: {
                value: function () {
                    if (this.globalRegistered) {
                        return;
                    }
                    this.globalRegistered = true;
                    var _this = this;
                    this.document.one('click', function (e) {
                        _this.globalRegistered = false;
                        if (_this.element[0].contains(e.target)) {
                            return;
                        }
                        _this.clearActiveTab();
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
                    var tab = {
                        title: title,
                        active: this.tabs.length === 0 && !contextualTitle,
                        contextual: !!contextualTitle
                    };

                    if (tab.active) {
                        this.activeTab = tab;
                    }

                    if (!contextualTitle) {
                        this.tabs.push(tab);
                    } else {
                        this.addContextualTab(tab, contextualTitle);
                    }
                    return tab;
                }
            },
            addDynamicTab: {
                value: function (title, contextualTitle, addedCallback) {

                    this.dynamicTabs.push({
                        title: title,
                        contextualTitle: contextualTitle,
                        addedCallback: addedCallback
                    });
                }
            },
            addDynamicTabs: {
                value: function () {
                    this.dynamicTabs.forEach(function (tab) {
                        tab.addedCallback(this.addTab(tab.title, tab.contextualTitle));
                    }, this);
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
            getCommand: {
                value: function (commandName) {
                    return this.ribbonContext.commands[commandName];
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
            controller: ['$scope', '$element', '$document', 'contextualColors', RibbonController],
            controllerAs: 'ribbon',
            bindToController: true,
            compile: function (element) {
                var tabContents = angular.element(element[0].querySelector('.tab-content'));

                dynamicRibbon.tabs.forEach(function (tab) {
                    var template = angular.element($templateCache.get(tab));
                    template.attr('data-dynamic', true);
                    tabContents.prepend(template);
                });

                return function link(scope, element, attrs, ctrl, transclude) {
                    transclude(function (clone) {
                        tabContents.prepend(clone);
                    });
                    ctrl.addDynamicTabs();
                };
            }
        };
    })
    .directive('ngRibbonTitle', function ($document, optimizedResize) {
        return {
            scope: {
                title: '='
            },
            require: '^ngRibbon',
            templateUrl: 'ribbon-title.html',
            link: function (scope, element) {
                var titleElement = element[0].querySelector('.title');

                function calculateLocation() {
                    setTimeout(function () {
                        var left = calculatePosition(titleElement);
                        if (titleElement.style.left !== left) {
                            titleElement.style.left = left;
                        }
                    }, 0);
                }

                calculateLocation();
                optimizedResize.add(calculateLocation);
                scope.$on('tabActivated', calculateLocation);
            }
        };

        function calculatePosition(titleElement) {
            var currentPosition = titleElement.getBoundingClientRect();
            var left = $document[0].body.clientWidth / 2 - currentPosition.width / 2;
            titleElement.style.display = 'none';
            var overlap = document.elementFromPoint(left, currentPosition.top);
            titleElement.style.display = '';
            if (overlap && overlap.parentElement.classList.contains('contextual-group')) {
                var overlapPosition = overlap.getBoundingClientRect();
                return (overlapPosition.left + overlapPosition.width + 1) + 'px';
            } else {
                return 'calc(50% - ' + (currentPosition.width / 2) + 'px)';
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
            templateUrl: 'ribbon-backstage.html',
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
            template: '<div class="tab" ng-transclude ng-show="tab.active"></div>',
            transclude: true,
            replace: true,
            require: ['^ngRibbon', 'ngRibbonTab'],
            controller: function () {},
            link: {
                pre: function (scope, element, attrs, ctrls) {
                    var tabController = ctrls[1];
                    tabController.title = scope.title;
                },
                post: function (scope, element, attrs, ctrls) {
                    var ribbonController = ctrls[0];

                    if (attrs.dynamic === 'true') {
                        ribbonController.addDynamicTab(scope.title, scope.contextual, function (tab) {
                            scope.tab = tab;
                        })
                    } else {
                        scope.tab = ribbonController.addTab(scope.title, scope.contextual);
                    }
                }
            }
        };
    })
    .directive('ngRibbonGroup', function ($compile, dynamicRibbon) {
        function getDynamicTemplate(command) {
            var template = ['<ng-', command.type, ' command="', command.command, '"'];
            if (command.popup) {
                template = template.concat([' popup="', command.popup, '"']);
            }
            template = template.concat(['></ng-', command.type, '>']);
            return template.join('');
        }

        return {
            scope: {
                title: '='
            },
            templateUrl: 'ribbon-group.html',
            transclude: true,
            require: '^ngRibbonTab',
            link: function (scope, element, attrs, tabController) {
                var transclude = angular.element(element[0].firstElementChild);
                var commands = dynamicRibbon.commands(tabController.title, scope.title);
                commands.forEach(function (command) {
                    var template = getDynamicTemplate(command);
                    var templateElement = angular.element(template);
                    $compile(templateElement)(scope);
                    transclude.append(templateElement);
                });
            }
        };
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
    })
    .provider('dynamicRibbon', function () {
        function DynamicRibbonProvider() {
            this._tabs = [];
            this._groupCommands = {};
        }

        Object.defineProperties(DynamicRibbonProvider.prototype, {
            registerTab: {
                value: function (templateUrl) {
                    this._tabs.push(templateUrl);
                }
            },
            registerCommand: {
                value: function (command) {
                    var key = command.tab + '$' + command.group;
                    var commands = this._groupCommands[key];
                    if (!commands) {
                        commands = this._groupCommands[key] = [];
                    }
                    commands.push(command);
                }
            },
            $get: {
                value: function () {
                    return new DynamicRibbonService(this);
                }
            }
        });

        function DynamicRibbonService(provider) {
            this.tabs = provider._tabs;
            this._commands = provider._groupCommands;
        }

        Object.defineProperties(DynamicRibbonService.prototype, {
            commands: {
                value: function (tabName, groupName) {
                    var key = tabName + '$' + groupName;
                    return this._commands[key] || [];
                }
            }
        });

        return new DynamicRibbonProvider();
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

(function () {
    function LargeButtonController() {
    }

    Object.defineProperties(LargeButtonController.prototype, {
        setCommand: {
            value: function (command) {
                this.command = command;
            }
        },
        visible: {
            get: function () {
                return !!this.command && (!this.command.hasOwnProperty('visible') || this.command.visible);
            }
        },
        disabled: {
            get: function () {
                return !!this.command && this.command.disabled;
            }
        },
        title: {
            get: function () {
                return !!this.command ? this.command.title : '';
            }
        },
        image: {
            get: function () {
                return !!this.command ? this.command.image : '';
            }
        },
        execute: {
            value: function () {
                if (this.command.action) {
                    this.command.action(this.command.title);
                }
            }
        }
    });

    function PopupButtonController(scope, actions) {
        this.scope = scope;
        this.actions = actions;

        this.actions.register(this.scope);
    }

    PopupButtonController.prototype = Object.create(LargeButtonController.prototype);

    PopupButtonController.EmptyCommands = [];
    Object.defineProperties(PopupButtonController.prototype, {
        setCommand: {
            value: function (command, popupUrl) {
                LargeButtonController.prototype.setCommand.call(this, command);
                this.popupUrl = popupUrl;
            }
        },
        opened: {
            get: function () {
                return this.visible && !this.disabled && this._opened;
            }
        },
        open: {
            value: function (e) {
                e.stopPropagation();

                if (!this.popupUrl) {
                    return;
                }

                if (this._opened) {
                    this._opened = false;
                    return;
                }

                this.actions.open(this, this.command.autoClose !== false);
            }
        },
        close: {
            value: function (digest) {
                this._opened = false;
                if (digest) {
                    this.scope.$digest();
                }
            }
        }
    });

    angular.module('ngRibbon.actions', [])
        .directive('ngLargeButton', function () {
            return {
                scope: {
                    command: '@'
                },
                controller: LargeButtonController,
                controllerAs: 'button',
                require: ['^ngRibbon', 'ngLargeButton'],
                templateUrl: 'ribbon-large-button.html',
                replace: true,
                link: function (scope, element, attrs, ctrls) {
                    var ribbonController = ctrls[0];
                    var command = ribbonController.getCommand(scope.command);
                    if (command) {
                        var largeRibbonController = ctrls[1];
                        largeRibbonController.setCommand(command);
                    }
                }
            };
        })
        .directive('ngSplitButton', function () {
            return {
                scope: {
                    command: '@',
                    popup: '@'
                },
                controller: ['$scope', 'actions', PopupButtonController],
                controllerAs: 'button',
                require: ['^ngRibbon', 'ngSplitButton'],
                templateUrl: 'ribbon-split-button.html',
                transclude: true,
                replace: true,
                link: function (scope, element, attrs, ctrls) {
                    var ribbonController = ctrls[0];
                    var command = ribbonController.getCommand(scope.command);
                    if (command) {
                        var splitButtonController = ctrls[1];
                        splitButtonController.setCommand(command, scope.popup);
                    }
                }
            }
        })
        .directive('ngDropButton', function () {
            return {
                scope: {
                    command: '@',
                    popup: '@'
                },
                require: ['^ngRibbon', 'ngDropButton'],
                templateUrl: 'ribbon-drop-button.html',
                transclude: true,
                replace: true,
                controller: ['$scope', 'actions', PopupButtonController],
                controllerAs: 'button',
                link: function (scope, element, attrs, ctrls) {
                    var ribbonController = ctrls[0];
                    var command = ribbonController.getCommand(scope.command);
                    if (command) {
                        var dropButtonController = ctrls[1];
                        dropButtonController.setCommand(command, scope.popup);
                    }
                }
            }
        })
        .factory('actions', function ($document) {
            var controller = null;
            var globalRegistered = false;

            function close(digest) {
                if (controller === null) {
                    return;
                }

                controller.close(digest);
                controller = null;
            }

            return {
                register: function (scope) {
                    scope.$on('tabActivated', function () {
                        close(false);
                    });
                },
                open: function (ctrl, autoClose) {
                    close(false);

                    controller = ctrl;
                    controller._opened = true;

                    if (autoClose && !globalRegistered) {
                        globalRegistered = true;
                        $document.one('click', function () {
                            close(true);
                            globalRegistered = false;
                        });
                    }
                }
            }
        });
}());

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
    })
    .factory('clickHandler', function ($timeout) {
        return function (onClick, onDoubleClick) {
            /*
             //var action = firstClick;
             //var timerPromise;
             //var ignoreSecondClick = false;
             //
             //function firstClick() {
             //    ignoreSecondClick = onClick && onClick.apply(this, arguments);
             //
             //    action = secondClick;
             //
             //    timerPromise = $timeout(function () {
             //        action = firstClick;
             //    }, 200);
             //}
             //
             //function secondClick() {
             //    if (!ignoreSecondClick) {
             //        onDoubleClick && onDoubleClick.apply(this, arguments);
             //    }
             //
             //    action = firstClick;
             //    timerPromise && $timeout.cancel(timerPromise);
             //}
             //
             //return function () {
             //    action.apply(this, arguments);
             //}
             */
            var index = 0;
            var clicks = 0;
            return function () {
                clicks++;

                var args = arguments;
                var _this = this;
                if (clicks === 1) {
                    $timeout(function () {
                        if (clicks == 1) {
                            onClick.apply(_this, args);
                        } else {
                            onDoubleClick.apply(_this, args);
                        }
                        clicks = 0;
                    }, 200);
                }
            }
        }
    })
    .directive('ngIsMultiline', function () {
        function checkMultiline(el) {
            if (el.getClientRects().length > 1) {
                el.classList.add('multiline');
            }
        }

        function setupCheck(params) {
            setTimeout(function () {
                if (params.el.offsetParent === null) {
                    wait(params);
                } else {
                    if (params.off) {
                        params.off();
                    }
                    checkMultiline(params.el);
                }
            }, 0);
        }

        function wait(params) {
            if (!params.off) {
                params.off = params.scope.$on('tabActivated', function () {
                    setupCheck(params);
                });
            }
        }

        return function link(scope, element) {
            setupCheck({
                el: element[0],
                off: null,
                scope: scope
            });
        };
    });

angular.module('ngRibbon', ['ngRibbon.menu'])
    .directive('ngRibbon', function () {
        function Backstage(title) {
            this.title = title;
        }

        Object.defineProperties(Backstage.prototype, {
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
                    return !!this.ribbonTabs.backstage;
                }
            },
            backstage: {
                get: function () {
                    return this.ribbonTabs.backstage;
                }
            },
            setBackstage: {
                value: function (title) {
                    var backstage = new Backstage(title);
                    this.ribbonTabs.setBackstage(backstage);
                    return backstage;
                }
            },
            tabs: {
                get: function () {
                    return this.ribbonTabs.tabs;
                }
            },
            addTab: {
                value: function (title) {
                    var tab = this.ribbonTabs.addTab(title);
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
                title: '='
            },
            require: '^ngRibbon',
            link: function (scope, element, attrs, ribbonController) {
                ribbonController.addTab(scope.title);
            }
        };
    })
    .directive('ngRibbonGroup', function () {
        return {};
    })
    .factory('ribbonTabs', function () {
        return {
            backstage: undefined,
            tabs: [],
            setBackstage: function (backstage) {
                this.backstage = backstage;
            },
            addTab: function (title) {
                var active = this.tabs.length === 0;
                var tab = {
                    title: title,
                    order: 'first',
                    active: active
                };
                this.tabs.push(tab);
                return tab;
            }
        };
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

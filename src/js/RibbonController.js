function RibbonController(scope, element, document, events, contextualColors, clickHandler) {
    this.scope = scope;
    this.element = element;
    this.document = document;
    this.events = events;
    this.contextualColors = contextualColors;

    this.activate = clickHandler(this.activate, this.toggleCollapse);

    this.tabs = [];
    this.dynamicTabs = [];
    this.contextualGroups = [];
    this._collapsed = false;
}

//function activate(tab) {
//    if (this.activeTab) {
//        if (this.activeTab === tab) {
//            if (this._collapsed) {
//                this.clearActiveTab();
//            }
//            return;
//        }
//        this.clearActiveTab();
//    }
//
//    if (!tab) {
//        tab = this.tabs[0];
//    }
//
//    this.activeTab = tab;
//    this.activeTab.active = true;
//
//    this.events.trigger('tabActivated', {title: tab.title, contextual: tab.contextual});
//
//    if (this._collapsed) {
//        this.globalClearActiveTab();
//    }
//}
//
//function toggleCollapse(tab) {
//    if (tab && !this._collapsed && !tab.active) {
//        activate.call(this, tab);
//        return;
//    }
//
//    this._collapsed = !this._collapsed;
//    if (this._collapsed) {
//        this.clearActiveTab();
//    } else if (tab && !tab.active) {
//        activate.call(this, tab);
//    }
//}

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
        value: function (tab) {
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

            this.events.trigger('tabActivated', {title: tab.title, contextual: tab.contextual});

            if (this._collapsed) {
                this.globalClearActiveTab();
            }
        }
    },
    toggleCollapse: {
        value: function (tab) {
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
                if (_this.element[0].contains(e.target) && !e.target.classList.contains('backstage-tab')) {
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

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
            return this.tabs
                    .filter(function (tab) {
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

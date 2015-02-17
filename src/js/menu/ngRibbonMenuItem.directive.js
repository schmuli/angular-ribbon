var ngRibbonMenuItemDirective = function () {
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
};

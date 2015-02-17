/*
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
*/

class RibbonMenuController {
    constructor() {
        this.menuItems = [];
    }

    addMenuItem(menuItem) {
        if (this.menuItems.length === 0) {
            this.select(menuItem);
        }
        this.menuItems.push(menuItem);
    }

    addSeparator() {
        this.menuItems.push({
            separator: true
        });
    }

    select(menuItem) {
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

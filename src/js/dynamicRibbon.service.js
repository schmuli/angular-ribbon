/*

function DynamicRibbonProvider() {
    this.tabs = [];
    this._commands = {};
}

Object.defineProperties(DynamicRibbonProvider.prototype, {
    key: {
        value: function (tab, group) {
            return tab + '$' + group;
        }
    },
    registerTab: {
        value: function (templateUrl) {
            this.tabs.push(templateUrl);
        }
    },
    registerCommand: {
        value: function (command) {
            var key = this.key(command.tab, command.group);
            var commands = this._commands[key];
            if (!commands) {
                commands = this._commands[key] = [];
            }
            commands.push(command);
        }
    },
    commands: {
        value: function (tabName, groupName) {
            var key = this.key(tabName, groupName);
            return this._commands[key] || [];
        }
    },
    $get: {
        value: function () {
            return this;
        }
    }
});
*/

class DynamicRibbonProvider {
    constructor() {
        this.tabs = [];
        this._commands = {};
    }

    static key(tab, group) {
        return tab + '$' + group;
    }

    registerTab(templateUrl) {
        this.tabs.push(templateUrl);
    }

    registerCommand(command) {
        var key = DynamicRibbonProvider.key(command.tab, command.group);
        var commands = this._commands[key];
        if (!commands) {
            commands = this._commands[key] = [];
        }
        commands.push(command);
    }

    commands(tabName, groupName) {
        var key = DynamicRibbonProvider.key(tabName, groupName);
        return this._commands[key] || [];
    }

    $get() {
        return this;
    }
}

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

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

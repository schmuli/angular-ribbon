export var largeButtonDirective = function () {
    return {
        scope: {
            command: '@'
        },
        controller: 'LargeButtonController',
        controllerAs: 'button',
        require: ['^ribbon', 'largeButton'],
        templateUrl: 'ribbon/templates/ribbon-large-button-template.html',
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
};

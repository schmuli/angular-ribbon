export var ribbonGroupDirective = function ($compile, dynamicRibbon) {
    return {
        scope: {
            title: '='
        },
        templateUrl: 'ribbon/templates/ribbon-group-template.html',
        transclude: true,
        require: '^ribbonTab',
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

    function getDynamicTemplate(command) {
        var template = ['<ng-', command.type, ' command="', command.command, '"'];
        if (command.popup) {
            template = template.concat([' popup="', command.popup, '"']);
        }
        template = template.concat(['></ng-', command.type, '>']);
        return template.join('');
    }
};

/*
var ribbonEvents = function ($rootScope) {
    return {
        trigger: function (event, args) {
            return $rootScope.$emit('ribbonEvents-' + event, args);
        },
        on: function (event, callback) {
            return $rootScope.$on('ribbonEvents-' + event, callback);
        }
    };
};
*/

class RibbonEvents {
    static Namespace = 'ribbonEvents-';

    constructor($rootScope) {
        this.scope = $rootScope;
    }

    on(event, callback) {
        this.scope.$on(RibbonEvents.Namespace + event, callback);
    }

    trigger(event, args) {
        this.scope.$emit(RibbonEvents.Namespace + event, args);
    }
}

class RibbonEvents {
    static get Namespace() { return 'ribbonEvents-' };

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

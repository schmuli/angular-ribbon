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

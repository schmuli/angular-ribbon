/*
var contextualColors = function () {
    var index = 1;

    return {
        next: function () {
            var color = index;
            index += 1;
            if (index > 6) {
                index = 1;
            }
            return color;
        }
    }
};
*/

class ContextualColors {
    constructor() {
        this.index = 1;
    }

    next() {
        var color = this.index;
        this.index += 1;
        if (this.index > 6) {
            this.index = 1;
        }
        return color;
    }
}

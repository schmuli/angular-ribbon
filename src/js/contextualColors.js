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

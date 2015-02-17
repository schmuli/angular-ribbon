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

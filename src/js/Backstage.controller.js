export class BackstageController {
    constructor() {
        this.opened = false;
    }

    open() {
        this.opened = true;
    }

    close() {
        this.opened = false;
    }
}
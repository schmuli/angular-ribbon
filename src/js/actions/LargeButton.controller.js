class LargeButtonController {
    get visible() {
        return !!this.command && (!this.command.hasOwnProperty('visible') || this.command.visible);
    }

    get disabled() {
        return !!this.command && this.command.disabled;
    }

    get title() {
        return !!this.command ? this.command.title : '';
    }

    get image() {
        return !!this.command ? this.command.image : '';
    }

    setCommand(command) {
        this.command = command;
    }

    execute() {
        if (this.command.action) {
            this.command.action(this.command.title);
        }
    }
}

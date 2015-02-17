class LargeButtonController {
    setCommand(command) {
        this.command = command;
    }

    visible() {
        return !!this.command && (!this.command.hasOwnProperty('visible') || this.command.visible);
    }

    disabled() {
        return !!this.command && this.command.disabled;
    }

    title() {
        return !!this.command ? this.command.title : '';
    }

    image() {
        return !!this.command ? this.command.image : '';
    }

    execute() {
        if (this.command.action) {
            this.command.action(this.command.title);
        }
    }
}

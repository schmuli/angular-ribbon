import {A} from './a';
export class B extends A {
    constructor(name, age) {
        super(name);
        this.age = age;
    }

    print() {
        return super.print() + `, and I'm ${this.age} years old`;
    }
}

function test() {

}
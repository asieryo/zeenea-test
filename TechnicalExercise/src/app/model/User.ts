import { UserType } from './UserType';

export class User {

    public name: string;
    public email: string;
    public type: UserType;

    constructor(name: string, email: string, type: UserType) {
        this.name = name;
        this.email = email;
        this.type = type;
    }

}

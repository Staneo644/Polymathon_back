import { Document } from 'mongoose';
export type UserDocument = User & Document;
export declare class User {
    username: string;
    password: string;
}
export declare const UserSchema: any;

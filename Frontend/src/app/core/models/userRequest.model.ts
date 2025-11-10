import { Faculty } from "./faculty.model";

export interface UserRequest {
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    faculty: Faculty;
}
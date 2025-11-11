import { Faculty } from "./faculty.model";

export interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    faculty: Faculty;
}
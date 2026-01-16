import { UserResponse } from "./userResponse";

export interface Community {
    id: number;
    name: string;
    description: string;
    creadedAt: Date;
    createdBy: UserResponse;
}
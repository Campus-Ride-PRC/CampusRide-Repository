import { UserResponse } from "./userResponse";

export interface Community {
    id: number;
    name: string;
    description: string;
    createdAt: Date;
    createdBy: UserResponse;
    memberCount: number;
}
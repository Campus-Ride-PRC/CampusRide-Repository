import { UserResponse } from "./userResponse";

export interface CommunityComment {
    id: number;
    postId: number;
    author: UserResponse;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
}

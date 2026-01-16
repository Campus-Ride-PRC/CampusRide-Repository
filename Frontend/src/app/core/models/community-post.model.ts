import { UserResponse } from "./userResponse";

export interface CommunityPost {
    id: number;
    communityId: number;
    author: UserResponse;
    content: string;
    createdAt: Date;
    updatedAt?: Date;
    commentCount: number;
}

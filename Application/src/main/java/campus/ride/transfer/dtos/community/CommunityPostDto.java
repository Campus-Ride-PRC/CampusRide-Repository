package campus.ride.transfer.dtos.community;

import campus.ride.transfer.dtos.user.UserResponseDto;
import java.time.LocalDateTime;

public class CommunityPostDto {
    private Long id;
    private Long communityId;
    private UserResponseDto author;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long commentCount;

    public CommunityPostDto() {}

    public CommunityPostDto(Long id, Long communityId, UserResponseDto author, String content, 
                            LocalDateTime createdAt, LocalDateTime updatedAt, Long commentCount) {
        this.id = id;
        this.communityId = communityId;
        this.author = author;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.commentCount = commentCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCommunityId() {
        return communityId;
    }

    public void setCommunityId(Long communityId) {
        this.communityId = communityId;
    }

    public UserResponseDto getAuthor() {
        return author;
    }

    public void setAuthor(UserResponseDto author) {
        this.author = author;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Long commentCount) {
        this.commentCount = commentCount;
    }
}

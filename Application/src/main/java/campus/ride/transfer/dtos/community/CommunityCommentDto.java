package campus.ride.transfer.dtos.community;

import campus.ride.transfer.dtos.user.UserResponseDto;
import java.time.LocalDateTime;

public class CommunityCommentDto {
    private Long id;
    private Long postId;
    private UserResponseDto author;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommunityCommentDto() {}

    public CommunityCommentDto(Long id, Long postId, UserResponseDto author, String content, 
                               LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.postId = postId;
        this.author = author;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
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
}

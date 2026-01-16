package campus.ride.transfer.mappings;

import campus.ride.entities.CommunityComment;
import campus.ride.transfer.dtos.community.CommunityCommentDto;

public class CommunityCommentMapper {

    public static CommunityCommentDto toDto(CommunityComment comment) {
        if (comment == null) {
            return null;
        }

        CommunityCommentDto dto = new CommunityCommentDto();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPost() != null ? comment.getPost().getId() : null);
        dto.setAuthor(UserMapper.toDto(comment.getAuthor()));
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        dto.setUpdatedAt(comment.getUpdatedAt());
        return dto;
    }
}

package campus.ride.transfer.mappings;

import campus.ride.entities.CommunityPost;
import campus.ride.transfer.dtos.community.CommunityPostDto;

public class CommunityPostMapper {

    public static CommunityPostDto toDto(CommunityPost post) {
        if (post == null) {
            return null;
        }

        CommunityPostDto dto = new CommunityPostDto();
        dto.setId(post.getId());
        dto.setCommunityId(post.getCommunity() != null ? post.getCommunity().getId() : null);
        dto.setAuthor(UserMapper.toDto(post.getAuthor()));
        dto.setContent(post.getContent());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setCommentCount(post.getActualCommentCount());
        return dto;
    }
}

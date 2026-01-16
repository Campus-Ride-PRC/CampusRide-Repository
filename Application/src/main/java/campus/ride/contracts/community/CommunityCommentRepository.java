package campus.ride.contracts.community;

import campus.ride.entities.CommunityComment;
import java.util.List;
import java.util.Optional;

public interface CommunityCommentRepository {
    CommunityComment save(CommunityComment comment);
    Optional<CommunityComment> findById(Long id);
    List<CommunityComment> findByPostId(Long postId);
}

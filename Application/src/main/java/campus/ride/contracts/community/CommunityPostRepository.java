package campus.ride.contracts.community;

import campus.ride.entities.CommunityPost;
import java.util.List;
import java.util.Optional;

public interface CommunityPostRepository {
    CommunityPost save(CommunityPost post);
    Optional<CommunityPost> findById(Long id);
    List<CommunityPost> findByCommunityId(Long communityId);
}

package campus.ride.contracts.community;

import campus.ride.entities.Communities;

import java.util.List;
import java.util.Optional;

public interface CommunityRepository {
    Communities save(Communities community);
    List<Communities> getAllNewCommunities(Long userId);
    List<Communities> getAllIncludedCommunities(Long userId);
}

package campus.ride.contracts.community;

import campus.ride.entities.CommunityMembers;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface CommunityMemberRepository {
    CommunityMembers save(CommunityMembers member);
    List<CommunityMembers> findByCommunityId(Long communityId);
    List<CommunityMembers> findByUserId(Long userId);
}

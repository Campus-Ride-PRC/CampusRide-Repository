package campus.ride.repositories.community;

import campus.ride.contracts.community.CommunityMemberRepository;
import campus.ride.entities.CommunityMemberId;
import campus.ride.entities.CommunityMembers;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityMembersJPARepository extends JpaRepository<CommunityMembers, CommunityMemberId>, CommunityMemberRepository {
    List<CommunityMembers> findById_CommunityId(Long communityId);
    List<CommunityMembers> findById_UserId(Long userId);

}

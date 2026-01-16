package campus.ride.repositories.community;

import campus.ride.contracts.community.CommunityRepository;
import campus.ride.entities.Communities;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface CommunityJPARepository extends JpaRepository<Communities, Long>, CommunityRepository {

    @Query("SELECT DISTINCT c FROM Communities c " +
           "JOIN FETCH c.createdBy u " +
           "LEFT JOIN FETCH u.faculty f " +
           "LEFT JOIN FETCH f.address a " +
           "WHERE c.id NOT IN " +
           "(SELECT cm.id.communityId FROM CommunityMembers cm WHERE cm.id.userId = :userId)")
    List<Communities> getAllNewCommunities(@Param("userId") Long userId);

    @Query("SELECT DISTINCT c FROM Communities c " +
           "JOIN FETCH c.createdBy u " +
           "LEFT JOIN FETCH u.faculty f " +
           "LEFT JOIN FETCH f.address a " +
           "JOIN CommunityMembers cm ON c.id = cm.id.communityId " +
           "WHERE cm.id.userId = :userId")
    List<Communities> getAllIncludedCommunities(@Param("userId") Long userId);
}

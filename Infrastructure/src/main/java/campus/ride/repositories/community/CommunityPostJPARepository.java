package campus.ride.repositories.community;

import campus.ride.contracts.community.CommunityPostRepository;
import campus.ride.entities.CommunityPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityPostJPARepository extends JpaRepository<CommunityPost, Long>, CommunityPostRepository {

    @Query("SELECT p FROM CommunityPost p " +
           "JOIN FETCH p.author a " +
           "LEFT JOIN FETCH a.faculty f " +
           "LEFT JOIN FETCH f.address " +
           "WHERE p.community.id = :communityId " +
           "ORDER BY p.createdAt DESC")
    List<CommunityPost> findByCommunityId(@Param("communityId") Long communityId);
}

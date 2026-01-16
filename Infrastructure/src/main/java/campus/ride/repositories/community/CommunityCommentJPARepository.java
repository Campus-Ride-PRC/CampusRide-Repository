package campus.ride.repositories.community;

import campus.ride.contracts.community.CommunityCommentRepository;
import campus.ride.entities.CommunityComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommunityCommentJPARepository extends JpaRepository<CommunityComment, Long>, CommunityCommentRepository {

    @Query("SELECT c FROM CommunityComment c " +
           "JOIN FETCH c.author a " +
           "LEFT JOIN FETCH a.faculty f " +
           "LEFT JOIN FETCH f.address " +
           "WHERE c.post.id = :postId " +
           "ORDER BY c.createdAt ASC")
    List<CommunityComment> findByPostId(@Param("postId") Long postId);
}

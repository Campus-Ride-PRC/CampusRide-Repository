package campus.ride.repositories.user;

import campus.ride.contracts.friend.FriendRepository;
import campus.ride.entities.Friend;
import campus.ride.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendJPARepository extends JpaRepository<Friend, Long>, FriendRepository {
    Optional<Friend> findBySenderAndReceiver(User sender, User receiver);

    @Query("SELECT COUNT(f) FROM Friend f WHERE (f.sender = :user OR f.receiver = :user) AND f.status = 'ACCEPTED'")
    Long countAcceptedFriends(@Param("user") User user);

    @Query("SELECT f FROM Friend f WHERE f.receiver = :receiver AND f.status = 'PENDING'")
    List<Friend> findPendingRequestsByReceiver(@Param("receiver") User receiver);

    @Query("SELECT f FROM Friend f WHERE f.sender = :sender AND (f.status = 'ACCEPTED' OR f.status = 'DECLINED')")
    List<Friend> findCompletedRequestsBySender(@Param("sender") User sender);

    @Query("SELECT f FROM Friend f WHERE (f.sender = :user OR f.receiver = :user) AND f.status = 'ACCEPTED'")
    List<Friend> findAcceptedFriends(@Param("user") User user);

    @Query("SELECT f FROM Friend f WHERE (f.sender = :user1 AND f.receiver = :user2) OR (f.sender = :user2 AND f.receiver = :user1)")
    Optional<Friend> findFriendship(@Param("user1") User user1, @Param("user2") User user2);
}

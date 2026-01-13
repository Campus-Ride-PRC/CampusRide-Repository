package campus.ride.contracts.friend;

import campus.ride.entities.Friend;
import campus.ride.entities.User;

import java.util.List;
import java.util.Optional;

public interface FriendRepository {
    Friend save(Friend friend);
    Optional<Friend> findBySenderAndReceiver(User sender, User receiver);
    Long countAcceptedFriends(User user);
    List<Friend> findPendingRequestsByReceiver(User receiver);
    Optional<Friend> findById(Long id);
    List<Friend> findCompletedRequestsBySender(User sender);
    List<Friend> findAcceptedFriends(User user);
    Optional<Friend> findFriendship(User user1, User user2);
}

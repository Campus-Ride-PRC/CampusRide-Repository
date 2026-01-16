package campus.ride.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class CommunityMemberId implements Serializable {

    @Column(name="community_id")
    private Long communityId;

    @Column(name="user_id")
    private Long userId;

    public CommunityMemberId() {}

    public CommunityMemberId(Long communityId, Long userId) {
        this.communityId = communityId;
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CommunityMemberId that = (CommunityMemberId) o;
        return Objects.equals(communityId, that.communityId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(communityId, userId);
    }
}

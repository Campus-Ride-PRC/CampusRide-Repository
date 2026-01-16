package campus.ride.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "community_members")
public class CommunityMembers {

    @EmbeddedId
    private CommunityMemberId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("communityId")
    @JoinColumn(name = "community_id")
    private Communities community;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "joined_at", nullable = false, insertable = false, updatable = false,
            columnDefinition = "timestamp DEFAULT now()")
    private LocalDateTime joinedAt;

    public CommunityMembers(Communities community, User user, LocalDateTime joinedAt) {
        this.community = community;
        this.user = user;
        this.joinedAt = joinedAt;
        this.id = new CommunityMemberId(community.getId(), user.getId());
    }

    public CommunityMembers() {}

    public CommunityMemberId getId() { return id; }
    public void setId(CommunityMemberId id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Communities getCommunity() { return community; }
    public void setCommunity(Communities community) { this.community = community; }

    public LocalDateTime getJoinedAt() { return joinedAt; }
}
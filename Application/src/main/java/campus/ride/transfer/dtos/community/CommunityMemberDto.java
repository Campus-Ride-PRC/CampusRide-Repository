package campus.ride.transfer.dtos.community;

public class CommunityMemberDto {
    private Long communityId;
    private Long userId;

    public CommunityMemberDto() {
    }

    public CommunityMemberDto(Long communityId, Long userId) {
        this.communityId = communityId;
        this.userId = userId;
    }

    public Long getCommunityId() {
        return communityId;
    }

    public void setCommunityId(Long communityId) {
        this.communityId = communityId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}

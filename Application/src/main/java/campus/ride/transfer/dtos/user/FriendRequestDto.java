package campus.ride.transfer.dtos.user;

public class FriendRequestDto {
    private Integer receiverId;

    public FriendRequestDto() {
    }

    public FriendRequestDto(Integer receiverId) {
        this.receiverId = receiverId;
    }

    public Integer getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Integer receiverId) {
        this.receiverId = receiverId;
    }
}

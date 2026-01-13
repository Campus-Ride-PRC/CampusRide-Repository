package campus.ride.transfer.dtos.user;

public class FriendshipStatusDto {
    private String status;
    private boolean isSender;

    public FriendshipStatusDto(String status, boolean isSender) {
        this.status = status;
        this.isSender = isSender;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public boolean isSender() {
        return isSender;
    }

    public void setSender(boolean sender) {
        isSender = sender;
    }
}

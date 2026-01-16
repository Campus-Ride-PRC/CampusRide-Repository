package campus.ride.transfer.mappings;

import campus.ride.entities.Communities;
import campus.ride.transfer.dtos.community.CommunityDto;

public class CommunityMapper {

    public static CommunityDto toDto(Communities community) {
        if (community == null) {
            return null;
        }

        CommunityDto dto = new CommunityDto();
        dto.setId(community.getId());
        dto.setName(community.getName());
        dto.setDescription(community.getDescription());
        dto.setCreator(UserMapper.toDto(community.getCreatedBy()));
        return dto;
    }

    public static campus.ride.entities.Communities toEntity(CommunityDto dto) {
        if (dto == null) {
            return null;
        }

        campus.ride.entities.Communities community = new campus.ride.entities.Communities();
        community.setId(dto.getId());
        community.setName(dto.getName());
        community.setDescription(dto.getDescription());
        community.setCreatedBy(UserMapper.toEntity(dto.getCreator()));
        return community;
    }
}

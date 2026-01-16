package campus.ride.useCases;

import campus.ride.contracts.community.CommunityMemberRepository;
import campus.ride.contracts.community.CommunityRepository;
import campus.ride.entities.Communities;
import campus.ride.entities.CommunityMemberId;
import campus.ride.entities.CommunityMembers;
import campus.ride.entities.User;
import campus.ride.interfaces.CommunityService;
import campus.ride.transfer.dtos.community.CommunityDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.mappings.CommunityMapper;
import campus.ride.transfer.mappings.UserMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository repo;
    private final CommunityMemberRepository memberRepo;

    public CommunityServiceImpl(CommunityRepository repo, CommunityMemberRepository memberRepo) {
        this.repo = repo;
        this.memberRepo = memberRepo;
    }

   @Override
public CompletableFuture<CommunityDto> createCommunity(String name, String description, UserResponseDto userDto) {
    return CompletableFuture.supplyAsync(() -> {
        User actualUser = UserMapper.toEntity(userDto);

        Communities community = new Communities();
        community.setName(name);
        community.setDescription(description);
        community.setCreatedBy(actualUser);

        Communities savedCommunity = repo.save(community);

        CommunityMembers autoMember = new CommunityMembers(savedCommunity, actualUser, LocalDateTime.now());
        memberRepo.save(autoMember);

        return CommunityMapper.toDto(savedCommunity);
    });
    }

    private CommunityDto mapToDto(Communities entity) {
        return CommunityMapper.toDto(entity);
    }

    @Override
    public CompletableFuture<List<CommunityDto>> getNewCommunities(Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            List<Communities> entities = repo.getAllNewCommunities(userId);
            return entities.stream()
                    .map(this::mapToDto)
                    .toList();
        });
    }

    @Override
    public CompletableFuture<List<CommunityDto>> getIncludedCommunities(Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            List<Communities> entities = repo.getAllIncludedCommunities(userId);
            return entities.stream()
                    .map(this::mapToDto)
                    .toList();
        });
    }
}

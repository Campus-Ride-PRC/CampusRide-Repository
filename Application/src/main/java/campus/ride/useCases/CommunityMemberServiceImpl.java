package campus.ride.useCases;

import campus.ride.contracts.community.CommunityMemberRepository;
import campus.ride.entities.Communities;
import campus.ride.entities.CommunityMembers;
import campus.ride.entities.User;
import campus.ride.interfaces.CommunityMemberService;
import campus.ride.transfer.dtos.community.CommunityMemberDto;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CommunityMemberServiceImpl implements CommunityMemberService {

    private final CommunityMemberRepository repo;
    private final EntityManager entityManager;

    public CommunityMemberServiceImpl(CommunityMemberRepository repo, EntityManager entityManager) {
        this.repo = repo;
        this.entityManager = entityManager;
    }

    @Override
    public CompletableFuture<CommunityMemberDto> addMemberToCommunity(Long communityId, Long userId) {
        return CompletableFuture.supplyAsync(() -> {
            Communities community = entityManager.getReference(Communities.class, communityId.intValue());
            User user = entityManager.getReference(User.class, userId);

            CommunityMembers newMember = new CommunityMembers(community, user, LocalDateTime.now());

            CommunityMembers saved = repo.save(newMember);

            return new CommunityMemberDto(
                (long) saved.getCommunity().getId(),
                saved.getUser().getId()
            );
        });
    }

    @Override
    public CompletableFuture<List<CommunityMemberDto>> getMembersByCommunityId(Long communityId) {
        return CompletableFuture.supplyAsync(() -> repo.findByCommunityId(communityId))
                .thenApply(members -> members.stream()
                        .map(member -> new CommunityMemberDto(
                                (long) member.getCommunity().getId(),
                                member.getUser().getId()
                        ))
                        .toList()
                );
    }
}
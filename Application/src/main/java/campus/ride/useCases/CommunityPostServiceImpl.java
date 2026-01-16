package campus.ride.useCases;

import campus.ride.contracts.community.CommunityPostRepository;
import campus.ride.entities.Communities;
import campus.ride.entities.CommunityPost;
import campus.ride.entities.User;
import campus.ride.interfaces.CommunityPostService;
import campus.ride.transfer.dtos.community.CommunityPostDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.mappings.CommunityPostMapper;
import campus.ride.transfer.mappings.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CommunityPostServiceImpl implements CommunityPostService {

    private final CommunityPostRepository postRepository;

    public CommunityPostServiceImpl(CommunityPostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public CompletableFuture<CommunityPostDto> createPost(Long communityId, String content, UserResponseDto authorDto) {
        return CompletableFuture.supplyAsync(() -> {
            User author = UserMapper.toEntity(authorDto);
            
            Communities community = new Communities();
            community.setId(communityId);
            
            CommunityPost post = new CommunityPost(community, author, content);
            CommunityPost savedPost = postRepository.save(post);
            
            return CommunityPostMapper.toDto(savedPost);
        });
    }

    @Override
    public CompletableFuture<List<CommunityPostDto>> getPostsByCommunity(Long communityId) {
        return CompletableFuture.supplyAsync(() -> {
            List<CommunityPost> posts = postRepository.findByCommunityId(communityId);
            return posts.stream()
                    .map(CommunityPostMapper::toDto)
                    .toList();
        });
    }
}

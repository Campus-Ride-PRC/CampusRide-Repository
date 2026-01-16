package campus.ride.useCases;

import campus.ride.contracts.community.CommunityCommentRepository;
import campus.ride.entities.CommunityComment;
import campus.ride.entities.CommunityPost;
import campus.ride.entities.User;
import campus.ride.interfaces.CommunityCommentService;
import campus.ride.transfer.dtos.community.CommunityCommentDto;
import campus.ride.transfer.dtos.user.UserResponseDto;
import campus.ride.transfer.mappings.CommunityCommentMapper;
import campus.ride.transfer.mappings.UserMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class CommunityCommentServiceImpl implements CommunityCommentService {

    private final CommunityCommentRepository commentRepository;

    public CommunityCommentServiceImpl(CommunityCommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public CompletableFuture<CommunityCommentDto> createComment(Long postId, String content, UserResponseDto authorDto) {
        return CompletableFuture.supplyAsync(() -> {
            User author = UserMapper.toEntity(authorDto);
            
            CommunityPost post = new CommunityPost();
            post.setId(postId);
            
            CommunityComment comment = new CommunityComment(post, author, content);
            CommunityComment savedComment = commentRepository.save(comment);
            
            return CommunityCommentMapper.toDto(savedComment);
        });
    }

    @Override
    public CompletableFuture<List<CommunityCommentDto>> getCommentsByPost(Long postId) {
        return CompletableFuture.supplyAsync(() -> {
            List<CommunityComment> comments = commentRepository.findByPostId(postId);
            return comments.stream()
                    .map(CommunityCommentMapper::toDto)
                    .toList();
        });
    }
}

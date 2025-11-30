package campus.ride.api.config;

import campus.ride.config.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

// Removed @Component to prevent double registration
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected boolean shouldNotFilterAsyncDispatch() {
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        final String authorizationHeader = request.getHeader("Authorization");
        final String requestURI = request.getRequestURI();
        final jakarta.servlet.DispatcherType dispatcherType = request.getDispatcherType();

        String email = null;
        String jwt = null;

        if (logger.isDebugEnabled()) {
            logger.debug("Processing request to: " + requestURI + " with dispatcher type: " + dispatcherType);
            logger.debug("Authorization header present: " + (authorizationHeader != null));
        }

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7).trim(); 
            try {
                email = jwtUtil.extractEmail(jwt);
                if (logger.isDebugEnabled()) {
                    logger.debug("Extracted email from token: " + email);
                }
            } catch (Exception e) {
                logger.error("Failed to extract email from JWT token for " + requestURI + ": " + e.getMessage());
                if (logger.isDebugEnabled()) {
                    logger.debug("Token that failed: " + jwt);
                }
            }
        }

        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                if (jwtUtil.validateToken(jwt)) {
                    UsernamePasswordAuthenticationToken authenticationToken = 
                        new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    if (logger.isDebugEnabled()) {
                        logger.debug("Authentication successful for: " + email + " on " + requestURI);
                    }
                } else {
                    logger.warn("Token validation failed for " + requestURI);
                }
            } catch (Exception e) {
                logger.error("Token validation failed for " + requestURI + ": " + e.getMessage());
            }
        } else if (authorizationHeader != null) {
            logger.warn("No email extracted or authentication already present for " + requestURI);
        }

        filterChain.doFilter(request, response);
    }
}

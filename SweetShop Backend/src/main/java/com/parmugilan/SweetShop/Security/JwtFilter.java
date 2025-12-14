package com.parmugilan.SweetShop.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();  // Changed from getServletPath() to getRequestURI()
        String method = request.getMethod();

        // Debug logging
        System.out.println("DEBUG - Request URI: " + path);
        System.out.println("DEBUG - Request Method: " + method);

        // Skip JWT validation for public endpoints (login and create)
        if (path.equals("/api/auth/login") ||
                path.equals("/api/auth/create") ||
                path.startsWith("/api/auth/login") ||
                path.startsWith("/api/auth/create")) {
            System.out.println("DEBUG - Skipping JWT validation for public endpoint");
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwtUtil.validatejwttoken(token)) {
                    String email = jwtUtil.extractUsername(token);
                    String role = jwtUtil.extractRole(token);

                    System.out.println("DEBUG - Email: " + email);
                    System.out.println("DEBUG - Extracted Role: " + role);
                    System.out.println("DEBUG - Authority: ROLE_" + role);

                    // Create authority with ROLE_ prefix (Spring Security requirement)
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);

                    var auth = new UsernamePasswordAuthenticationToken(
                            email,
                            null,
                            List.of(authority)
                    );

                    SecurityContextHolder.getContext().setAuthentication(auth);
                    System.out.println("DEBUG - Authentication set successfully");
                }
            } catch (Exception e) {
                System.err.println("ERROR - Token processing failed: " + e.getMessage());
                e.printStackTrace();
            }
        }

        filterChain.doFilter(request, response);
    }
}
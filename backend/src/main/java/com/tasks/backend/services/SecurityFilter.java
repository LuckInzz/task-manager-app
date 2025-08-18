package com.tasks.backend.services;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Autowired
    public SecurityFilter(JwtService jwtService, UserDetailsService userDetailsService){
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Verifica se o cabeçalho de autorização existe e se começa com "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Se não, passa para o próximo filtro e termina
            return;
        }

        // 2. Extrai o token do cabeçalho (remove o "Bearer ")
        jwt = authHeader.substring(7);

        // 3. Extrai o email do utilizador a partir do token
        userEmail = jwtService.extractUsername(jwt);

        // 4. Verifica se o email existe e se o utilizador ainda não está autenticado
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Carrega os detalhes do utilizador da base de dados
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 5. Valida o token (compara com os detalhes do utilizador)
            if (jwtService.isTokenValid(jwt, userDetails)) {
                // Se o token for válido, cria um objeto de autenticação
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // As credenciais são nulas porque já foram validadas pelo token
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 6. Atualiza o Contexto de Segurança do Spring
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        
        // Passa a requisição para o próximo filtro na cadeia
        filterChain.doFilter(request, response);

    }
    
}

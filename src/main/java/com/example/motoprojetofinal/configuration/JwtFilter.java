package com.example.motoprojetofinal.configuration;

import com.example.motoprojetofinal.services.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
//@Autowired injeção de independencia
import java.io.IOException;
import java.security.cert.X509CertSelector;

@Component
public class JwtFilter extends OncePerRequestFilter {
    @Autowired
    private TokenService tokenService;

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

            String uri = request.getRequestURI();
            if(uri.startsWith("/swaggger-ui")
                    ||uri.startsWith("/v2/api-docs")
                ||uri.startsWith("v3/api-docs")
            ||uri.startsWith("/swagger-resources")
            ||uri.startsWith("/webjars")){
                filterChain.doFilter(request, response);
            }


            String autHheader = request.getHeader("Authorization");

            if (autHheader != null && autHheader.startsWith("Bearer ")) {
                String token = autHheader.replace("Bearer ", "");
                try {
                    var jwtValidader = tokenService.verificarToken(token);
                    System.out.println(jwtValidader.getSubject());
                } catch (Exception e) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().println("Token invalido");
                    return;
                }



            }else{
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().println("Token invalido");
                return;
            }
        filterChain.doFilter(request, response);
        }
    }

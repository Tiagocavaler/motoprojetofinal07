package com.example.motoprojetofinal.services;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;

//Para funcionar, o import tem que ser da biblioteca SPRING, e nao da LOMBOK
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    /*Esse TokenService existe para resolver um problema especÃ­fico: depois que o usuÃ¡rio faz login,
    como a API vai saber que ele estÃ¡ autenticado nas prÃ³ximas requisiÃ§Ãµes?
    A resposta Ã©: usando um token JWT.*/
    @Value("${spring.secret}")
    private String secret;

    @Value("${spring.expiracao}")
    private Long expiracao;

    @Value("${spring.emissor}")
    private String emissor;

    public String gerarToken(String subject){
        try{

            //Hash
            Algorithm algorithm = Algorithm.HMAC256(secret);

            String token = com.auth0.jwt.JWT.create()
                    .withIssuer(emissor)
                    .withSubject(subject)
                    .withExpiresAt(getDataExpiracao())
                    .sign(algorithm);

            return token;

        }catch (RuntimeException e){
            throw new RuntimeException(e);
        }
    }
    public DecodedJWT verificarToken(String token) throws JWTDecodeException {
        Algorithm algorithm = Algorithm.HMAC256(secret);
    JWTVerifier verificador = JWT.require(algorithm).withIssuer(emissor).build();
    return verificador.verify(token);

    }

    private Instant getDataExpiracao(){

        //Pegar data atual
        var dataAtual = LocalDateTime.now();
        //Adicionar ou diminuir tempo da data atual
        var dataFutura = dataAtual.plusMinutes(expiracao);

        //Converter em instant
        return dataFutura.toInstant(ZoneOffset.of("-03:00"));
    }
}

package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.DTOs.ForgotPasswordRequest;
import com.example.motoprojetofinal.DTOs.LoginRequest;
import com.example.motoprojetofinal.DTOs.LoginResponse;
import com.example.motoprojetofinal.DTOs.ResetPasswordRequest;
import com.example.motoprojetofinal.repository.ClienteRepository;
import com.example.motoprojetofinal.services.PasswordResetService;
import com.example.motoprojetofinal.services.TokenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.HttpURLConnection;

@RestController
@RequestMapping("/auth")
@Tag(name = "Autenticação", description = "Controller de autenticação")
public class AuthContrroller {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private ClienteRepository clienteRepository;

    @PostMapping("/login")
    @Operation(summary = "Autenticação de usuarios", description = "Método de login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){

        if (clienteRepository.existsUsuarioByEmailAndSenha(loginRequest.email(), loginRequest.senha())){

            var token = tokenService.gerarToken(loginRequest.email());

            //Gerar o token
            return ResponseEntity.ok(new LoginResponse(token));
        }
        return ResponseEntity.status(HttpURLConnection.HTTP_UNAUTHORIZED).build();
    }

    @PostMapping("/login/esqueci-senha")
    @Operation(
            summary = "Solicitar recuperação de senha",
            description = "Gera um token temporário para recuperação da senha"
    )
    public ResponseEntity<?> esqueciSenha(
            @RequestBody ForgotPasswordRequest request) {

        String token = passwordResetService.gerarTokenRecuperacao(
                request.email()
        );

        return ResponseEntity.ok(token);
    }

    @PostMapping("/login/recuperar-senha")
    @Operation(
            summary = "Recuperar senha",
            description = "Valida o token e altera a senha do usuário"
    )
    public ResponseEntity<?> recuperarSenha(
            @RequestBody ResetPasswordRequest request) {

        passwordResetService.recuperarSenha(
                request.token(),
                request.novaSenha()
        );

        return ResponseEntity.ok("Senha alterada com sucesso!");
    }
}
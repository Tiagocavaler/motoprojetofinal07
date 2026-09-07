package com.example.motoprojetofinal.services;

import com.example.motoprojetofinal.entities.Cliente;
import com.example.motoprojetofinal.entities.PasswordResetToken;
import com.example.motoprojetofinal.repository.ClienteRepository;
import com.example.motoprojetofinal.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    public String gerarTokenRecuperacao(String email){

        var cliente = clienteRepository.findByEmail(email);

        if (cliente.isEmpty()){
            throw new RuntimeException("Usuário não encontrado");
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken passwordResetToken = new PasswordResetToken();

        passwordResetToken.setToken(token);
        passwordResetToken.setCliente(cliente.get());
        passwordResetToken.setExpiracao(LocalDateTime.now().plusMinutes(15));

        passwordResetTokenRepository.save(passwordResetToken);

        return token;
    }

    public boolean tokenExpirado(PasswordResetToken passwordResetToken){
        return LocalDateTime.now().isAfter(passwordResetToken.getExpiracao());
    }


    public PasswordResetToken validarToken(String token) {

        var tokenEncontrado = passwordResetTokenRepository.findByToken(token);

        if (tokenEncontrado.isEmpty()) {
            throw new RuntimeException("Token inválido");
        }

        PasswordResetToken passwordResetToken = tokenEncontrado.get();

        if (LocalDateTime.now().isAfter(passwordResetToken.getExpiracao())) {
            throw new RuntimeException("Token expirado");
        }

        return passwordResetToken;
    }

    public void recuperarSenha(String token, String novaSenha) {

        PasswordResetToken passwordResetToken = validarToken(token);

        Cliente cliente = passwordResetToken.getCliente();

        cliente.setSenha(novaSenha);

        clienteRepository.save(cliente);

        passwordResetTokenRepository.delete(passwordResetToken);
    }
}

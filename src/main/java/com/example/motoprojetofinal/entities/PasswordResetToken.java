package com.example.motoprojetofinal.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Token que será enviado ao usuário
    private String token;

    //Usuário que solicitou a recuperação
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Cliente cliente;

    private LocalDateTime expiracao;
}

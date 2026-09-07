package com.example.motoprojetofinal.repository;

import com.example.motoprojetofinal.entities.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente,Long> {

    boolean existsUsuarioByEmailAndSenha(String email, String senha);

    Optional<Cliente> findByEmail(String email);
}

package com.example.motoprojetofinal.controllers;

import com.example.motoprojetofinal.DTOs.AtualizarStatusRequest;
import com.example.motoprojetofinal.entities.Cliente;
import com.example.motoprojetofinal.entities.EnumStatusCliente;
import com.example.motoprojetofinal.repository.ClienteRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
/*A @Tag é uma anotação do Swagger/OpenAPI usada para agrupar e organizar os endpoints da sua API na documentação do Swagger UI.*/
@Tag(name = "Usuario", description = "Grupo de APIs Responsável por controlar a estrutura de criação e consulta de usuários do sistema!")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    /*Esse @Operation também é do Swagger/OpenAPI, mas ele serve para documentar uma operação específica da API,
    enquanto o @Tag organiza o controller em um grupo.*/
    @Operation(summary = "Método de consulta de lista de usuários!",
            description = "Método responsável em efetuar a consulta de todos os usuários sem filtro!")

    public ResponseEntity<?> listarTodos(){

        return ResponseEntity.ok(clienteRepository.findAll());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Método de busca de usuários!",
            description = "Método responsável em efetuar a busca de um usuario especifico utilizando o ID!")
    public ResponseEntity<Cliente> buscarPorId(@PathVariable Long id){
        Cliente clienteBanco = clienteRepository.findById(id).orElse(null);
        if (clienteBanco!=null){
            return ResponseEntity.ok(clienteBanco);
        }
        return ResponseEntity.notFound().build();
    }

    /*Acesso -> saida -> Nome -> Entrada*/
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Método de criação de usuários!",
            description = "Método responsável em efetuar a criação de novos usuários!")
    public ResponseEntity<Cliente> criar(@RequestBody Cliente cliente){

        var clienteBanco = clienteRepository.save(cliente);

        return ResponseEntity.ok(clienteBanco);
    }


    /* Quando o cliente precisa atualizar apenas alguns atributos (ex: mudar apenas o e-mail de um usuário)*/
    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> atualizarStatus(@PathVariable Long id, @RequestBody AtualizarStatusRequest statusRequest){
        Cliente clienteBanco = clienteRepository.findById(id).orElse(null);
        if (clienteBanco!= null){
            clienteBanco.setStatus(statusRequest.status());
            clienteRepository.save(clienteBanco);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }


    /*É utilizado para atualizações completas, onde o corpo da requisição deve conter todos os campos do objeto,
    caso algum campo não seja incluído no corpo da requisição, ele pode ser resolvido para null ou valor padrão*/
    @PutMapping("/{id}")
    @Operation(summary = "Método de edição de usuarios",
            description = "Método responsável pela edição de usuarios cadastrados no sistema")
    public ResponseEntity<Cliente> atualizar(@PathVariable Long id, @RequestBody Cliente cliente){
        try {
            Cliente clienteBanco = clienteRepository.findById(id).orElse(null);
            if (clienteBanco!= null){
                clienteBanco.setStatus(cliente.getStatus());
                clienteBanco.setNome(cliente.getNome());
                clienteBanco.setCpf(cliente.getCpf());
                clienteBanco.setEmail(cliente.getEmail());
                clienteBanco.setSenha(cliente.getSenha());
                clienteRepository.save(clienteBanco);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/{id}/excluir")
    public ResponseEntity<Void> excluir(@PathVariable Long id){

        Cliente clienteBanco = clienteRepository.findById(id).orElse(null);
        if (clienteBanco!= null){
            clienteBanco.setStatus(EnumStatusCliente.EXCLUIDO);
            clienteRepository.save(clienteBanco);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}






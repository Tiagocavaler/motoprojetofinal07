package com.example.motoprojetofinal.DTOs;

/*Um record é uma forma mais enxuta de criar uma classe que serve principalmente para transportar dados.*/

/*A grande vantagem do record é que o Java gera automaticamente várias coisas para você,
como construtor, métodos de acesso, equals(), hashCode() e toString().*/

public record LoginRequest(String email, String senha) {
}


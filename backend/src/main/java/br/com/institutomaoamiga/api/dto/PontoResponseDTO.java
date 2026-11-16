package br.com.institutomaoamiga.api.dto;

import java.util.UUID;

import br.com.institutomaoamiga.api.entity.Ponto;
import br.com.institutomaoamiga.api.entity.TipoPonto;

public record PontoResponseDTO(
    UUID id,
    String nome,
    String endereco,
    String bairro,
    String horario,
    TipoPonto tipo
) {
    public static PontoResponseDTO fromEntity(Ponto ponto) {
        return new PontoResponseDTO(
            ponto.getId(),
            ponto.getNome(),
            ponto.getEndereco(),
            ponto.getBairro(),
            ponto.getHorario(),
            ponto.getTipo()
        );
    }
}
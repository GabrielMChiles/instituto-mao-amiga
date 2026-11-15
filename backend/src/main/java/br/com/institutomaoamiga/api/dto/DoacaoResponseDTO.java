package br.com.institutomaoamiga.api.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import br.com.institutomaoamiga.api.entity.Doacao;

public record DoacaoResponseDTO(
    UUID id,
    String tipoItem,
    Integer quantidade,
    String pontoDestino,
    LocalDateTime criadoEm
) {
    public static DoacaoResponseDTO fromEntity(Doacao doacao) {
        return new DoacaoResponseDTO(
            doacao.getId(),
            doacao.getTipoItem(),
            doacao.getQuantidade(),
            doacao.getPontoDestino(),
            doacao.getCriadoEm()
        );
    }
}
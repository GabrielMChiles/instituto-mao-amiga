package br.com.institutomaoamiga.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DoacaoRequestDTO(
    @NotBlank(message = "O tipo do item é obrigatório e não pode estar vazio.")
    String tipoItem,

    @NotNull(message = "A quantidade é obrigatória.")
    @Min(value = 1, message = "A quantidade deve ser maior que zero.")
    Integer quantidade,

    @NotBlank(message = "O ponto de destino é obrigatório e não pode estar vazio.")
    String pontoDestino
) {}
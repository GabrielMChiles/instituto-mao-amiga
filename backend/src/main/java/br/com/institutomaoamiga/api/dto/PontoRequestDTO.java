package br.com.institutomaoamiga.api.dto;

import br.com.institutomaoamiga.api.entity.TipoPonto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PontoRequestDTO(
    @NotBlank(message = "O nome é obrigatório e não pode estar vazio.")
    String nome,

    @NotBlank(message = "O endereço é obrigatório e não pode estar vazio.")
    String endereco,

    @NotBlank(message = "O bairro é obrigatório e não pode estar vazio.")
    String bairro,

    @NotBlank(message = "O horário é obrigatório e não pode estar vazio.")
    String horario,

    @NotNull(message = "O tipo é obrigatório.")
    TipoPonto tipo
) {}
package br.com.institutomaoamiga.api.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.institutomaoamiga.api.dto.PontoRequestDTO;
import br.com.institutomaoamiga.api.dto.PontoResponseDTO;
import br.com.institutomaoamiga.api.entity.Ponto;
import br.com.institutomaoamiga.api.exception.ResourceNotFoundException;
import br.com.institutomaoamiga.api.repository.PontoRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PontoService {

    private final PontoRepository pontoRepository;

    public PontoService(PontoRepository pontoRepository) {
        this.pontoRepository = pontoRepository;
    }

    @Transactional(readOnly = true)
    public List<PontoResponseDTO> listarTodos() {
        return pontoRepository.findAll().stream()
                .map(PontoResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PontoResponseDTO buscarPorId(UUID id) {
        Ponto ponto = pontoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto não encontrado com o ID: " + id));
        return PontoResponseDTO.fromEntity(ponto);
    }

    @Transactional
    public PontoResponseDTO salvar(PontoRequestDTO dto) {
        Ponto ponto = Ponto.builder()
                .nome(dto.nome())
                .endereco(dto.endereco())
                .bairro(dto.bairro())
                .horario(dto.horario())
                .tipo(dto.tipo())
                .build();
        
        Ponto salvo = pontoRepository.save(ponto);
        return PontoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public PontoResponseDTO atualizar(UUID id, PontoRequestDTO dto) {
        Ponto ponto = pontoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ponto não encontrado para atualização com ID: " + id));

        ponto.setNome(dto.nome());
        ponto.setEndereco(dto.endereco());
        ponto.setBairro(dto.bairro());
        ponto.setHorario(dto.horario());
        ponto.setTipo(dto.tipo());

        Ponto atualizado = pontoRepository.save(ponto);
        return PontoResponseDTO.fromEntity(atualizado);
    }

    @Transactional
    public void deletar(UUID id) {
        if (!pontoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Ponto não encontrado para exclusão com ID: " + id);
        }
        pontoRepository.deleteById(id);
    }
}

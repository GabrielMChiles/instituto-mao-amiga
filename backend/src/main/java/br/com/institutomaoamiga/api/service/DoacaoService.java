package br.com.institutomaoamiga.api.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.com.institutomaoamiga.api.dto.DoacaoRequestDTO;
import br.com.institutomaoamiga.api.dto.DoacaoResponseDTO;
import br.com.institutomaoamiga.api.entity.Doacao;
import br.com.institutomaoamiga.api.exception.ResourceNotFoundException;
import br.com.institutomaoamiga.api.repository.DoacaoRepository;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class DoacaoService {

    private final DoacaoRepository doacaoRepository;

    public DoacaoService(DoacaoRepository doacaoRepository) {
        this.doacaoRepository = doacaoRepository;
    }

    @Transactional(readOnly = true)
    public Page<DoacaoResponseDTO> listarComFiltro(String filtro, Pageable pageable) {
        Page<Doacao> doacoesPage = doacaoRepository.buscarPorTipoItem(filtro, pageable);
        return doacoesPage.map(DoacaoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public DoacaoResponseDTO buscarPorId(UUID id) {
        Doacao doacao = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doação não encontrada com o ID: " + id));
        return DoacaoResponseDTO.fromEntity(doacao);
    }

    @Transactional
    public DoacaoResponseDTO salvar(DoacaoRequestDTO dto) {
        Doacao doacao = Doacao.builder()
                .tipoItem(dto.tipoItem())
                .quantidade(dto.quantidade())
                .pontoDestino(dto.pontoDestino())
                .criadoEm(LocalDateTime.now()) // Atributo de auditoria gerado estritamente no servidor
                .build();

        Doacao salva = doacaoRepository.save(doacao);
        return DoacaoResponseDTO.fromEntity(salva);
    }

    @Transactional
    public DoacaoResponseDTO atualizar(UUID id, DoacaoRequestDTO dto) {
        Doacao doacao = doacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doação não encontrada para atualização com ID: " + id));

        doacao.setTipoItem(dto.tipoItem());
        doacao.setQuantidade(dto.quantidade());
        doacao.setPontoDestino(dto.pontoDestino());
        // O campo 'criadoEm' é intencionalmente preservado e NÃO é atualizado.

        Doacao atualizada = doacaoRepository.save(doacao);
        return DoacaoResponseDTO.fromEntity(atualizada);
    }

    @Transactional
    public void deletar(UUID id) {
        if (!doacaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Doação não encontrada para exclusão com ID: " + id);
        }
        doacaoRepository.deleteById(id);
    }
}
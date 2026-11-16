package br.com.institutomaoamiga.api.controller;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.institutomaoamiga.api.dto.DoacaoRequestDTO;
import br.com.institutomaoamiga.api.dto.DoacaoResponseDTO;
import br.com.institutomaoamiga.api.service.DoacaoService;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doacoes")
@CrossOrigin(origins = "*")
public class DoacaoController {

    private final DoacaoService doacaoService;

    public DoacaoController(DoacaoService doacaoService) {
        this.doacaoService = doacaoService;
    }

    @GetMapping
    public ResponseEntity<Page<DoacaoResponseDTO>> listarPaginado(
            @RequestParam(required = false) String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<DoacaoResponseDTO> pagina = doacaoService.listarComFiltro(filtro, pageable);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/filtro")
    public ResponseEntity<Page<DoacaoResponseDTO>> filtrarDoacoes(
            @RequestParam(required = false) String filtro,
            @PageableDefault(size = 10, sort = "criadoEm", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<DoacaoResponseDTO> pagina = doacaoService.listarComFiltro(filtro, pageable);
        return ResponseEntity.ok(pagina);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(doacaoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<DoacaoResponseDTO> criar(@RequestBody @Valid DoacaoRequestDTO dto) {
        DoacaoResponseDTO novaDoacao = doacaoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaDoacao);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DoacaoResponseDTO> atualizar(@PathVariable UUID id, @RequestBody @Valid DoacaoRequestDTO dto) {
        DoacaoResponseDTO doacaoAtualizada = doacaoService.atualizar(id, dto);
        return ResponseEntity.ok(doacaoAtualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        doacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
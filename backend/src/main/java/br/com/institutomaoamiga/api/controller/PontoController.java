package br.com.institutomaoamiga.api.controller;


import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import br.com.institutomaoamiga.api.dto.PontoRequestDTO;
import br.com.institutomaoamiga.api.dto.PontoResponseDTO;
import br.com.institutomaoamiga.api.service.PontoService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pontos")
@CrossOrigin(origins = "*")
public class PontoController {

    private final PontoService pontoService;

    public PontoController(PontoService pontoService) {
        this.pontoService = pontoService;
    }

    @GetMapping
    public ResponseEntity<List<PontoResponseDTO>> listar() {
        return ResponseEntity.ok(pontoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PontoResponseDTO> buscarPorId(@PathVariable UUID id) {
        return ResponseEntity.ok(pontoService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PontoResponseDTO> criar(@RequestBody @Valid PontoRequestDTO dto) {
        PontoResponseDTO novoPonto = pontoService.salvar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoPonto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PontoResponseDTO> atualizar(@PathVariable UUID id, @RequestBody @Valid PontoRequestDTO dto) {
        PontoResponseDTO pontoAtualizado = pontoService.atualizar(id, dto);
        return ResponseEntity.ok(pontoAtualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable UUID id) {
        pontoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
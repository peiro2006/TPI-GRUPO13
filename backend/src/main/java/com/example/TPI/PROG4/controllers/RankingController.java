package com.example.TPI.PROG4.controllers;

import com.example.TPI.PROG4.dtos.response.RankingResponse;
import com.example.TPI.PROG4.services.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping
    public ResponseEntity<List<RankingResponse>> obtenerRanking(
            @RequestParam(defaultValue = "desc") String orden,
            @RequestParam(required = false) String clan) {
        return ResponseEntity.ok(rankingService.obtenerRanking(orden, clan));
    }

    @GetMapping("/clanes")
    public ResponseEntity<List<String>> obtenerClanes() {
        return ResponseEntity.ok(rankingService.obtenerClanes());
    }

    @GetMapping("/usuario/{id}")
    public ResponseEntity<RankingResponse> obtenerPerfil(@PathVariable Long id) {
        return ResponseEntity.ok(rankingService.obtenerPerfil(id));
    }
}

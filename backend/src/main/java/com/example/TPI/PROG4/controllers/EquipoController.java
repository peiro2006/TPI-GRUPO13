package com.example.TPI.PROG4.controllers;
import com.example.TPI.PROG4.Interfaces.ICreateEquipoService;
import com.example.TPI.PROG4.Interfaces.IEquipoGetService;
import com.example.TPI.PROG4.Interfaces.IEquipoListService;
import com.example.TPI.PROG4.Interfaces.IEquipoSoftDeleteService;
import com.example.TPI.PROG4.configs.BaseResponse;
import com.example.TPI.PROG4.dtos.request.EquipoCreateReqDto;
import com.example.TPI.PROG4.dtos.response.EquipoCreateResDto;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/equipo")
@CrossOrigin(origins = "http://localhost:4200")
@AllArgsConstructor
public class EquipoController {

    private final ICreateEquipoService equipoCreateService;
    private final IEquipoListService equipoList;
    private final IEquipoGetService equipoGet;
    private final IEquipoSoftDeleteService equipoSoftDeleteService;

    @PostMapping
    public ResponseEntity<BaseResponse<EquipoCreateResDto>> createEquipo(
            @Valid @RequestBody EquipoCreateReqDto request
    ) {
        return ResponseEntity.ok(
                BaseResponse.ok(
                        equipoCreateService.execute(request),
                        "Equipo creado correctamente"
                )
        );

    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<EquipoCreateResDto>>> listEquipo(
            @RequestParam(required = false) String nombre_equipo,
            @RequestParam(required = false) String descripcion_equipo,
            @RequestParam(required = false) String nombre_corto) {

        return ResponseEntity.ok(
                BaseResponse.ok(
                        equipoList.execute(nombre_equipo, descripcion_equipo, nombre_corto), "Equipos listados correctamente")
        );

    }

    @GetMapping("/{id}")
    public ResponseEntity<BaseResponse<EquipoCreateResDto>> getEquipo(
            @PathVariable Short id) {

        return ResponseEntity.ok(
                BaseResponse.ok(
                        equipoGet.execute(id),
                        "Equipo obtenido correctamente"
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<BaseResponse<Void>> deleteEquipo(
            @PathVariable Short id
    ) {
        equipoSoftDeleteService.execute(id);
        return ResponseEntity.ok(
                BaseResponse.noContent(
                        "Equipo eliminado correctamente"
                )
        );
    }



}

package com.profe_me_quiero_graduar.app.web.rest;

import com.profe_me_quiero_graduar.app.repository.ComentariosRepository;
import com.profe_me_quiero_graduar.app.service.ComentariosService;
import com.profe_me_quiero_graduar.app.service.dto.ComentariosDTO;
import com.profe_me_quiero_graduar.app.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.reactive.ResponseUtil;

/**
 * REST controller for managing {@link com.profe_me_quiero_graduar.app.domain.Comentarios}.
 */
@RestController
@RequestMapping("/api")
public class ComentariosResource {

    private final Logger log = LoggerFactory.getLogger(ComentariosResource.class);

    private static final String ENTITY_NAME = "comentarios";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ComentariosService comentariosService;

    private final ComentariosRepository comentariosRepository;

    public ComentariosResource(ComentariosService comentariosService, ComentariosRepository comentariosRepository) {
        this.comentariosService = comentariosService;
        this.comentariosRepository = comentariosRepository;
    }

    /**
     * {@code POST  /comentarios} : Create a new comentarios.
     *
     * @param comentariosDTO the comentariosDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new comentariosDTO, or with status {@code 400 (Bad Request)} if the comentarios has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/comentarios")
    public Mono<ResponseEntity<ComentariosDTO>> createComentarios(@Valid @RequestBody ComentariosDTO comentariosDTO)
        throws URISyntaxException {
        log.debug("REST request to save Comentarios : {}", comentariosDTO);
        if (comentariosDTO.getId() != null) {
            throw new BadRequestAlertException("A new comentarios cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return comentariosService
            .save(comentariosDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/comentarios/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /comentarios/:id} : Updates an existing comentarios.
     *
     * @param id the id of the comentariosDTO to save.
     * @param comentariosDTO the comentariosDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated comentariosDTO,
     * or with status {@code 400 (Bad Request)} if the comentariosDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the comentariosDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/comentarios/{id}")
    public Mono<ResponseEntity<ComentariosDTO>> updateComentarios(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody ComentariosDTO comentariosDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Comentarios : {}, {}", id, comentariosDTO);
        if (comentariosDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, comentariosDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return comentariosRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return comentariosService
                    .save(comentariosDTO)
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(result ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                            .body(result)
                    );
            });
    }

    /**
     * {@code PATCH  /comentarios/:id} : Partial updates given fields of an existing comentarios, field will ignore if it is null
     *
     * @param id the id of the comentariosDTO to save.
     * @param comentariosDTO the comentariosDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated comentariosDTO,
     * or with status {@code 400 (Bad Request)} if the comentariosDTO is not valid,
     * or with status {@code 404 (Not Found)} if the comentariosDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the comentariosDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/comentarios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<ComentariosDTO>> partialUpdateComentarios(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody ComentariosDTO comentariosDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Comentarios partially : {}, {}", id, comentariosDTO);
        if (comentariosDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, comentariosDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return comentariosRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<ComentariosDTO> result = comentariosService.partialUpdate(comentariosDTO);

                return result
                    .switchIfEmpty(Mono.error(new ResponseStatusException(HttpStatus.NOT_FOUND)))
                    .map(res ->
                        ResponseEntity
                            .ok()
                            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, res.getId().toString()))
                            .body(res)
                    );
            });
    }

    /**
     * {@code GET  /comentarios} : get all the comentarios.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of comentarios in body.
     */
    @GetMapping("/comentarios")
    public Mono<ResponseEntity<List<ComentariosDTO>>> getAllComentarios(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of Comentarios");
        return comentariosService
            .countAll()
            .zipWith(comentariosService.findAll(pageable).collectList())
            .map(countWithEntities -> {
                return ResponseEntity
                    .ok()
                    .headers(
                        PaginationUtil.generatePaginationHttpHeaders(
                            UriComponentsBuilder.fromHttpRequest(request),
                            new PageImpl<>(countWithEntities.getT2(), pageable, countWithEntities.getT1())
                        )
                    )
                    .body(countWithEntities.getT2());
            });
    }

    /**
     * {@code GET  /comentarios/:id} : get the "id" comentarios.
     *
     * @param id the id of the comentariosDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the comentariosDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/comentarios/{id}")
    public Mono<ResponseEntity<ComentariosDTO>> getComentarios(@PathVariable Long id) {
        log.debug("REST request to get Comentarios : {}", id);
        Mono<ComentariosDTO> comentariosDTO = comentariosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(comentariosDTO);
    }

    /**
     * {@code DELETE  /comentarios/:id} : delete the "id" comentarios.
     *
     * @param id the id of the comentariosDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/comentarios/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteComentarios(@PathVariable Long id) {
        log.debug("REST request to delete Comentarios : {}", id);
        return comentariosService
            .delete(id)
            .map(result ->
                ResponseEntity
                    .noContent()
                    .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
                    .build()
            );
    }
}

package com.profe_me_quiero_graduar.app.web.rest;

import com.profe_me_quiero_graduar.app.repository.AnunciosRepository;
import com.profe_me_quiero_graduar.app.service.AnunciosService;
import com.profe_me_quiero_graduar.app.service.dto.AnunciosDTO;
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
 * REST controller for managing {@link com.profe_me_quiero_graduar.app.domain.Anuncios}.
 */
@RestController
@RequestMapping("/api")
public class AnunciosResource {

    private final Logger log = LoggerFactory.getLogger(AnunciosResource.class);

    private static final String ENTITY_NAME = "anuncios";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AnunciosService anunciosService;

    private final AnunciosRepository anunciosRepository;

    public AnunciosResource(AnunciosService anunciosService, AnunciosRepository anunciosRepository) {
        this.anunciosService = anunciosService;
        this.anunciosRepository = anunciosRepository;
    }

    /**
     * {@code POST  /anuncios} : Create a new anuncios.
     *
     * @param anunciosDTO the anunciosDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new anunciosDTO, or with status {@code 400 (Bad Request)} if the anuncios has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/anuncios")
    public Mono<ResponseEntity<AnunciosDTO>> createAnuncios(@Valid @RequestBody AnunciosDTO anunciosDTO) throws URISyntaxException {
        log.debug("REST request to save Anuncios : {}", anunciosDTO);
        if (anunciosDTO.getId() != null) {
            throw new BadRequestAlertException("A new anuncios cannot already have an ID", ENTITY_NAME, "idexists");
        }
        return anunciosService
            .save(anunciosDTO)
            .map(result -> {
                try {
                    return ResponseEntity
                        .created(new URI("/api/anuncios/" + result.getId()))
                        .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
                        .body(result);
                } catch (URISyntaxException e) {
                    throw new RuntimeException(e);
                }
            });
    }

    /**
     * {@code PUT  /anuncios/:id} : Updates an existing anuncios.
     *
     * @param id the id of the anunciosDTO to save.
     * @param anunciosDTO the anunciosDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anunciosDTO,
     * or with status {@code 400 (Bad Request)} if the anunciosDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the anunciosDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/anuncios/{id}")
    public Mono<ResponseEntity<AnunciosDTO>> updateAnuncios(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AnunciosDTO anunciosDTO
    ) throws URISyntaxException {
        log.debug("REST request to update Anuncios : {}, {}", id, anunciosDTO);
        if (anunciosDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anunciosDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return anunciosRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                return anunciosService
                    .save(anunciosDTO)
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
     * {@code PATCH  /anuncios/:id} : Partial updates given fields of an existing anuncios, field will ignore if it is null
     *
     * @param id the id of the anunciosDTO to save.
     * @param anunciosDTO the anunciosDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated anunciosDTO,
     * or with status {@code 400 (Bad Request)} if the anunciosDTO is not valid,
     * or with status {@code 404 (Not Found)} if the anunciosDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the anunciosDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/anuncios/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public Mono<ResponseEntity<AnunciosDTO>> partialUpdateAnuncios(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AnunciosDTO anunciosDTO
    ) throws URISyntaxException {
        log.debug("REST request to partial update Anuncios partially : {}, {}", id, anunciosDTO);
        if (anunciosDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, anunciosDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        return anunciosRepository
            .existsById(id)
            .flatMap(exists -> {
                if (!exists) {
                    return Mono.error(new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound"));
                }

                Mono<AnunciosDTO> result = anunciosService.partialUpdate(anunciosDTO);

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
     * {@code GET  /anuncios} : get all the anuncios.
     *
     * @param pageable the pagination information.
     * @param request a {@link ServerHttpRequest} request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of anuncios in body.
     */
    @GetMapping("/anuncios")
    public Mono<ResponseEntity<List<AnunciosDTO>>> getAllAnuncios(Pageable pageable, ServerHttpRequest request) {
        log.debug("REST request to get a page of Anuncios");
        return anunciosService
            .countAll()
            .zipWith(anunciosService.findAll(pageable).collectList())
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
     * {@code GET  /anuncios/:id} : get the "id" anuncios.
     *
     * @param id the id of the anunciosDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the anunciosDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/anuncios/{id}")
    public Mono<ResponseEntity<AnunciosDTO>> getAnuncios(@PathVariable Long id) {
        log.debug("REST request to get Anuncios : {}", id);
        Mono<AnunciosDTO> anunciosDTO = anunciosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(anunciosDTO);
    }

    /**
     * {@code DELETE  /anuncios/:id} : delete the "id" anuncios.
     *
     * @param id the id of the anunciosDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/anuncios/{id}")
    @ResponseStatus(code = HttpStatus.NO_CONTENT)
    public Mono<ResponseEntity<Void>> deleteAnuncios(@PathVariable Long id) {
        log.debug("REST request to delete Anuncios : {}", id);
        return anunciosService
            .delete(id)
            .map(result ->
                ResponseEntity
                    .noContent()
                    .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
                    .build()
            );
    }
}

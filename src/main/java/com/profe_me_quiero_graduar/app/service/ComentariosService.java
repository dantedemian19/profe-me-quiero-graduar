package com.profe_me_quiero_graduar.app.service;

import com.profe_me_quiero_graduar.app.domain.Comentarios;
import com.profe_me_quiero_graduar.app.repository.ComentariosRepository;
import com.profe_me_quiero_graduar.app.service.dto.ComentariosDTO;
import com.profe_me_quiero_graduar.app.service.mapper.ComentariosMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Comentarios}.
 */
@Service
@Transactional
public class ComentariosService {

    private final Logger log = LoggerFactory.getLogger(ComentariosService.class);

    private final ComentariosRepository comentariosRepository;

    private final ComentariosMapper comentariosMapper;

    public ComentariosService(ComentariosRepository comentariosRepository, ComentariosMapper comentariosMapper) {
        this.comentariosRepository = comentariosRepository;
        this.comentariosMapper = comentariosMapper;
    }

    /**
     * Save a comentarios.
     *
     * @param comentariosDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<ComentariosDTO> save(ComentariosDTO comentariosDTO) {
        log.debug("Request to save Comentarios : {}", comentariosDTO);
        return comentariosRepository.save(comentariosMapper.toEntity(comentariosDTO)).map(comentariosMapper::toDto);
    }

    /**
     * Partially update a comentarios.
     *
     * @param comentariosDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<ComentariosDTO> partialUpdate(ComentariosDTO comentariosDTO) {
        log.debug("Request to partially update Comentarios : {}", comentariosDTO);

        return comentariosRepository
            .findById(comentariosDTO.getId())
            .map(existingComentarios -> {
                comentariosMapper.partialUpdate(existingComentarios, comentariosDTO);

                return existingComentarios;
            })
            .flatMap(comentariosRepository::save)
            .map(comentariosMapper::toDto);
    }

    /**
     * Get all the comentarios.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<ComentariosDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Comentarios");
        return comentariosRepository.findAllBy(pageable).map(comentariosMapper::toDto);
    }

    /**
     * Returns the number of comentarios available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return comentariosRepository.count();
    }

    /**
     * Get one comentarios by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<ComentariosDTO> findOne(Long id) {
        log.debug("Request to get Comentarios : {}", id);
        return comentariosRepository.findById(id).map(comentariosMapper::toDto);
    }

    /**
     * Delete the comentarios by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Comentarios : {}", id);
        return comentariosRepository.deleteById(id);
    }
}

package com.profe_me_quiero_graduar.app.service;

import com.profe_me_quiero_graduar.app.domain.Anuncios;
import com.profe_me_quiero_graduar.app.repository.AnunciosRepository;
import com.profe_me_quiero_graduar.app.service.dto.AnunciosDTO;
import com.profe_me_quiero_graduar.app.service.mapper.AnunciosMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Service Implementation for managing {@link Anuncios}.
 */
@Service
@Transactional
public class AnunciosService {

    private final Logger log = LoggerFactory.getLogger(AnunciosService.class);

    private final AnunciosRepository anunciosRepository;

    private final AnunciosMapper anunciosMapper;

    public AnunciosService(AnunciosRepository anunciosRepository, AnunciosMapper anunciosMapper) {
        this.anunciosRepository = anunciosRepository;
        this.anunciosMapper = anunciosMapper;
    }

    /**
     * Save a anuncios.
     *
     * @param anunciosDTO the entity to save.
     * @return the persisted entity.
     */
    public Mono<AnunciosDTO> save(AnunciosDTO anunciosDTO) {
        log.debug("Request to save Anuncios : {}", anunciosDTO);
        return anunciosRepository.save(anunciosMapper.toEntity(anunciosDTO)).map(anunciosMapper::toDto);
    }

    /**
     * Partially update a anuncios.
     *
     * @param anunciosDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Mono<AnunciosDTO> partialUpdate(AnunciosDTO anunciosDTO) {
        log.debug("Request to partially update Anuncios : {}", anunciosDTO);

        return anunciosRepository
            .findById(anunciosDTO.getId())
            .map(existingAnuncios -> {
                anunciosMapper.partialUpdate(existingAnuncios, anunciosDTO);

                return existingAnuncios;
            })
            .flatMap(anunciosRepository::save)
            .map(anunciosMapper::toDto);
    }

    /**
     * Get all the anuncios.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Flux<AnunciosDTO> findAll(Pageable pageable) {
        log.debug("Request to get all Anuncios");
        return anunciosRepository.findAllBy(pageable).map(anunciosMapper::toDto);
    }

    /**
     * Returns the number of anuncios available.
     * @return the number of entities in the database.
     *
     */
    public Mono<Long> countAll() {
        return anunciosRepository.count();
    }

    /**
     * Get one anuncios by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Mono<AnunciosDTO> findOne(Long id) {
        log.debug("Request to get Anuncios : {}", id);
        return anunciosRepository.findById(id).map(anunciosMapper::toDto);
    }

    /**
     * Delete the anuncios by id.
     *
     * @param id the id of the entity.
     * @return a Mono to signal the deletion
     */
    public Mono<Void> delete(Long id) {
        log.debug("Request to delete Anuncios : {}", id);
        return anunciosRepository.deleteById(id);
    }
}

package com.profe_me_quiero_graduar.app.repository;

import com.profe_me_quiero_graduar.app.domain.Comentarios;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the Comentarios entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ComentariosRepository extends R2dbcRepository<Comentarios, Long>, ComentariosRepositoryInternal {
    Flux<Comentarios> findAllBy(Pageable pageable);

    @Query("SELECT * FROM comentarios entity WHERE entity.anuncio_id = :id")
    Flux<Comentarios> findByAnuncio(Long id);

    @Query("SELECT * FROM comentarios entity WHERE entity.anuncio_id IS NULL")
    Flux<Comentarios> findAllWhereAnuncioIsNull();

    // just to avoid having unambigous methods
    @Override
    Flux<Comentarios> findAll();

    @Override
    Mono<Comentarios> findById(Long id);

    @Override
    <S extends Comentarios> Mono<S> save(S entity);
}

interface ComentariosRepositoryInternal {
    <S extends Comentarios> Mono<S> insert(S entity);
    <S extends Comentarios> Mono<S> save(S entity);
    Mono<Integer> update(Comentarios entity);

    Flux<Comentarios> findAll();
    Mono<Comentarios> findById(Long id);
    Flux<Comentarios> findAllBy(Pageable pageable);
    Flux<Comentarios> findAllBy(Pageable pageable, Criteria criteria);
}

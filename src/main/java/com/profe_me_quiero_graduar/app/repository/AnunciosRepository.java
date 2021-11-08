package com.profe_me_quiero_graduar.app.repository;

import com.profe_me_quiero_graduar.app.domain.Anuncios;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.repository.Query;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive repository for the Anuncios entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AnunciosRepository extends R2dbcRepository<Anuncios, Long>, AnunciosRepositoryInternal {
    Flux<Anuncios> findAllBy(Pageable pageable);

    // just to avoid having unambigous methods
    @Override
    Flux<Anuncios> findAll();

    @Override
    Mono<Anuncios> findById(Long id);

    @Override
    <S extends Anuncios> Mono<S> save(S entity);
}

interface AnunciosRepositoryInternal {
    <S extends Anuncios> Mono<S> insert(S entity);
    <S extends Anuncios> Mono<S> save(S entity);
    Mono<Integer> update(Anuncios entity);

    Flux<Anuncios> findAll();
    Mono<Anuncios> findById(Long id);
    Flux<Anuncios> findAllBy(Pageable pageable);
    Flux<Anuncios> findAllBy(Pageable pageable, Criteria criteria);
}

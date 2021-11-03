package com.profe_me_quiero_graduar.app.repository;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

import com.profe_me_quiero_graduar.app.domain.Anuncios;
import com.profe_me_quiero_graduar.app.repository.rowmapper.AnunciosRowMapper;
import com.profe_me_quiero_graduar.app.service.EntityManager;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.function.BiFunction;
import org.springframework.data.domain.Pageable;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.data.relational.core.query.Criteria;
import org.springframework.data.relational.core.sql.Column;
import org.springframework.data.relational.core.sql.Expression;
import org.springframework.data.relational.core.sql.Select;
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoin;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive custom repository implementation for the Anuncios entity.
 */
@SuppressWarnings("unused")
class AnunciosRepositoryInternalImpl implements AnunciosRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final AnunciosRowMapper anunciosMapper;

    private static final Table entityTable = Table.aliased("anuncios", EntityManager.ENTITY_ALIAS);

    public AnunciosRepositoryInternalImpl(R2dbcEntityTemplate template, EntityManager entityManager, AnunciosRowMapper anunciosMapper) {
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.anunciosMapper = anunciosMapper;
    }

    @Override
    public Flux<Anuncios> findAllBy(Pageable pageable) {
        return findAllBy(pageable, null);
    }

    @Override
    public Flux<Anuncios> findAllBy(Pageable pageable, Criteria criteria) {
        return createQuery(pageable, criteria).all();
    }

    RowsFetchSpec<Anuncios> createQuery(Pageable pageable, Criteria criteria) {
        List<Expression> columns = AnunciosSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        SelectFromAndJoin selectFrom = Select.builder().select(columns).from(entityTable);

        String select = entityManager.createSelect(selectFrom, Anuncios.class, pageable, criteria);
        String alias = entityTable.getReferenceName().getReference();
        String selectWhere = Optional
            .ofNullable(criteria)
            .map(crit ->
                new StringBuilder(select)
                    .append(" ")
                    .append("WHERE")
                    .append(" ")
                    .append(alias)
                    .append(".")
                    .append(crit.toString())
                    .toString()
            )
            .orElse(select); // TODO remove once https://github.com/spring-projects/spring-data-jdbc/issues/907 will be fixed
        return db.sql(selectWhere).map(this::process);
    }

    @Override
    public Flux<Anuncios> findAll() {
        return findAllBy(null, null);
    }

    @Override
    public Mono<Anuncios> findById(Long id) {
        return createQuery(null, where("id").is(id)).one();
    }

    private Anuncios process(Row row, RowMetadata metadata) {
        Anuncios entity = anunciosMapper.apply(row, "e");
        return entity;
    }

    @Override
    public <S extends Anuncios> Mono<S> insert(S entity) {
        return entityManager.insert(entity);
    }

    @Override
    public <S extends Anuncios> Mono<S> save(S entity) {
        if (entity.getId() == null) {
            return insert(entity);
        } else {
            return update(entity)
                .map(numberOfUpdates -> {
                    if (numberOfUpdates.intValue() <= 0) {
                        throw new IllegalStateException("Unable to update Anuncios with id = " + entity.getId());
                    }
                    return entity;
                });
        }
    }

    @Override
    public Mono<Integer> update(Anuncios entity) {
        //fixme is this the proper way?
        return r2dbcEntityTemplate.update(entity).thenReturn(1);
    }
}

class AnunciosSqlHelper {

    static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("title", table, columnPrefix + "_title"));
        columns.add(Column.aliased("photo", table, columnPrefix + "_photo"));
        columns.add(Column.aliased("photo_content_type", table, columnPrefix + "_photo_content_type"));
        columns.add(Column.aliased("text", table, columnPrefix + "_text"));

        return columns;
    }
}

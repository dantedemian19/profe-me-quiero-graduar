package com.profe_me_quiero_graduar.app.repository;

import static org.springframework.data.relational.core.query.Criteria.where;
import static org.springframework.data.relational.core.query.Query.query;

import com.profe_me_quiero_graduar.app.domain.Comentarios;
import com.profe_me_quiero_graduar.app.domain.enumeration.StarCalification;
import com.profe_me_quiero_graduar.app.repository.rowmapper.AnunciosRowMapper;
import com.profe_me_quiero_graduar.app.repository.rowmapper.ComentariosRowMapper;
import com.profe_me_quiero_graduar.app.service.EntityManager;
import io.r2dbc.spi.Row;
import io.r2dbc.spi.RowMetadata;
import java.time.Instant;
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
import org.springframework.data.relational.core.sql.SelectBuilder.SelectFromAndJoinCondition;
import org.springframework.data.relational.core.sql.Table;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.r2dbc.core.RowsFetchSpec;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

/**
 * Spring Data SQL reactive custom repository implementation for the Comentarios entity.
 */
@SuppressWarnings("unused")
class ComentariosRepositoryInternalImpl implements ComentariosRepositoryInternal {

    private final DatabaseClient db;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;
    private final EntityManager entityManager;

    private final AnunciosRowMapper anunciosMapper;
    private final ComentariosRowMapper comentariosMapper;

    private static final Table entityTable = Table.aliased("comentarios", EntityManager.ENTITY_ALIAS);
    private static final Table anuncioTable = Table.aliased("anuncios", "anuncio");

    public ComentariosRepositoryInternalImpl(
        R2dbcEntityTemplate template,
        EntityManager entityManager,
        AnunciosRowMapper anunciosMapper,
        ComentariosRowMapper comentariosMapper
    ) {
        this.db = template.getDatabaseClient();
        this.r2dbcEntityTemplate = template;
        this.entityManager = entityManager;
        this.anunciosMapper = anunciosMapper;
        this.comentariosMapper = comentariosMapper;
    }

    @Override
    public Flux<Comentarios> findAllBy(Pageable pageable) {
        return findAllBy(pageable, null);
    }

    @Override
    public Flux<Comentarios> findAllBy(Pageable pageable, Criteria criteria) {
        return createQuery(pageable, criteria).all();
    }

    RowsFetchSpec<Comentarios> createQuery(Pageable pageable, Criteria criteria) {
        List<Expression> columns = ComentariosSqlHelper.getColumns(entityTable, EntityManager.ENTITY_ALIAS);
        columns.addAll(AnunciosSqlHelper.getColumns(anuncioTable, "anuncio"));
        SelectFromAndJoinCondition selectFrom = Select
            .builder()
            .select(columns)
            .from(entityTable)
            .leftOuterJoin(anuncioTable)
            .on(Column.create("anuncio_id", entityTable))
            .equals(Column.create("id", anuncioTable));

        String select = entityManager.createSelect(selectFrom, Comentarios.class, pageable, criteria);
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
    public Flux<Comentarios> findAll() {
        return findAllBy(null, null);
    }

    @Override
    public Mono<Comentarios> findById(Long id) {
        return createQuery(null, where("id").is(id)).one();
    }

    private Comentarios process(Row row, RowMetadata metadata) {
        Comentarios entity = comentariosMapper.apply(row, "e");
        entity.setAnuncio(anunciosMapper.apply(row, "anuncio"));
        return entity;
    }

    @Override
    public <S extends Comentarios> Mono<S> insert(S entity) {
        return entityManager.insert(entity);
    }

    @Override
    public <S extends Comentarios> Mono<S> save(S entity) {
        if (entity.getId() == null) {
            return insert(entity);
        } else {
            return update(entity)
                .map(numberOfUpdates -> {
                    if (numberOfUpdates.intValue() <= 0) {
                        throw new IllegalStateException("Unable to update Comentarios with id = " + entity.getId());
                    }
                    return entity;
                });
        }
    }

    @Override
    public Mono<Integer> update(Comentarios entity) {
        //fixme is this the proper way?
        return r2dbcEntityTemplate.update(entity).thenReturn(1);
    }
}

class ComentariosSqlHelper {

    static List<Expression> getColumns(Table table, String columnPrefix) {
        List<Expression> columns = new ArrayList<>();
        columns.add(Column.aliased("id", table, columnPrefix + "_id"));
        columns.add(Column.aliased("text", table, columnPrefix + "_text"));
        columns.add(Column.aliased("date", table, columnPrefix + "_date"));
        columns.add(Column.aliased("stars", table, columnPrefix + "_stars"));
        columns.add(Column.aliased("author", table, columnPrefix + "_author"));

        columns.add(Column.aliased("anuncio_id", table, columnPrefix + "_anuncio_id"));
        return columns;
    }
}

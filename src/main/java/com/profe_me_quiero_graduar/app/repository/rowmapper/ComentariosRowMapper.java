package com.profe_me_quiero_graduar.app.repository.rowmapper;

import com.profe_me_quiero_graduar.app.domain.Comentarios;
import com.profe_me_quiero_graduar.app.domain.enumeration.StarCalification;
import com.profe_me_quiero_graduar.app.service.ColumnConverter;
import io.r2dbc.spi.Row;
import java.time.Instant;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Comentarios}, with proper type conversions.
 */
@Service
public class ComentariosRowMapper implements BiFunction<Row, String, Comentarios> {

    private final ColumnConverter converter;

    public ComentariosRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Comentarios} stored in the database.
     */
    @Override
    public Comentarios apply(Row row, String prefix) {
        Comentarios entity = new Comentarios();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setText(converter.fromRow(row, prefix + "_text", String.class));
        entity.setDate(converter.fromRow(row, prefix + "_date", Instant.class));
        entity.setStars(converter.fromRow(row, prefix + "_stars", StarCalification.class));
        entity.setAuthor(converter.fromRow(row, prefix + "_author", String.class));
        entity.setAnuncioId(converter.fromRow(row, prefix + "_anuncio_id", Long.class));
        return entity;
    }
}

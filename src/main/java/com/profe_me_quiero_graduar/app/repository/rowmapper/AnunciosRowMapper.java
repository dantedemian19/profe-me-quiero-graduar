package com.profe_me_quiero_graduar.app.repository.rowmapper;

import com.profe_me_quiero_graduar.app.domain.Anuncios;
import com.profe_me_quiero_graduar.app.service.ColumnConverter;
import io.r2dbc.spi.Row;
import java.util.function.BiFunction;
import org.springframework.stereotype.Service;

/**
 * Converter between {@link Row} to {@link Anuncios}, with proper type conversions.
 */
@Service
public class AnunciosRowMapper implements BiFunction<Row, String, Anuncios> {

    private final ColumnConverter converter;

    public AnunciosRowMapper(ColumnConverter converter) {
        this.converter = converter;
    }

    /**
     * Take a {@link Row} and a column prefix, and extract all the fields.
     * @return the {@link Anuncios} stored in the database.
     */
    @Override
    public Anuncios apply(Row row, String prefix) {
        Anuncios entity = new Anuncios();
        entity.setId(converter.fromRow(row, prefix + "_id", Long.class));
        entity.setTitle(converter.fromRow(row, prefix + "_title", String.class));
        entity.setPhotoContentType(converter.fromRow(row, prefix + "_photo_content_type", String.class));
        entity.setPhoto(converter.fromRow(row, prefix + "_photo", byte[].class));
        entity.setText(converter.fromRow(row, prefix + "_text", String.class));
        return entity;
    }
}

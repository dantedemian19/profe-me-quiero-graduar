package com.profe_me_quiero_graduar.app.service.dto;

import com.profe_me_quiero_graduar.app.domain.enumeration.StarCalification;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.profe_me_quiero_graduar.app.domain.Comentarios} entity.
 */
public class ComentariosDTO implements Serializable {

    private Long id;

    @Lob
    private String text;

    @NotNull(message = "must not be null")
    private Instant date;

    private StarCalification stars;

    private String author;

    private AnunciosDTO anuncio;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getDate() {
        return date;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public StarCalification getStars() {
        return stars;
    }

    public void setStars(StarCalification stars) {
        this.stars = stars;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public AnunciosDTO getAnuncio() {
        return anuncio;
    }

    public void setAnuncio(AnunciosDTO anuncio) {
        this.anuncio = anuncio;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ComentariosDTO)) {
            return false;
        }

        ComentariosDTO comentariosDTO = (ComentariosDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, comentariosDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ComentariosDTO{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", date='" + getDate() + "'" +
            ", stars='" + getStars() + "'" +
            ", author='" + getAuthor() + "'" +
            ", anuncio=" + getAnuncio() +
            "}";
    }
}

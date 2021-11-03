package com.profe_me_quiero_graduar.app.domain;

import com.profe_me_quiero_graduar.app.domain.enumeration.StarCalification;
import java.io.Serializable;
import java.time.Instant;
import javax.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

/**
 * A Comentarios.
 */
@Table("comentarios")
public class Comentarios implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column("id")
    private Long id;

    @Column("text")
    private String text;

    @NotNull(message = "must not be null")
    @Column("date")
    private Instant date;

    @Column("stars")
    private StarCalification stars;

    @Column("author")
    private String author;

    @Transient
    private Anuncios anuncio;

    @Column("anuncio_id")
    private Long anuncioId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Comentarios id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getText() {
        return this.text;
    }

    public Comentarios text(String text) {
        this.setText(text);
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Instant getDate() {
        return this.date;
    }

    public Comentarios date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public StarCalification getStars() {
        return this.stars;
    }

    public Comentarios stars(StarCalification stars) {
        this.setStars(stars);
        return this;
    }

    public void setStars(StarCalification stars) {
        this.stars = stars;
    }

    public String getAuthor() {
        return this.author;
    }

    public Comentarios author(String author) {
        this.setAuthor(author);
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Anuncios getAnuncio() {
        return this.anuncio;
    }

    public void setAnuncio(Anuncios anuncios) {
        this.anuncio = anuncios;
        this.anuncioId = anuncios != null ? anuncios.getId() : null;
    }

    public Comentarios anuncio(Anuncios anuncios) {
        this.setAnuncio(anuncios);
        return this;
    }

    public Long getAnuncioId() {
        return this.anuncioId;
    }

    public void setAnuncioId(Long anuncios) {
        this.anuncioId = anuncios;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comentarios)) {
            return false;
        }
        return id != null && id.equals(((Comentarios) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comentarios{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            ", date='" + getDate() + "'" +
            ", stars='" + getStars() + "'" +
            ", author='" + getAuthor() + "'" +
            "}";
    }
}

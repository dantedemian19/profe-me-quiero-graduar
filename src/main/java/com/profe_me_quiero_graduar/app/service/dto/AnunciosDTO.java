package com.profe_me_quiero_graduar.app.service.dto;

import java.io.Serializable;
import java.util.Objects;
import javax.persistence.Lob;
import javax.validation.constraints.*;

/**
 * A DTO for the {@link com.profe_me_quiero_graduar.app.domain.Anuncios} entity.
 */
public class AnunciosDTO implements Serializable {

    private Long id;

    @NotNull(message = "must not be null")
    private String title;

    @Lob
    private byte[] photo;

    private String photoContentType;

    @Lob
    private String text;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return photoContentType;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AnunciosDTO)) {
            return false;
        }

        AnunciosDTO anunciosDTO = (AnunciosDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, anunciosDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AnunciosDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", text='" + getText() + "'" +
            "}";
    }
}

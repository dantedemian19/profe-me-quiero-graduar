package com.profe_me_quiero_graduar.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.profe_me_quiero_graduar.app.IntegrationTest;
import com.profe_me_quiero_graduar.app.domain.Anuncios;
import com.profe_me_quiero_graduar.app.repository.AnunciosRepository;
import com.profe_me_quiero_graduar.app.service.EntityManager;
import com.profe_me_quiero_graduar.app.service.dto.AnunciosDTO;
import com.profe_me_quiero_graduar.app.service.mapper.AnunciosMapper;
import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.reactive.AutoConfigureWebTestClient;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link AnunciosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class AnunciosResourceIT {

    private static final String DEFAULT_TITLE = "AAAAAAAAAA";
    private static final String UPDATED_TITLE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/anuncios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AnunciosRepository anunciosRepository;

    @Autowired
    private AnunciosMapper anunciosMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Anuncios anuncios;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Anuncios createEntity(EntityManager em) {
        Anuncios anuncios = new Anuncios()
            .title(DEFAULT_TITLE)
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE)
            .text(DEFAULT_TEXT);
        return anuncios;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Anuncios createUpdatedEntity(EntityManager em) {
        Anuncios anuncios = new Anuncios()
            .title(UPDATED_TITLE)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE)
            .text(UPDATED_TEXT);
        return anuncios;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Anuncios.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
    }

    @AfterEach
    public void cleanup() {
        deleteEntities(em);
    }

    @BeforeEach
    public void setupCsrf() {
        webTestClient = webTestClient.mutateWith(csrf());
    }

    @BeforeEach
    public void initTest() {
        deleteEntities(em);
        anuncios = createEntity(em);
    }

    @Test
    void createAnuncios() throws Exception {
        int databaseSizeBeforeCreate = anunciosRepository.findAll().collectList().block().size();
        // Create the Anuncios
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeCreate + 1);
        Anuncios testAnuncios = anunciosList.get(anunciosList.size() - 1);
        assertThat(testAnuncios.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testAnuncios.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testAnuncios.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
        assertThat(testAnuncios.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    void createAnunciosWithExistingId() throws Exception {
        // Create the Anuncios with an existing ID
        anuncios.setId(1L);
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        int databaseSizeBeforeCreate = anunciosRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkTitleIsRequired() throws Exception {
        int databaseSizeBeforeTest = anunciosRepository.findAll().collectList().block().size();
        // set the field null
        anuncios.setTitle(null);

        // Create the Anuncios, which fails.
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllAnuncios() {
        // Initialize the database
        anunciosRepository.save(anuncios).block();

        // Get all the anunciosList
        webTestClient
            .get()
            .uri(ENTITY_API_URL + "?sort=id,desc")
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.[*].id")
            .value(hasItem(anuncios.getId().intValue()))
            .jsonPath("$.[*].title")
            .value(hasItem(DEFAULT_TITLE))
            .jsonPath("$.[*].photoContentType")
            .value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE))
            .jsonPath("$.[*].photo")
            .value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO)))
            .jsonPath("$.[*].text")
            .value(hasItem(DEFAULT_TEXT.toString()));
    }

    @Test
    void getAnuncios() {
        // Initialize the database
        anunciosRepository.save(anuncios).block();

        // Get the anuncios
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, anuncios.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(anuncios.getId().intValue()))
            .jsonPath("$.title")
            .value(is(DEFAULT_TITLE))
            .jsonPath("$.photoContentType")
            .value(is(DEFAULT_PHOTO_CONTENT_TYPE))
            .jsonPath("$.photo")
            .value(is(Base64Utils.encodeToString(DEFAULT_PHOTO)))
            .jsonPath("$.text")
            .value(is(DEFAULT_TEXT.toString()));
    }

    @Test
    void getNonExistingAnuncios() {
        // Get the anuncios
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewAnuncios() throws Exception {
        // Initialize the database
        anunciosRepository.save(anuncios).block();

        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();

        // Update the anuncios
        Anuncios updatedAnuncios = anunciosRepository.findById(anuncios.getId()).block();
        updatedAnuncios.title(UPDATED_TITLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE).text(UPDATED_TEXT);
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(updatedAnuncios);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, anunciosDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
        Anuncios testAnuncios = anunciosList.get(anunciosList.size() - 1);
        assertThat(testAnuncios.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testAnuncios.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testAnuncios.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testAnuncios.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    void putNonExistingAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();
        anuncios.setId(count.incrementAndGet());

        // Create the Anuncios
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, anunciosDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();
        anuncios.setId(count.incrementAndGet());

        // Create the Anuncios
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();
        anuncios.setId(count.incrementAndGet());

        // Create the Anuncios
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateAnunciosWithPatch() throws Exception {
        // Initialize the database
        anunciosRepository.save(anuncios).block();

        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();

        // Update the anuncios using partial update
        Anuncios partialUpdatedAnuncios = new Anuncios();
        partialUpdatedAnuncios.setId(anuncios.getId());

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAnuncios.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAnuncios))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
        Anuncios testAnuncios = anunciosList.get(anunciosList.size() - 1);
        assertThat(testAnuncios.getTitle()).isEqualTo(DEFAULT_TITLE);
        assertThat(testAnuncios.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testAnuncios.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
        assertThat(testAnuncios.getText()).isEqualTo(DEFAULT_TEXT);
    }

    @Test
    void fullUpdateAnunciosWithPatch() throws Exception {
        // Initialize the database
        anunciosRepository.save(anuncios).block();

        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();

        // Update the anuncios using partial update
        Anuncios partialUpdatedAnuncios = new Anuncios();
        partialUpdatedAnuncios.setId(anuncios.getId());

        partialUpdatedAnuncios.title(UPDATED_TITLE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE).text(UPDATED_TEXT);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedAnuncios.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedAnuncios))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
        Anuncios testAnuncios = anunciosList.get(anunciosList.size() - 1);
        assertThat(testAnuncios.getTitle()).isEqualTo(UPDATED_TITLE);
        assertThat(testAnuncios.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testAnuncios.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
        assertThat(testAnuncios.getText()).isEqualTo(UPDATED_TEXT);
    }

    @Test
    void patchNonExistingAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();
        anuncios.setId(count.incrementAndGet());

        // Create the Anuncios
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, anunciosDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();
        anuncios.setId(count.incrementAndGet());

        // Create the Anuncios
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamAnuncios() throws Exception {
        int databaseSizeBeforeUpdate = anunciosRepository.findAll().collectList().block().size();
        anuncios.setId(count.incrementAndGet());

        // Create the Anuncios
        AnunciosDTO anunciosDTO = anunciosMapper.toDto(anuncios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(anunciosDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Anuncios in the database
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteAnuncios() {
        // Initialize the database
        anunciosRepository.save(anuncios).block();

        int databaseSizeBeforeDelete = anunciosRepository.findAll().collectList().block().size();

        // Delete the anuncios
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, anuncios.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Anuncios> anunciosList = anunciosRepository.findAll().collectList().block();
        assertThat(anunciosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

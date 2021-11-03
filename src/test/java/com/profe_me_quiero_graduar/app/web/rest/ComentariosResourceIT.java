package com.profe_me_quiero_graduar.app.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.reactive.server.SecurityMockServerConfigurers.csrf;

import com.profe_me_quiero_graduar.app.IntegrationTest;
import com.profe_me_quiero_graduar.app.domain.Anuncios;
import com.profe_me_quiero_graduar.app.domain.Comentarios;
import com.profe_me_quiero_graduar.app.domain.enumeration.StarCalification;
import com.profe_me_quiero_graduar.app.repository.ComentariosRepository;
import com.profe_me_quiero_graduar.app.service.EntityManager;
import com.profe_me_quiero_graduar.app.service.dto.ComentariosDTO;
import com.profe_me_quiero_graduar.app.service.mapper.ComentariosMapper;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link ComentariosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureWebTestClient
@WithMockUser
class ComentariosResourceIT {

    private static final String DEFAULT_TEXT = "AAAAAAAAAA";
    private static final String UPDATED_TEXT = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final StarCalification DEFAULT_STARS = StarCalification.One;
    private static final StarCalification UPDATED_STARS = StarCalification.Two;

    private static final String DEFAULT_AUTHOR = "AAAAAAAAAA";
    private static final String UPDATED_AUTHOR = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/comentarios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ComentariosRepository comentariosRepository;

    @Autowired
    private ComentariosMapper comentariosMapper;

    @Autowired
    private EntityManager em;

    @Autowired
    private WebTestClient webTestClient;

    private Comentarios comentarios;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Comentarios createEntity(EntityManager em) {
        Comentarios comentarios = new Comentarios().text(DEFAULT_TEXT).date(DEFAULT_DATE).stars(DEFAULT_STARS).author(DEFAULT_AUTHOR);
        // Add required entity
        Anuncios anuncios;
        anuncios = em.insert(AnunciosResourceIT.createEntity(em)).block();
        comentarios.setAnuncio(anuncios);
        return comentarios;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Comentarios createUpdatedEntity(EntityManager em) {
        Comentarios comentarios = new Comentarios().text(UPDATED_TEXT).date(UPDATED_DATE).stars(UPDATED_STARS).author(UPDATED_AUTHOR);
        // Add required entity
        Anuncios anuncios;
        anuncios = em.insert(AnunciosResourceIT.createUpdatedEntity(em)).block();
        comentarios.setAnuncio(anuncios);
        return comentarios;
    }

    public static void deleteEntities(EntityManager em) {
        try {
            em.deleteAll(Comentarios.class).block();
        } catch (Exception e) {
            // It can fail, if other entities are still referring this - it will be removed later.
        }
        AnunciosResourceIT.deleteEntities(em);
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
        comentarios = createEntity(em);
    }

    @Test
    void createComentarios() throws Exception {
        int databaseSizeBeforeCreate = comentariosRepository.findAll().collectList().block().size();
        // Create the Comentarios
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isCreated();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeCreate + 1);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testComentarios.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testComentarios.getStars()).isEqualTo(DEFAULT_STARS);
        assertThat(testComentarios.getAuthor()).isEqualTo(DEFAULT_AUTHOR);
    }

    @Test
    void createComentariosWithExistingId() throws Exception {
        // Create the Comentarios with an existing ID
        comentarios.setId(1L);
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        int databaseSizeBeforeCreate = comentariosRepository.findAll().collectList().block().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = comentariosRepository.findAll().collectList().block().size();
        // set the field null
        comentarios.setDate(null);

        // Create the Comentarios, which fails.
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        webTestClient
            .post()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllComentarios() {
        // Initialize the database
        comentariosRepository.save(comentarios).block();

        // Get all the comentariosList
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
            .value(hasItem(comentarios.getId().intValue()))
            .jsonPath("$.[*].text")
            .value(hasItem(DEFAULT_TEXT.toString()))
            .jsonPath("$.[*].date")
            .value(hasItem(DEFAULT_DATE.toString()))
            .jsonPath("$.[*].stars")
            .value(hasItem(DEFAULT_STARS.toString()))
            .jsonPath("$.[*].author")
            .value(hasItem(DEFAULT_AUTHOR));
    }

    @Test
    void getComentarios() {
        // Initialize the database
        comentariosRepository.save(comentarios).block();

        // Get the comentarios
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, comentarios.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isOk()
            .expectHeader()
            .contentType(MediaType.APPLICATION_JSON)
            .expectBody()
            .jsonPath("$.id")
            .value(is(comentarios.getId().intValue()))
            .jsonPath("$.text")
            .value(is(DEFAULT_TEXT.toString()))
            .jsonPath("$.date")
            .value(is(DEFAULT_DATE.toString()))
            .jsonPath("$.stars")
            .value(is(DEFAULT_STARS.toString()))
            .jsonPath("$.author")
            .value(is(DEFAULT_AUTHOR));
    }

    @Test
    void getNonExistingComentarios() {
        // Get the comentarios
        webTestClient
            .get()
            .uri(ENTITY_API_URL_ID, Long.MAX_VALUE)
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNotFound();
    }

    @Test
    void putNewComentarios() throws Exception {
        // Initialize the database
        comentariosRepository.save(comentarios).block();

        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();

        // Update the comentarios
        Comentarios updatedComentarios = comentariosRepository.findById(comentarios.getId()).block();
        updatedComentarios.text(UPDATED_TEXT).date(UPDATED_DATE).stars(UPDATED_STARS).author(UPDATED_AUTHOR);
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(updatedComentarios);

        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, comentariosDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testComentarios.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testComentarios.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testComentarios.getAuthor()).isEqualTo(UPDATED_AUTHOR);
    }

    @Test
    void putNonExistingComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();
        comentarios.setId(count.incrementAndGet());

        // Create the Comentarios
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, comentariosDTO.getId())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();
        comentarios.setId(count.incrementAndGet());

        // Create the Comentarios
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();
        comentarios.setId(count.incrementAndGet());

        // Create the Comentarios
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .put()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateComentariosWithPatch() throws Exception {
        // Initialize the database
        comentariosRepository.save(comentarios).block();

        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();

        // Update the comentarios using partial update
        Comentarios partialUpdatedComentarios = new Comentarios();
        partialUpdatedComentarios.setId(comentarios.getId());

        partialUpdatedComentarios.stars(UPDATED_STARS).author(UPDATED_AUTHOR);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedComentarios.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedComentarios))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getText()).isEqualTo(DEFAULT_TEXT);
        assertThat(testComentarios.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testComentarios.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testComentarios.getAuthor()).isEqualTo(UPDATED_AUTHOR);
    }

    @Test
    void fullUpdateComentariosWithPatch() throws Exception {
        // Initialize the database
        comentariosRepository.save(comentarios).block();

        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();

        // Update the comentarios using partial update
        Comentarios partialUpdatedComentarios = new Comentarios();
        partialUpdatedComentarios.setId(comentarios.getId());

        partialUpdatedComentarios.text(UPDATED_TEXT).date(UPDATED_DATE).stars(UPDATED_STARS).author(UPDATED_AUTHOR);

        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, partialUpdatedComentarios.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(partialUpdatedComentarios))
            .exchange()
            .expectStatus()
            .isOk();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
        Comentarios testComentarios = comentariosList.get(comentariosList.size() - 1);
        assertThat(testComentarios.getText()).isEqualTo(UPDATED_TEXT);
        assertThat(testComentarios.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testComentarios.getStars()).isEqualTo(UPDATED_STARS);
        assertThat(testComentarios.getAuthor()).isEqualTo(UPDATED_AUTHOR);
    }

    @Test
    void patchNonExistingComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();
        comentarios.setId(count.incrementAndGet());

        // Create the Comentarios
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, comentariosDTO.getId())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();
        comentarios.setId(count.incrementAndGet());

        // Create the Comentarios
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL_ID, count.incrementAndGet())
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isBadRequest();

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamComentarios() throws Exception {
        int databaseSizeBeforeUpdate = comentariosRepository.findAll().collectList().block().size();
        comentarios.setId(count.incrementAndGet());

        // Create the Comentarios
        ComentariosDTO comentariosDTO = comentariosMapper.toDto(comentarios);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        webTestClient
            .patch()
            .uri(ENTITY_API_URL)
            .contentType(MediaType.valueOf("application/merge-patch+json"))
            .bodyValue(TestUtil.convertObjectToJsonBytes(comentariosDTO))
            .exchange()
            .expectStatus()
            .isEqualTo(405);

        // Validate the Comentarios in the database
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteComentarios() {
        // Initialize the database
        comentariosRepository.save(comentarios).block();

        int databaseSizeBeforeDelete = comentariosRepository.findAll().collectList().block().size();

        // Delete the comentarios
        webTestClient
            .delete()
            .uri(ENTITY_API_URL_ID, comentarios.getId())
            .accept(MediaType.APPLICATION_JSON)
            .exchange()
            .expectStatus()
            .isNoContent();

        // Validate the database contains one less item
        List<Comentarios> comentariosList = comentariosRepository.findAll().collectList().block();
        assertThat(comentariosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}

import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { AnunciosDTO } from '../src/service/dto/anuncios.dto';
import { AnunciosService } from '../src/service/anuncios.service';

describe('Anuncios Controller', () => {
    let app: INestApplication;

    const authGuardMock = { canActivate: (): any => true };
    const rolesGuardMock = { canActivate: (): any => true };
    const entityMock: any = {
        id: 'entityId',
    };

    const serviceMock = {
        findById: (): any => entityMock,
        findAndCount: (): any => [entityMock, 0],
        save: (): any => entityMock,
        update: (): any => entityMock,
        deleteById: (): any => entityMock,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuardMock)
            .overrideGuard(RolesGuard)
            .useValue(rolesGuardMock)
            .overrideProvider(AnunciosService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all anuncios ', async () => {
        const getEntities: AnunciosDTO[] = (await request(app.getHttpServer()).get('/api/anuncios').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET anuncios by id', async () => {
        const getEntity: AnunciosDTO = (
            await request(app.getHttpServer())
                .get('/api/anuncios/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create anuncios', async () => {
        const createdEntity: AnunciosDTO = (
            await request(app.getHttpServer()).post('/api/anuncios').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update anuncios', async () => {
        const updatedEntity: AnunciosDTO = (
            await request(app.getHttpServer()).put('/api/anuncios').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update anuncios from id', async () => {
        const updatedEntity: AnunciosDTO = (
            await request(app.getHttpServer())
                .put('/api/anuncios/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE anuncios', async () => {
        const deletedEntity: AnunciosDTO = (
            await request(app.getHttpServer())
                .delete('/api/anuncios/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});

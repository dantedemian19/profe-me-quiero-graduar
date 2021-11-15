import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { CiudadDTO } from '../src/service/dto/ciudad.dto';
import { CiudadService } from '../src/service/ciudad.service';

describe('Ciudad Controller', () => {
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
            .overrideProvider(CiudadService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all ciudads ', async () => {
        const getEntities: CiudadDTO[] = (await request(app.getHttpServer()).get('/api/ciudads').expect(200)).body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET ciudads by id', async () => {
        const getEntity: CiudadDTO = (
            await request(app.getHttpServer())
                .get('/api/ciudads/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create ciudads', async () => {
        const createdEntity: CiudadDTO = (
            await request(app.getHttpServer()).post('/api/ciudads').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update ciudads', async () => {
        const updatedEntity: CiudadDTO = (
            await request(app.getHttpServer()).put('/api/ciudads').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update ciudads from id', async () => {
        const updatedEntity: CiudadDTO = (
            await request(app.getHttpServer())
                .put('/api/ciudads/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE ciudads', async () => {
        const deletedEntity: CiudadDTO = (
            await request(app.getHttpServer())
                .delete('/api/ciudads/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});

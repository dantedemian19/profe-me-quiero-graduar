import { Test, TestingModule } from '@nestjs/testing';
import request = require('supertest');
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { AuthGuard } from '../src/security/guards/auth.guard';
import { RolesGuard } from '../src/security/guards/roles.guard';
import { ComentariosDTO } from '../src/service/dto/comentarios.dto';
import { ComentariosService } from '../src/service/comentarios.service';

describe('Comentarios Controller', () => {
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
            .overrideProvider(ComentariosService)
            .useValue(serviceMock)
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('/GET all comentarios ', async () => {
        const getEntities: ComentariosDTO[] = (await request(app.getHttpServer()).get('/api/comentarios').expect(200))
            .body;

        expect(getEntities).toEqual(entityMock);
    });

    it('/GET comentarios by id', async () => {
        const getEntity: ComentariosDTO = (
            await request(app.getHttpServer())
                .get('/api/comentarios/' + entityMock.id)
                .expect(200)
        ).body;

        expect(getEntity).toEqual(entityMock);
    });

    it('/POST create comentarios', async () => {
        const createdEntity: ComentariosDTO = (
            await request(app.getHttpServer()).post('/api/comentarios').send(entityMock).expect(201)
        ).body;

        expect(createdEntity).toEqual(entityMock);
    });

    it('/PUT update comentarios', async () => {
        const updatedEntity: ComentariosDTO = (
            await request(app.getHttpServer()).put('/api/comentarios').send(entityMock).expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/PUT update comentarios from id', async () => {
        const updatedEntity: ComentariosDTO = (
            await request(app.getHttpServer())
                .put('/api/comentarios/' + entityMock.id)
                .send(entityMock)
                .expect(201)
        ).body;

        expect(updatedEntity).toEqual(entityMock);
    });

    it('/DELETE comentarios', async () => {
        const deletedEntity: ComentariosDTO = (
            await request(app.getHttpServer())
                .delete('/api/comentarios/' + entityMock.id)
                .expect(204)
        ).body;

        expect(deletedEntity).toEqual({});
    });

    afterEach(async () => {
        await app.close();
    });
});

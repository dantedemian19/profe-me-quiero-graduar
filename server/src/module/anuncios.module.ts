import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnunciosController } from '../web/rest/anuncios.controller';
import { AnunciosRepository } from '../repository/anuncios.repository';
import { AnunciosService } from '../service/anuncios.service';

@Module({
    imports: [TypeOrmModule.forFeature([AnunciosRepository])],
    controllers: [AnunciosController],
    providers: [AnunciosService],
    exports: [AnunciosService],
})
export class AnunciosModule {}

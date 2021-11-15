import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComentariosController } from '../web/rest/comentarios.controller';
import { ComentariosRepository } from '../repository/comentarios.repository';
import { ComentariosService } from '../service/comentarios.service';

@Module({
    imports: [TypeOrmModule.forFeature([ComentariosRepository])],
    controllers: [ComentariosController],
    providers: [ComentariosService],
    exports: [ComentariosService],
})
export class ComentariosModule {}

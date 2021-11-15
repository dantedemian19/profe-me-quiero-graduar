import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadController } from '../web/rest/ciudad.controller';
import { CiudadRepository } from '../repository/ciudad.repository';
import { CiudadService } from '../service/ciudad.service';

@Module({
    imports: [TypeOrmModule.forFeature([CiudadRepository])],
    controllers: [CiudadController],
    providers: [CiudadService],
    exports: [CiudadService],
})
export class CiudadModule {}

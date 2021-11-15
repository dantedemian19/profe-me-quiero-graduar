import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post as PostMethod,
    Put,
    UseGuards,
    Req,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AnunciosDTO } from '../../service/dto/anuncios.dto';
import { AnunciosService } from '../../service/anuncios.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/anuncios')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('anuncios')
export class AnunciosController {
    logger = new Logger('AnunciosController');

    constructor(private readonly anunciosService: AnunciosService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: AnunciosDTO,
    })
    async getAll(@Req() req: Request): Promise<AnunciosDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.anunciosService.findAndCount({
            skip: +pageRequest.page * pageRequest.size,
            take: +pageRequest.size,
            order: pageRequest.sort.asOrder(),
        });
        HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
        return results;
    }

    @Get('/:id')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'The found record',
        type: AnunciosDTO,
    })
    async getOne(@Param('id') id: number): Promise<AnunciosDTO> {
        return await this.anunciosService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create anuncios' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: AnunciosDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() anunciosDTO: AnunciosDTO): Promise<AnunciosDTO> {
        const created = await this.anunciosService.save(anunciosDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Anuncios', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update anuncios' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AnunciosDTO,
    })
    async put(@Req() req: Request, @Body() anunciosDTO: AnunciosDTO): Promise<AnunciosDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Anuncios', anunciosDTO.id);
        return await this.anunciosService.update(anunciosDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update anuncios with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: AnunciosDTO,
    })
    async putId(@Req() req: Request, @Body() anunciosDTO: AnunciosDTO): Promise<AnunciosDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Anuncios', anunciosDTO.id);
        return await this.anunciosService.update(anunciosDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete anuncios' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Anuncios', id);
        return await this.anunciosService.deleteById(id);
    }
}

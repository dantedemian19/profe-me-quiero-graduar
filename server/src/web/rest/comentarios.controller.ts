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
import { ComentariosDTO } from '../../service/dto/comentarios.dto';
import { ComentariosService } from '../../service/comentarios.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/comentarios')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('comentarios')
export class ComentariosController {
    logger = new Logger('ComentariosController');

    constructor(private readonly comentariosService: ComentariosService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: ComentariosDTO,
    })
    async getAll(@Req() req: Request): Promise<ComentariosDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.comentariosService.findAndCount({
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
        type: ComentariosDTO,
    })
    async getOne(@Param('id') id: number): Promise<ComentariosDTO> {
        return await this.comentariosService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create comentarios' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: ComentariosDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() comentariosDTO: ComentariosDTO): Promise<ComentariosDTO> {
        const created = await this.comentariosService.save(comentariosDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Comentarios', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update comentarios' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ComentariosDTO,
    })
    async put(@Req() req: Request, @Body() comentariosDTO: ComentariosDTO): Promise<ComentariosDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Comentarios', comentariosDTO.id);
        return await this.comentariosService.update(comentariosDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update comentarios with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: ComentariosDTO,
    })
    async putId(@Req() req: Request, @Body() comentariosDTO: ComentariosDTO): Promise<ComentariosDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Comentarios', comentariosDTO.id);
        return await this.comentariosService.update(comentariosDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete comentarios' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Comentarios', id);
        return await this.comentariosService.deleteById(id);
    }
}

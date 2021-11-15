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
import { CiudadDTO } from '../../service/dto/ciudad.dto';
import { CiudadService } from '../../service/ciudad.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/ciudads')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiUseTags('ciudads')
export class CiudadController {
    logger = new Logger('CiudadController');

    constructor(private readonly ciudadService: CiudadService) {}

    @Get('/')
    @Roles(RoleType.USER)
    @ApiResponse({
        status: 200,
        description: 'List all records',
        type: CiudadDTO,
    })
    async getAll(@Req() req: Request): Promise<CiudadDTO[]> {
        const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
        const [results, count] = await this.ciudadService.findAndCount({
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
        type: CiudadDTO,
    })
    async getOne(@Param('id') id: number): Promise<CiudadDTO> {
        return await this.ciudadService.findById(id);
    }

    @PostMethod('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Create ciudad' })
    @ApiResponse({
        status: 201,
        description: 'The record has been successfully created.',
        type: CiudadDTO,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    async post(@Req() req: Request, @Body() ciudadDTO: CiudadDTO): Promise<CiudadDTO> {
        const created = await this.ciudadService.save(ciudadDTO, req.user?.login);
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Ciudad', created.id);
        return created;
    }

    @Put('/')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update ciudad' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CiudadDTO,
    })
    async put(@Req() req: Request, @Body() ciudadDTO: CiudadDTO): Promise<CiudadDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Ciudad', ciudadDTO.id);
        return await this.ciudadService.update(ciudadDTO, req.user?.login);
    }

    @Put('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Update ciudad with id' })
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
        type: CiudadDTO,
    })
    async putId(@Req() req: Request, @Body() ciudadDTO: CiudadDTO): Promise<CiudadDTO> {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Ciudad', ciudadDTO.id);
        return await this.ciudadService.update(ciudadDTO, req.user?.login);
    }

    @Delete('/:id')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ title: 'Delete ciudad' })
    @ApiResponse({
        status: 204,
        description: 'The record has been successfully deleted.',
    })
    async deleteById(@Req() req: Request, @Param('id') id: number): Promise<void> {
        HeaderUtil.addEntityDeletedHeaders(req.res, 'Ciudad', id);
        return await this.ciudadService.deleteById(id);
    }
}

import {
  FileTypes,
  UploadFileInterceptor,
  UploadedFile,
} from '@infra/interceptors/upload-file.interceptor';
import { LoggerInject, LoggerService } from '@mpgxc/logger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { UpdateEstablishment } from '@usecases/establishments/update-establishment';
import { UpdateEstablishmentPicture } from '@usecases/establishments/update-establishment-picture';
import { UUID } from 'node:crypto';
import { ApiFileUpload, ApiResponse } from './validators/common';
import {
  EstablishmentOutput,
  EstablishmentRegister,
  EstablishmentUpdate,
} from './validators/establishment';
import { QueryParams } from './validators/query';

@ApiTags('Establishments')
@Controller('partner/:partnerId/establishment')
export class EstablishmentController {
  constructor(
    @LoggerInject(EstablishmentController.name)
    private readonly logger: LoggerService,
    private readonly getEstablishment: GetEstablishment,
    private readonly listEstablishments: ListEstablishments,
    private readonly updateEstablishment: UpdateEstablishment,
    private readonly registerEstablishment: RegisterEstablishment,
    private readonly updateEstablishmentPicture: UpdateEstablishmentPicture,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The establishment has been successfully registered.',
  })
  async create(
    @Param('partnerId') partnerId: UUID,
    @Body() payload: EstablishmentRegister,
  ): Promise<void> {
    this.logger.log('create > params', {
      payload,
    });

    await this.registerEstablishment.execute(partnerId, payload);

    this.logger.log('create  > success');
  }

  @Get('/:establishmentId')
  @ApiResponse({ type: EstablishmentOutput })
  @HttpCode(HttpStatus.OK)
  async retrieve(
    @Param('partnerId') partnerId: UUID,
    @Param('establishmentId') establishmentId: UUID,
  ) {
    this.logger.log('retrieve establishment > params', {
      partnerId,
      establishmentId,
    });

    const output = await this.getEstablishment.execute(
      partnerId,
      establishmentId,
    );

    if (!output.isOk) throw output.value;

    this.logger.log('retrieve establishment > success', output.value);

    return output.value;
  }

  @Get()
  @ApiResponse({ type: EstablishmentOutput, paginated: true })
  @HttpCode(HttpStatus.OK)
  async list(
    @Param('partnerId') partnerId: UUID,
    @Query() { limit, sort, page }: QueryParams,
  ) {
    this.logger.log('list > params', { partnerId });

    const output = await this.listEstablishments.execute(partnerId, {
      pagination: {
        limit,
        sort,
        page,
      },
    });

    this.logger.log('list > success', output);

    return output;
  }

  @Put('/:establishmentId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The establishment has been successfully updated',
  })
  async update(
    @Body() payload: EstablishmentUpdate,
    @Param('partnerId') partnerId: UUID,
    @Param('establishmentId', ParseUUIDPipe) establishmentId: UUID,
  ) {
    this.logger.log('update > params ', {
      partnerId,
      establishmentId,
      payload,
    });

    await this.updateEstablishment.execute(partnerId, establishmentId, payload);

    this.logger.log('update > success');
  }

  @Patch('/:establishmentId/picture')
  @ApiFileUpload('picture')
  @UseInterceptors(
    FileInterceptor('picture'),
    UploadFileInterceptor({
      fileTypes: [FileTypes.PNG, FileTypes.JPEG, FileTypes.JPG],
      prefix: 'establishment-picture',
    }),
  )
  @ApiNoContentResponse({
    description: 'The establishment has been successfully updated',
  })
  async patch(
    @Param('partnerId') partnerId: UUID,
    @Param('establishmentId') establishmentId: UUID,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.logger.log('Upadte picture > params', {
      partnerId,
      establishmentId,
      filename: file.filename,
    });

    await this.updateEstablishmentPicture.execute({
      establishmentId,
      partnerId,
      filename: file.filename,
    });

    this.logger.log('Update picture > success');
  }
}

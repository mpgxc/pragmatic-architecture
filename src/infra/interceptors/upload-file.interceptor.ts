import { StorageProvider } from '@infra/providers/storage/storage.factory';
import {
  IStorageProvider,
  UploadFileOptions,
} from '@infra/providers/storage/storage.provider';
import { LoggerInject, LoggerService } from '@mpgxc/logx';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
  Type,
  createParamDecorator,
  mixin,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { Observable } from 'rxjs';

export const UploadedFile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.uploadedFile;
  },
);

export enum FileTypes {
  PNG = '.png',
  JPEG = '.jpeg',
  JPG = '.jpg',
  PDF = '.pdf',
}

type UploadFileInterceptorProps = {
  fileTypes: FileTypes[];
  prefix: string;
};

export function UploadFileInterceptor(
  props: UploadFileInterceptorProps,
): Type<NestInterceptor> {
  class MixinUploadFileInterceptor implements NestInterceptor {
    constructor(
      @LoggerInject(MixinUploadFileInterceptor.name)
      private readonly logger: LoggerService,
      @Inject(StorageProvider)
      private readonly storageProvider: IStorageProvider,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<any>> {
      try {
        const req = context.switchToHttp().getRequest();

        req.uploadedFile = {};

        const file: Express.Multer.File = req.file;

        const ext = extname(file.originalname);
        const fileTypes: string[] = Object.values(props.fileTypes);

        if (!fileTypes.includes(ext)) {
          throw new BadRequestException('Invalid file for this resource');
        }

        const filename = `${props.prefix}/${randomUUID()}${ext}`;

        const uploadFileOptions: UploadFileOptions = {
          file,
          filename,
        };

        await this.storageProvider.upload(uploadFileOptions);

        req.uploadedFile = { ...uploadFileOptions };
      } catch (error) {
        this.logger.error('Error on upload file interceptor', { error });
        throw new BadRequestException(error);
      }

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinUploadFileInterceptor);
  return Interceptor as Type<NestInterceptor>;
}

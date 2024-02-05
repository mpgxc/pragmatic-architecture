import { IFileProvider, UploadFileOptions } from '@infra/providers/file';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
  Type,
  createParamDecorator,
  mixin,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MultipartFile } from '@fastify/multipart';
import { randomUUID } from 'crypto';

export type UploadedFileOutput = MultipartFile;

export const UploadedFile = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.uploadedFile;
  },
);

export function UploadFileInterceptor(
  names: string,
  prefix: string,
): Type<NestInterceptor> {
  class MixinUploadFileInterceptor implements NestInterceptor {
    constructor(
      @Inject('FileProvider') private readonly fileProvider: IFileProvider,
    ) {}

    async intercept(
      context: ExecutionContext,
      next: CallHandler<any>,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest();

      req.uploadedFile = {};

      const file: MultipartFile = await req.file();

      const uploadFileOptions: UploadFileOptions = {
        file,
        filename: `${randomUUID()}-${file.filename}`,
        folderName: prefix,
      };

      await this.fileProvider.upload(uploadFileOptions);

      req.uploadedFile = { ...uploadFileOptions };

      return next.handle();
    }
  }

  const Interceptor = mixin(MixinUploadFileInterceptor);
  return Interceptor as Type<NestInterceptor>;
}

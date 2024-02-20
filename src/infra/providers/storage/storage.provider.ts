export type UploadFileOptions = {
  file: Express.Multer.File;
  filename: string;
};

export interface IStorageProvider {
  upload(input: UploadFileOptions): Promise<void>;
  remove(filename: string, prefix?: string): Promise<void>;
  getUrl(filename: string, prefix: string): string;
}

export type UploadFileOptions = {
  file: Express.Multer.File;
  folderName: string;
  filename: string;
};

export interface IStorageProvider {
  upload(input: UploadFileOptions): Promise<void>;
  remove(filename: string, prefix?: string): Promise<void>;
}

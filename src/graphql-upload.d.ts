declare module 'graphql-upload' {
  import { Readable } from 'stream';

  export interface FileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream(): Readable;
  }

  export interface Upload {
    promise: Promise<FileUpload>;
    file: Promise<FileUpload> | null;
  }

  export function graphqlUploadExpress(
    options?: { maxFileSize?: number; maxFiles?: number } | undefined,
  ): (req: any, res: any, next: any) => void;
}

export class FileUploadCommandEvent {
  readonly filename: string;
  readonly filesize: number;
  readonly mimetype: string;
  readonly encoding: string;
  readonly metadata: string;

  constructor(data: { filename: string; filesize: number; mimetype: string; encoding: string; metadata: string }) {
    this.filename = data.filename;
    this.filesize = data.filesize;
    this.mimetype = data.mimetype;
    this.encoding = data.encoding;
    this.metadata = data.metadata;
  }
}

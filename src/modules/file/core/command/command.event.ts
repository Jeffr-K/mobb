export class FileUploadCommandEvent {
  readonly presignedUrl: string;

  constructor(presignedUrl: string) {
    this.presignedUrl = presignedUrl;
  }
}

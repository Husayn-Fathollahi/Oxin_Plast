export interface FileEntity {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  createdAt: Date;
}

import { HttpStatus } from '@nestjs/common';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export interface BaseResponse<T> {
  data: T;
  message: string;
  status: number;
}

export class BusinessResponse<T> implements BaseResponse<T> {
  data: T;
  message: string;
  status: HttpStatus;

  constructor(data: T, message: string, status: HttpStatus) {
    this.data = data;
    this.message = message;
    this.status = status;
  }
}

import { ParseUUIDPipe } from '@nestjs/common';

export class UuidV4Pipe extends ParseUUIDPipe {
  constructor() {
    super({ version: '4' });
  }
}

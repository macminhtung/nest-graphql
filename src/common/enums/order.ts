import { registerEnumType } from '@nestjs/graphql';

export enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(EOrder, { name: 'EOrder' });

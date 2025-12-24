import { InputType } from '@nestjs/graphql';
import { CreateUserDto } from '@/modules/user/dtos';

@InputType()
export class UpdateUserDto extends CreateUserDto {}

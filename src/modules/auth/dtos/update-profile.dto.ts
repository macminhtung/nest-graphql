import { InputType, OmitType } from '@nestjs/graphql';
import { UpdateUserDto } from '@/modules/user/dtos';

@InputType()
export class UpdateProfileDto extends OmitType(UpdateUserDto, ['roleId']) {}

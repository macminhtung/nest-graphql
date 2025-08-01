import { Field, InputType } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreateProductDto {
  @Field(() => String)
  @IsString()
  image: string;

  @Field(() => String)
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  name: string;

  @Field(() => String)
  @IsString()
  @MinLength(10)
  @MaxLength(100)
  description: string;
}

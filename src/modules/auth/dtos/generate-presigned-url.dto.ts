import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';

@InputType()
export class GeneratePreSignedUrlDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  contentType: string;

  @Field()
  @IsString()
  filename: string;
}

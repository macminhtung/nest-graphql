import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsArray,
  IsDateString,
  Max,
  Min,
  ArrayMinSize,
  ArrayMaxSize,
  IsBoolean,
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { EOrder } from '@/common/enums';

export const NUM_LIMIT_RECORDS = 100000;
export const DEFAULT_PAGE_NUM = 1;
export const DEFAULT_PAGE_TAKE = 30;

export function IsBefore(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object?.[relatedPropertyName];
          return relatedValue ? value <= relatedValue : true;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${args.property} must be before ${relatedPropertyName}`;
        },
      },
    });
  };
}

@InputType()
export class GetPaginatedRecordsDto {
  @Field(() => EOrder, { nullable: true })
  @IsOptional()
  @IsEnum(EOrder)
  order?: EOrder;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(DEFAULT_PAGE_NUM)
  page?: number;

  @Field(() => Number, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  take?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  keySearch?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  includeIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(100)
  excludeIds?: string[];

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsBefore('createdTo')
  @IsDateString()
  createdFrom?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  isSelectAll?: boolean;
}

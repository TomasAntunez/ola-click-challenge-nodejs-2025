import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsString, Min, MinLength, ValidateNested } from 'class-validator';

class CreateOrderItemDto {
  @IsString()
  @MinLength(1)
  description: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(1)
  unitPrice: number;
}

export class CreateOrderDto {
  @IsString()
  @MinLength(1)
  clientName: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}

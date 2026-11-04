import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * UpdateProductDto — all fields are optional for PATCH semantics.
 * Extends CreateProductDto via PartialType (NestJS mapped-types).
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}

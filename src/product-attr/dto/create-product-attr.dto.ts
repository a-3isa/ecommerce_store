import { IsString } from 'class-validator';

export class CreateProductAttributeDto {
  // @IsString()
  // public name: string;

  @IsString()
  public displayName: string;

  // @IsString()
  // @IsOptional()
  // public description?: string;

  // @IsBoolean()
  // @IsOptional()
  // public isRequired?: boolean = false;

  // @IsBoolean()
  // @IsOptional()
  // public isActive?: boolean = true;

  // @IsArray()
  // @IsString({ each: true })
  // @IsOptional()
  // public options?: string[];

  // @IsObject()
  // @IsOptional()
  // public validationRules?: {
  //   min?: number;
  //   max?: number;
  //   pattern?: string;
  //   required?: boolean;
  // };

  // @IsOptional()
  // public sortOrder?: number = 0;
}

// export class UpdateProductAttributeDto {
//   @IsString()
//   @IsOptional()
//   public name?: string;

//   @IsString()
//   @IsOptional()
//   public displayName?: string;

//   @IsString()
//   @IsOptional()
//   public description?: string;

//   @IsBoolean()
//   @IsOptional()
//   public isRequired?: boolean;

//   @IsBoolean()
//   @IsOptional()
//   public isActive?: boolean;

//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   public options?: string[];

//   @IsObject()
//   @IsOptional()
//   public validationRules?: {
//     min?: number;
//     max?: number;
//     pattern?: string;
//     required?: boolean;
//   };

//   @IsOptional()
//   public sortOrder?: number;
// }

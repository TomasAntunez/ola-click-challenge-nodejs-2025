import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min, MinLength, validateSync } from 'class-validator';

export enum Environment {
  LOCAL = 'local',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  readonly NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  readonly PORT: number = 3000;

  @IsString()
  @MinLength(1)
  readonly POSTGRES_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  readonly POSTGRES_PORT: number;

  @IsString()
  @MinLength(1)
  readonly POSTGRES_USER: string;

  @IsString()
  @MinLength(1)
  readonly POSTGRES_PASSWORD: string;

  @IsString()
  @MinLength(1)
  readonly POSTGRES_DB: string;

  @IsString()
  @MinLength(1)
  readonly REDIS_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  readonly REDIS_PORT: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly REDIS_DEFAULT_TTL: number = 30000;

  @IsInt()
  @Min(0)
  @IsOptional()
  readonly DAYS_TO_REMOVE_OLD_ORDERS: number = 30;
}

export const validateConfig = (config: Record<string, unknown>) => {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, { skipMissingProperties: false });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
};

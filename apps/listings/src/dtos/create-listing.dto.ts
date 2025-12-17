import { IsString, IsNumber, IsArray, IsOptional, IsObject, Min, IsEnum } from 'class-validator'
import { Type } from 'class-transformer'

class LocationDto {
  @IsString()
  district: string

  @IsString()
  city: string

  @IsOptional()
  @IsString()
  address?: string

  @IsOptional()
  @IsObject()
  coordinates?: {
    lat: number
    lng: number
  }
}

export class CreateListingDto {
  @IsString()
  title: string

  @IsString()
  description: string

  @IsString()
  propertyType: string

  @IsObject()
  @Type(() => LocationDto)
  location: LocationDto

  @IsNumber()
  @Min(0)
  rentPerMonth: number

  @IsNumber()
  @Min(0)
  deposit: number

  @IsNumber()
  @Min(0)
  bedrooms: number

  @IsNumber()
  @Min(0)
  bathrooms: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  size?: number

  @IsEnum(['furnished', 'semi-furnished', 'unfurnished'])
  furnishing: string

  @IsArray()
  @IsString({ each: true })
  amenities: string[]

  @IsArray()
  @IsString({ each: true })
  images: string[]

  @IsOptional()
  availableFrom?: Date

  @IsString()
  contactPhone: string

  @IsOptional()
  @IsString()
  contactPhoneSecondary?: string
}

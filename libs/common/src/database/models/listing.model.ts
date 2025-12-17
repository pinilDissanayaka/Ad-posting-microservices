import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { AbstractSchema } from '../abstract.schema'
import { User } from './user.model'

export type ListingDocument = Listing & Document

@Schema({ timestamps: true })
export class Listing extends AbstractSchema {
  @Prop({ required: true, ref: 'User' })
  owner: Types.ObjectId

  @Prop({ required: true })
  title: string

  @Prop({ required: true })
  description: string

  @Prop({ required: true })
  propertyType: string

  @Prop({ type: Object, required: true })
  location: {
    district: string
    city: string
    address?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }

  @Prop({ required: true })
  rentPerMonth: number

  @Prop({ required: true })
  deposit: number

  @Prop({ required: true })
  bedrooms: number

  @Prop({ required: true })
  bathrooms: number

  @Prop()
  size?: number

  @Prop({ required: true })
  furnishing: string

  @Prop({ type: [String], default: [] })
  amenities: string[]

  @Prop({ type: [String], default: [] })
  images: string[]

  @Prop()
  availableFrom?: Date

  @Prop({ required: true })
  contactPhone: string

  @Prop()
  contactPhoneSecondary?: string

  @Prop({ default: 'pending' })
  status: 'pending' | 'published' | 'rejected'

  @Prop()
  rejectionReason?: string

  @Prop({ default: 0 })
  views: number

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  likedBy: Types.ObjectId[]
}

export const ListingSchema = SchemaFactory.createForClass(Listing)

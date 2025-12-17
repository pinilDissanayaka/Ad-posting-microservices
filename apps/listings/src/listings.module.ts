import { Module } from '@nestjs/common'
import { ListingsController } from './listings.controller'
import { ListingsService } from './listings.service'
import { ConfigModule } from '@nestjs/config'
import * as Joi from 'joi'
import {
  Authorize,
  DatabaseModule,
  Listing,
  ListingRepository,
  ListingSchema,
  RmqModule,
  User,
  UserRepository,
  UserSchema,
} from '@lib/common'
import { SERVICES } from 'utils/constants'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        LISTINGS_PORT: Joi.number().required(),
        MONGO_URI: Joi.string().required(),
        RMQ_URL: Joi.string().required(),
        RMQ_AUTH_QUEUE: Joi.string().required(),
        RMQ_LISTINGS_QUEUE: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Listing.name, schema: ListingSchema },
    ]),
    RmqModule.register([SERVICES.AUTH_SERVICE, SERVICES.LISTINGS_SERVICE]),
  ],
  controllers: [ListingsController],
  providers: [
    ListingsService,
    { provide: APP_GUARD, useClass: Authorize },
    ListingRepository,
    UserRepository,
  ],
})
export class ListingsModule {}

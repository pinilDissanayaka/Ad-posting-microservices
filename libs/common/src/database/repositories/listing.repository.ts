import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { AbstractRepository } from '../abstract.repository'
import { Listing, ListingDocument } from '../models/listing.model'

@Injectable()
export class ListingRepository extends AbstractRepository<ListingDocument, Partial<Listing>> {
  constructor(@InjectModel(Listing.name) listingModel: Model<ListingDocument>) {
    super(listingModel)
  }

  async findWithPagination(
    query: FilterQuery<ListingDocument>,
    options: {
      skip?: number
      limit?: number
      sort?: any
    } = {}
  ): Promise<ListingDocument[]> {
    return this.AbstractModel.find(query)
      .skip(options.skip || 0)
      .limit(options.limit || 10)
      .sort(options.sort || { createdAt: -1 })
      .lean()
      .exec()
  }

  async countDocuments(query: FilterQuery<ListingDocument>): Promise<number> {
    return this.AbstractModel.countDocuments(query)
  }

  async delete(id: string | any): Promise<void> {
    await this.AbstractModel.findByIdAndDelete(id)
  }
}

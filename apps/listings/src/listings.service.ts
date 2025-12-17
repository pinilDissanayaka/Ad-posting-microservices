import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { ListingRepository, UserDocument } from '@lib/common'
import { CreateListingDto } from './dtos/create-listing.dto'
import { Types } from 'mongoose'

@Injectable()
export class ListingsService {
  constructor(private readonly listingRepository: ListingRepository) {}

  async create(createListingDto: CreateListingDto, user: UserDocument) {
    const listingData = {
      ...createListingDto,
      owner: user._id,
      status: 'pending' as const, // Default status for new listings
    }

    const listing = await this.listingRepository.create(listingData)
    return listing
  }

  async getAll(filters: any) {
    const {
      propertyType,
      location,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      furnishing,
      sortBy,
      page,
      limit,
    } = filters

    const query: any = { status: 'published' }

    if (propertyType) query.propertyType = propertyType
    if (location) {
      query.$or = [
        { 'location.district': new RegExp(location, 'i') },
        { 'location.city': new RegExp(location, 'i') },
      ]
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.rentPerMonth = {}
      if (minPrice !== undefined) query.rentPerMonth.$gte = minPrice
      if (maxPrice !== undefined) query.rentPerMonth.$lte = maxPrice
    }
    if (bedrooms !== undefined) query.bedrooms = bedrooms
    if (bathrooms !== undefined) query.bathrooms = bathrooms
    if (furnishing) query.furnishing = furnishing

    let sort: any = {}
    if (sortBy === 'price-low') sort.rentPerMonth = 1
    else if (sortBy === 'price-high') sort.rentPerMonth = -1
    else if (sortBy === 'popular') sort.views = -1
    else sort.createdAt = -1

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.listingRepository.findWithPagination(query, { skip, limit, sort }),
      this.listingRepository.countDocuments(query),
    ])

    return {
      data,
      count: data.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    }
  }

  async getById(id: Types.ObjectId) {
    const listing = await this.listingRepository.findById(id, {}, { path: 'owner', select: 'firstName lastName email phone' })
    if (!listing) throw new NotFoundException('Listing not found')
    return listing
  }

  async getMyListings(user: UserDocument) {
    return await this.listingRepository.find({ owner: user._id })
  }

  async update(id: Types.ObjectId, updateData: Partial<CreateListingDto>, user: UserDocument) {
    const listing = await this.listingRepository.findById(id)
    if (!listing) throw new NotFoundException('Listing not found')

    if (!listing.owner.equals(user._id)) {
      throw new ForbiddenException('You can only update your own listings')
    }

    const updated = await this.listingRepository.update(id, { $set: updateData })
    return updated
  }

  async delete(id: Types.ObjectId, user: UserDocument) {
    const listing = await this.listingRepository.findById(id)
    if (!listing) throw new NotFoundException('Listing not found')

    if (!listing.owner.equals(user._id)) {
      throw new ForbiddenException('You can only delete your own listings')
    }

    await this.listingRepository.delete(id)
  }

  async updateStatus(
    id: Types.ObjectId,
    status: 'pending' | 'published' | 'rejected',
    rejectionReason: string | undefined,
    user: UserDocument,
  ) {
    const listing = await this.listingRepository.findById(id)
    if (!listing) throw new NotFoundException('Listing not found')

    if (!listing.owner.equals(user._id)) {
      throw new ForbiddenException('You can only update your own listings')
    }

    const updateData: any = { status }
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    return await this.listingRepository.update(id, { $set: updateData })
  }

  async toggleLike(id: Types.ObjectId, user: UserDocument) {
    const listing = await this.listingRepository.findById(id)
    if (!listing) throw new NotFoundException('Listing not found')

    const hasLiked = listing.likedBy.some(userId => userId.equals(user._id))

    if (hasLiked) {
      await this.listingRepository.update(id, { $pull: { likedBy: user._id } })
    } else {
      await this.listingRepository.update(id, { $push: { likedBy: user._id } })
    }
  }

  async trackView(id: Types.ObjectId) {
    await this.listingRepository.update(id, { $inc: { views: 1 } })
  }
}

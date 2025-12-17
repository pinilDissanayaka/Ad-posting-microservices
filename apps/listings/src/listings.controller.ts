import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { Auth, ReqUser, UserDocument } from '@lib/common'
import { CreateListingDto } from './dtos/create-listing.dto'
import { Types } from 'mongoose'
import { ParseObjectId } from 'utils/pipes/objectId.pipe'

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @Auth({ target: 'user' })
  async httpCreateListing(
    @Body() createListingDto: CreateListingDto,
    @ReqUser() user: UserDocument,
  ) {
    const listing = await this.listingsService.create(createListingDto, user)
    return { success: true, message: 'Property listing created successfully', data: listing }
  }

  @Get()
  @Auth({ isOpen: true })
  async httpGetListings(
    @Query('propertyType') propertyType?: string,
    @Query('location') location?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('bedrooms') bedrooms?: string,
    @Query('bathrooms') bathrooms?: string,
    @Query('furnishing') furnishing?: string,
    @Query('sortBy') sortBy?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const filters = {
      propertyType,
      location,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      bathrooms: bathrooms ? parseInt(bathrooms) : undefined,
      furnishing,
      sortBy: sortBy || 'createdAt',
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    }

    const result = await this.listingsService.getAll(filters)
    return {
      success: true,
      message: 'Listings fetched successfully',
      count: result.count,
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      data: result.data
    }
  }

  @Get('my-listings')
  @Auth({ target: 'user' })
  async httpGetMyListings(@ReqUser() user: UserDocument) {
    const listings = await this.listingsService.getMyListings(user)
    return { success: true, message: 'Your listings fetched successfully', data: listings }
  }

  @Get(':id')
  @Auth({ isOpen: true })
  async httpGetListing(@Param('id', ParseObjectId) id: Types.ObjectId) {
    const listing = await this.listingsService.getById(id)
    return { success: true, message: 'Listing fetched successfully', data: listing }
  }

  @Put(':id')
  @Auth({ target: 'user' })
  async httpUpdateListing(
    @Param('id', ParseObjectId) id: Types.ObjectId,
    @Body() updateData: Partial<CreateListingDto>,
    @ReqUser() user: UserDocument,
  ) {
    const listing = await this.listingsService.update(id, updateData, user)
    return { success: true, message: 'Listing updated successfully', data: listing }
  }

  @Delete(':id')
  @Auth({ target: 'user' })
  async httpDeleteListing(
    @Param('id', ParseObjectId) id: Types.ObjectId,
    @ReqUser() user: UserDocument,
  ) {
    await this.listingsService.delete(id, user)
    return { success: true, message: 'Listing deleted successfully' }
  }

  @Put(':id/status')
  @Auth({ target: 'user' })
  async httpUpdateListingStatus(
    @Param('id', ParseObjectId) id: Types.ObjectId,
    @ReqUser() user: UserDocument,
    @Body('status') status: 'pending' | 'published' | 'rejected',
    @Body('rejectionReason') rejectionReason?: string,
  ) {
    const listing = await this.listingsService.updateStatus(id, status, rejectionReason, user)
    return { success: true, message: 'Listing status updated successfully', data: listing }
  }

  @Post(':id/like')
  @Auth({ target: 'user' })
  async httpToggleLike(
    @Param('id', ParseObjectId) id: Types.ObjectId,
    @ReqUser() user: UserDocument,
  ) {
    await this.listingsService.toggleLike(id, user)
    return { success: true, message: 'Like toggled successfully' }
  }

  @Post(':id/view')
  @Auth({ isOpen: true })
  async httpTrackView(@Param('id', ParseObjectId) id: Types.ObjectId) {
    await this.listingsService.trackView(id)
    return { success: true, message: 'View tracked successfully' }
  }
}

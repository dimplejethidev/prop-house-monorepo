import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { CommunitiesService } from './community.service';
import { CommunityOverview, ExtendedCommunity } from './community.types';
import { buildExtendedCommunity } from './community.utils';
import { BigNumberish } from '@ethersproject/bignumber';
import { getNumVotes } from 'prop-house-communities';

@Controller()
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get('communities')
  async getCommunities(): Promise<CommunityOverview[]> {
    return (await this.communitiesService.findAll())
      .map(buildExtendedCommunity)
      .map((ec: ExtendedCommunity) => {
        delete ec.auctions;
        return ec;
      });
  }

  @Get('communities/id/:id')
  async findOne(@Param('id') id: number): Promise<ExtendedCommunity> {
    const foundCommunity = await this.communitiesService.findOne(id);
    if (!foundCommunity)
      throw new HttpException('Community not found', HttpStatus.NOT_FOUND);
    return buildExtendedCommunity(foundCommunity);
  }

  @Get('communities/name/:name')
  async findOneByName(@Param('name') name: string): Promise<ExtendedCommunity> {
    const foundCommunity = await this.communitiesService.findByName(name);
    if (!foundCommunity)
      throw new HttpException('Community not found', HttpStatus.NOT_FOUND);
    return buildExtendedCommunity(foundCommunity);
  }

  @Get(':address')
  async findByAddress(
    @Param('address') address: string,
  ): Promise<ExtendedCommunity> {
    const foundCommunity = await this.communitiesService.findByAddress(address);
    if (!foundCommunity)
      throw new HttpException('Community not found', HttpStatus.NOT_FOUND);
    return buildExtendedCommunity(foundCommunity);
  }

  @Get('communities/votesAtBlockTag/:communityAddress/:tag/:address')
  async votesAtBlockTag(
    @Param("communityAddress") communityAddress: string,
    @Param("tag") tag: string,
    @Param("address") address: string
  ): Promise<BigNumberish> {
    const foundCommunity = await this.communitiesService.findByAddress(communityAddress);
    if (!foundCommunity)
      throw new HttpException('Community not found', HttpStatus.NOT_FOUND);
    return this.communitiesService.votesAtBlockTag(foundCommunity, tag, address);

  }
}

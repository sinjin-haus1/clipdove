import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { VideosService } from './videos.service';
import { RawVideo } from './models/raw-video.model';
import { HighlightClip } from './models/highlight-clip.model';

@Resolver(() => HighlightClip)
export class VideosResolver {
  constructor(private readonly videosService: VideosService) {}

  @Query(() => [RawVideo])
  async rawVideos(@Args('gameId', { type: () => ID }) gameId: string): Promise<RawVideo[]> {
    return this.videosService.findRawVideosByGame(gameId);
  }

  @Query(() => [HighlightClip])
  async highlightClips(@Args('gameId', { type: () => ID }) gameId: string): Promise<HighlightClip[]> {
    return this.videosService.findHighlightClipsByGame(gameId);
  }

  @Mutation(() => HighlightClip)
  async createHighlightClip(
    @Args('gameId', { type: () => ID }) gameId: string,
    @Args('startTime', { type: () => Float }) startTime: number,
    @Args('endTime', { type: () => Float }) endTime: number,
    @Args('playerId', { type: () => ID, nullable: true }) playerId?: string,
    @Args('title', { nullable: true }) title?: string,
  ): Promise<HighlightClip> {
    return this.videosService.createHighlightClip({ gameId, playerId, startTime, endTime, title });
  }
}

import { Resolver, Query, Mutation, Args, ID, Float } from '@nestjs/graphql';
import { VideosService } from './videos.service';
import { RawVideo } from './models/raw-video.model';
import { HighlightClip } from './models/highlight-clip.model';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { mkdir } from 'fs/promises';

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

  @Mutation(() => RawVideo)
  async uploadRawVideo(
    @Args('gameId', { type: () => ID }) gameId: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Args('file') file: any,
  ): Promise<RawVideo> {
    // file is a Promise<FileUpload> from graphql-upload
    // The Upload scalar's value is the resolved FileUpload (via Upload.promise)
    const { createReadStream, filename } = await (file as Promise<{ createReadStream(): any; filename: string }>);
    const uniqueFilename = `${Date.now()}-${filename}`;
    const uploadsDir = join(process.cwd(), 'uploads');

    await mkdir(uploadsDir, { recursive: true });
    const filePath = join(uploadsDir, uniqueFilename);

    return new Promise((resolve, reject) => {
      createReadStream()
        .pipe(createWriteStream(filePath))
        .on('finish', async () => {
          try {
            const rawVideo = await this.videosService.createRawVideo({ gameId, filename: uniqueFilename });
            resolve(rawVideo);
          } catch (err) {
            reject(err);
          }
        })
        .on('error', reject);
    });
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

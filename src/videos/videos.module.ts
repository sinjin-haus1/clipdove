import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VideosService } from './videos.service';
import { VideosResolver } from './videos.resolver';
import { RawVideo, RawVideoSchema } from './models/raw-video.model';
import { HighlightClip, HighlightClipSchema } from './models/highlight-clip.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RawVideo.name, schema: RawVideoSchema },
      { name: HighlightClip.name, schema: HighlightClipSchema },
    ]),
  ],
  providers: [VideosService, VideosResolver],
  exports: [VideosService],
})
export class VideosModule {}

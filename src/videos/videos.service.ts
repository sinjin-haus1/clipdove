import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RawVideo, RawVideoDocument } from './models/raw-video.model';
import { HighlightClip, HighlightClipDocument } from './models/highlight-clip.model';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(RawVideo.name) private rawVideoModel: Model<RawVideoDocument>,
    @InjectModel(HighlightClip.name) private highlightClipModel: Model<HighlightClipDocument>,
  ) {}

  async findRawVideosByGame(gameId: string): Promise<RawVideo[]> {
    return this.rawVideoModel.find({ gameId }).exec();
  }

  async findHighlightClipsByGame(gameId: string): Promise<HighlightClip[]> {
    return this.highlightClipModel.find({ gameId }).exec();
  }

  async createRawVideo(input: { gameId: string; filename: string; duration?: number }): Promise<RawVideo> {
    const video = new this.rawVideoModel({ ...input, status: 'uploaded' });
    return video.save();
  }

  async createHighlightClip(input: {
    gameId: string;
    playerId?: string;
    startTime: number;
    endTime: number;
    title?: string;
  }): Promise<HighlightClip> {
    const clip = new this.highlightClipModel({ ...input, status: 'pending' });
    return clip.save();
  }

  async findHighlightClip(id: string): Promise<HighlightClip> {
    const clip = await this.highlightClipModel.findById(id).exec();
    if (!clip) {
      throw new NotFoundException(`HighlightClip with ID ${id} not found`);
    }
    return clip;
  }

  async updateHighlightClipStatus(id: string, status: string, outputUrl?: string): Promise<HighlightClip> {
    const update: Record<string, unknown> = { status };
    if (outputUrl) {
      update.outputUrl = outputUrl;
    }
    return this.highlightClipModel.findByIdAndUpdate(id, update, { new: true }).exec() as Promise<HighlightClip>;
  }
}

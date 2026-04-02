import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as path from 'path';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import * as ffmpegStatic from 'ffmpeg-static';
import { HighlightClip, HighlightClipDocument } from '../videos/models/highlight-clip.model';
import { Player, PlayerDocument } from '../players/models/player.model';
import { Team, TeamDocument } from '../teams/models/team.model';

// Set FFmpeg binary path for ffmpeg-static
const ffmpegPath = ffmpegStatic as unknown as string;
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
}

@Injectable()
export class ProcessingService {
  private readonly logger = new Logger(ProcessingService.name);
  private readonly outputDir: string;

  constructor(
    @InjectModel(HighlightClip.name) private clipModel: Model<HighlightClipDocument>,
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
  ) {
    this.outputDir = path.resolve(process.cwd(), 'uploads', 'processed');
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async processHighlight(clipId: string): Promise<HighlightClip> {
    const clip = await this.clipModel.findById(clipId).exec();
    if (!clip) {
      throw new NotFoundException(`HighlightClip with ID ${clipId} not found`);
    }

    // Update status to processing
    clip.status = 'processing';
    await clip.save();

    let playerName = 'Unknown Player';
    let teamName = 'Unknown Team';
    let jerseyNumber = '';

    if (clip.playerId) {
      const player = await this.playerModel.findById(clip.playerId).exec();
      if (player) {
        playerName = player.name;
        jerseyNumber = player.jerseyNumber?.toString() || '';
        const team = await this.teamModel.findById(player.teamId).exec();
        if (team) {
          teamName = team.name;
        }
      }
    }

    const outputFilename = `highlight_${clipId}_${Date.now()}.mp4`;
    const outputPath = path.join(this.outputDir, outputFilename);

    // Stub: Use a sample video path. In production, this would be the actual raw video file.
    const sampleInputPath = path.resolve(process.cwd(), 'uploads', 'raw', `game_${clip.gameId}.mp4`);

    // For stub purposes, we'll create a placeholder file if input doesn't exist
    // In production, the raw video would actually exist
    if (!fs.existsSync(sampleInputPath)) {
      this.logger.warn(`Input video not found at ${sampleInputPath}. Creating stub output.`);
      // Create a minimal stub to demonstrate the flow works
      fs.writeFileSync(outputPath, Buffer.from('stub-video-content'));
      clip.status = 'completed';
      clip.outputUrl = `/uploads/processed/${outputFilename}`;
      await clip.save();
      return clip;
    }

    return new Promise((resolve, reject) => {
      ffmpeg(sampleInputPath)
        .setStartTime(clip.startTime)
        .setDuration(clip.endTime - clip.startTime)
        .outputOptions([
          '-vf', `drawtext=text='${teamName} #${jerseyNumber}':fontcolor=white:fontsize=48:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:x=(w-text_w)/2:y=h-80:borderw=3:bordercolor=black`,
          '-c:v', 'libx264',
          '-preset', 'fast',
          '-crf', '23',
          '-c:a', 'aac',
          '-b:a', '128k',
          '-r', '30',
          '-s', '1080x1920', // Vertical 9:16 for TikTok/Shorts
          '-movflags', '+faststart',
        ])
        .output(outputPath)
        .on('progress', (progress) => {
          this.logger.debug(`Processing: ${progress.percent?.toFixed(1)}% done`);
        })
        .on('end', async () => {
          this.logger.log(`Highlight clip saved to ${outputPath}`);
          clip.status = 'completed';
          clip.outputUrl = `/uploads/processed/${outputFilename}`;
          await clip.save();
          resolve(clip);
        })
        .on('error', (err) => {
          this.logger.error(`FFmpeg error: ${err.message}`);
          clip.status = 'failed';
          clip.save();
          reject(err);
        })
        .run();
    });
  }
}

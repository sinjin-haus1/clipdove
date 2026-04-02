import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProcessingService } from './processing.service';
import { HighlightClip, HighlightClipSchema } from '../videos/models/highlight-clip.model';
import { Player, PlayerSchema } from '../players/models/player.model';
import { Team, TeamSchema } from '../teams/models/team.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HighlightClip.name, schema: HighlightClipSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Team.name, schema: TeamSchema },
    ]),
  ],
  providers: [ProcessingService],
  exports: [ProcessingService],
})
export class ProcessingModule {}

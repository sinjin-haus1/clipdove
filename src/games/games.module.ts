import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GamesService } from './games.service';
import { GamesResolver } from './games.resolver';
import { Game, GameSchema } from './models/game.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Game.name, schema: GameSchema }]),
  ],
  providers: [GamesService, GamesResolver],
  exports: [GamesService],
})
export class GamesModule {}

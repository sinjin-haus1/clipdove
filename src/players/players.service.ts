import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './models/player.model';

@Injectable()
export class PlayersService {
  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>) {}

  async findByTeam(teamId: string): Promise<Player[]> {
    return this.playerModel.find({ teamId }).exec();
  }

  async findOne(id: string): Promise<Player> {
    const player = await this.playerModel.findById(id).exec();
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  async create(input: { teamId: string; name: string; jerseyNumber?: number; position?: string; parentEmail?: string }): Promise<Player> {
    const player = new this.playerModel(input);
    return player.save();
  }
}

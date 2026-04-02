import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Game, GameDocument } from './models/game.model';

@Injectable()
export class GamesService {
  constructor(@InjectModel(Game.name) private gameModel: Model<GameDocument>) {}

  async findByTeam(teamId: string): Promise<Game[]> {
    return this.gameModel.find({ teamId }).exec();
  }

  async findOne(id: string): Promise<Game> {
    const game = await this.gameModel.findById(id).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }

  async create(input: { teamId: string; opponent: string; gameTime: Date; location?: string }): Promise<Game> {
    const game = new this.gameModel(input);
    return game.save();
  }

  async updateStatus(id: string, status: string): Promise<Game> {
    const game = await this.gameModel.findByIdAndUpdate(id, { status }, { new: true }).exec();
    if (!game) {
      throw new NotFoundException(`Game with ID ${id} not found`);
    }
    return game;
  }
}

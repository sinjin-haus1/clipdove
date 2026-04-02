import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Team, TeamDocument } from './models/team.model';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async findAll(): Promise<Team[]> {
    return this.teamModel.find().exec();
  }

  async findOne(id: string): Promise<Team> {
    const team = await this.teamModel.findById(id).exec();
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }

  async create(input: { name: string; sport: string; leagueId?: string; season?: string }): Promise<Team> {
    const team = new this.teamModel(input);
    return team.save();
  }

  async update(id: string, input: { name?: string; sport?: string; leagueId?: string; season?: string }): Promise<Team> {
    const team = await this.teamModel.findByIdAndUpdate(id, input, { new: true }).exec();
    if (!team) {
      throw new NotFoundException(`Team with ID ${id} not found`);
    }
    return team;
  }
}

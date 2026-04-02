import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { GamesService } from './games.service';
import { Game } from './models/game.model';

@Resolver(() => Game)
export class GamesResolver {
  constructor(private readonly gamesService: GamesService) {}

  @Query(() => [Game])
  async games(@Args('teamId', { type: () => ID }) teamId: string): Promise<Game[]> {
    return this.gamesService.findByTeam(teamId);
  }

  @Query(() => Game)
  async game(@Args('id', { type: () => ID }) id: string): Promise<Game> {
    return this.gamesService.findOne(id);
  }

  @Mutation(() => Game)
  async createGame(
    @Args('teamId', { type: () => ID }) teamId: string,
    @Args('opponent') opponent: string,
    @Args('gameTime') gameTime: Date,
    @Args('location', { nullable: true }) location?: string,
  ): Promise<Game> {
    return this.gamesService.create({ teamId, opponent, gameTime, location });
  }

  @Mutation(() => Game)
  async updateGameStatus(
    @Args('id', { type: () => ID }) id: string,
    @Args('status') status: string,
  ): Promise<Game> {
    return this.gamesService.updateStatus(id, status);
  }
}

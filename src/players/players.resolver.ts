import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PlayersService } from './players.service';
import { Player } from './models/player.model';

@Resolver(() => Player)
export class PlayersResolver {
  constructor(private readonly playersService: PlayersService) {}

  @Query(() => [Player])
  async players(@Args('teamId', { type: () => ID }) teamId: string): Promise<Player[]> {
    return this.playersService.findByTeam(teamId);
  }

  @Query(() => Player)
  async player(@Args('id', { type: () => ID }) id: string): Promise<Player> {
    return this.playersService.findOne(id);
  }

  @Mutation(() => Player)
  async createPlayer(
    @Args('teamId', { type: () => ID }) teamId: string,
    @Args('name') name: string,
    @Args('jerseyNumber', { nullable: true }) jerseyNumber?: number,
    @Args('position', { nullable: true }) position?: string,
    @Args('parentEmail', { nullable: true }) parentEmail?: string,
  ): Promise<Player> {
    return this.playersService.create({ teamId, name, jerseyNumber, position, parentEmail });
  }
}

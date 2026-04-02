import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TeamsService } from './teams.service';
import { Team } from './models/team.model';

@Resolver(() => Team)
export class TeamsResolver {
  constructor(private readonly teamsService: TeamsService) {}

  @Query(() => [Team])
  async teams(): Promise<Team[]> {
    return this.teamsService.findAll();
  }

  @Query(() => Team)
  async team(@Args('id', { type: () => ID }) id: string): Promise<Team> {
    return this.teamsService.findOne(id);
  }

  @Mutation(() => Team)
  async createTeam(
    @Args('name') name: string,
    @Args('sport') sport: string,
    @Args('leagueId', { nullable: true }) leagueId?: string,
    @Args('season', { nullable: true }) season?: string,
  ): Promise<Team> {
    return this.teamsService.create({ name, sport, leagueId, season });
  }

  @Mutation(() => Team)
  async updateTeam(
    @Args('id', { type: () => ID }) id: string,
    @Args('name', { nullable: true }) name?: string,
    @Args('sport', { nullable: true }) sport?: string,
    @Args('leagueId', { nullable: true }) leagueId?: string,
    @Args('season', { nullable: true }) season?: string,
  ): Promise<Team> {
    return this.teamsService.update(id, { name, sport, leagueId, season });
  }
}

import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AccountsService } from './accounts.service';
import { Account } from './models/account.model';

@Resolver(() => Account)
export class AccountsResolver {
  constructor(private readonly accountsService: AccountsService) {}

  @Query(() => Account)
  async me(@Args('email') email: string): Promise<Account> {
    return this.accountsService.findByEmail(email);
  }

  @Query(() => Account)
  async account(@Args('id', { type: () => ID }) id: string): Promise<Account> {
    return this.accountsService.findById(id);
  }

  @Mutation(() => Account)
  async updateAccount(
    @Args('id', { type: () => ID }) id: string,
    @Args('plan') plan: string,
  ): Promise<Account> {
    return this.accountsService.updatePlan(id, plan);
  }

  @Mutation(() => Account)
  async connectSocial(
    @Args('id', { type: () => ID }) id: string,
    @Args('platform') platform: string,
    @Args('accessToken', { nullable: true }) accessToken?: string,
    @Args('refreshToken', { nullable: true }) refreshToken?: string,
  ): Promise<Account> {
    return this.accountsService.connectSocial(id, platform, accessToken, refreshToken);
  }

  @Mutation(() => Account)
  async disconnectSocial(
    @Args('id', { type: () => ID }) id: string,
    @Args('platform') platform: string,
  ): Promise<Account> {
    return this.accountsService.disconnectSocial(id, platform);
  }
}

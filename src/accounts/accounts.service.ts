import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Account, AccountDocument, SocialConnection } from './models/account.model';

@Injectable()
export class AccountsService {
  constructor(@InjectModel(Account.name) private accountModel: Model<AccountDocument>) {}

  async findByEmail(email: string): Promise<Account> {
    const account = await this.accountModel.findOne({ email }).exec();
    if (!account) {
      throw new NotFoundException(`Account with email ${email} not found`);
    }
    return account;
  }

  async findById(id: string): Promise<Account> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return account;
  }

  async create(email: string): Promise<Account> {
    const account = new this.accountModel({ email, plan: 'free', socialConnections: [] });
    return account.save();
  }

  async updatePlan(id: string, plan: string): Promise<Account> {
    return this.accountModel.findByIdAndUpdate(id, { plan }, { new: true }).exec() as Promise<Account>;
  }

  async connectSocial(id: string, platform: string, accessToken?: string, refreshToken?: string): Promise<Account> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    const existingIndex = account.socialConnections.findIndex((c) => c.platform === platform);
    const connection: SocialConnection = {
      platform,
      accessToken,
      refreshToken,
      connectedAt: new Date(),
      connected: true,
    };

    if (existingIndex >= 0) {
      account.socialConnections[existingIndex] = connection;
    } else {
      account.socialConnections.push(connection);
    }

    await account.save();
    return account;
  }

  async disconnectSocial(id: string, platform: string): Promise<Account> {
    const account = await this.accountModel.findById(id).exec();
    if (!account) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }

    const existingIndex = account.socialConnections.findIndex((c) => c.platform === platform);
    if (existingIndex >= 0) {
      account.socialConnections[existingIndex].connected = false;
      account.socialConnections[existingIndex].accessToken = undefined;
      account.socialConnections[existingIndex].refreshToken = undefined;
      await account.save();
    }

    return account;
  }
}

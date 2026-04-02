import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AccountDocument = Account & Document;

@ObjectType()
@Schema({ timestamps: true })
export class SocialConnection {
  @Field()
  platform: string;

  @Field({ nullable: true })
  accessToken?: string;

  @Field({ nullable: true })
  refreshToken?: string;

  @Field({ nullable: true })
  connectedAt?: Date;

  @Field()
  connected: boolean;
}

@ObjectType()
@Schema({ timestamps: true })
export class Account {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ default: 'free' })
  plan: string;

  @Field(() => [SocialConnection])
  @Prop({ type: [SchemaFactory.createForClass(SocialConnection)], default: [] })
  socialConnections: SocialConnection[];

  @Field()
  createdAt: Date;
}

export const AccountSchema = SchemaFactory.createForClass(Account);

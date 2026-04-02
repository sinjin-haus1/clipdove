import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TeamDocument = Team & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Team {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field()
  @Prop({ required: true })
  sport: string;

  @Field({ nullable: true })
  @Prop()
  leagueId?: string;

  @Field({ nullable: true })
  @Prop()
  season?: string;

  @Field()
  createdAt: Date;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

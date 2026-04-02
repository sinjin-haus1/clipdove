import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GameDocument = Game & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Game {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  teamId: string;

  @Field()
  @Prop({ required: true })
  opponent: string;

  @Field()
  @Prop({ required: true })
  gameTime: Date;

  @Field({ nullable: true })
  @Prop()
  location?: string;

  @Field()
  @Prop({ default: 'scheduled' })
  status: string;

  @Field()
  createdAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);

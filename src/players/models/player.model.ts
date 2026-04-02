import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PlayerDocument = Player & Document;

@ObjectType()
@Schema({ timestamps: true })
export class Player {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  teamId: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field({ nullable: true })
  @Prop()
  jerseyNumber?: number;

  @Field({ nullable: true })
  @Prop()
  position?: string;

  @Field({ nullable: true })
  @Prop()
  parentEmail?: string;

  @Field()
  createdAt: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

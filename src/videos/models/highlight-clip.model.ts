import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type HighlightClipDocument = HighlightClip & Document;

@ObjectType()
@Schema({ timestamps: true })
export class HighlightClip {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId: string;

  @Field(() => ID, { nullable: true })
  @Prop({ type: Types.ObjectId, ref: 'Player' })
  playerId?: string;

  @Field()
  @Prop({ required: true })
  startTime: number;

  @Field()
  @Prop({ required: true })
  endTime: number;

  @Field({ nullable: true })
  @Prop()
  title?: string;

  @Field()
  @Prop({ default: 'pending' })
  status: string;

  @Field({ nullable: true })
  @Prop()
  outputUrl?: string;

  @Field({ nullable: true })
  @Prop()
  socialPostId?: string;

  @Field()
  createdAt: Date;
}

export const HighlightClipSchema = SchemaFactory.createForClass(HighlightClip);

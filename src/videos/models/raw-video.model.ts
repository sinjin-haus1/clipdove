import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type RawVideoDocument = RawVideo & Document;

@ObjectType()
@Schema({ timestamps: true })
export class RawVideo {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Game', required: true })
  gameId: string;

  @Field()
  @Prop({ required: true })
  filename: string;

  @Field({ nullable: true })
  @Prop()
  duration?: number;

  @Field()
  @Prop({ default: 'uploaded' })
  status: string;

  @Field()
  uploadedAt: Date;
}

export const RawVideoSchema = SchemaFactory.createForClass(RawVideo);

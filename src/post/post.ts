import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@ObjectType()
@Schema({ timestamps: true })
export class Post extends Document {
    @Field(() => ID)
    @Prop({ default: () => new Types.ObjectId() })
    _id: Types.ObjectId;

    @Field(() => Date)
    @Prop()
    createdAt: Date;

    @Field(() => Date)
    @Prop()
    updatedAt: Date;

    @Field(() => Date, { nullable: true })
    @Prop()
    deletedAt?: Date;

    @Field()
    @Prop()
    title: string;

    @Field({ nullable: true })
    @Prop()
    description?: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

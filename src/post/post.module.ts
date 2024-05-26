import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { PubsubModule } from 'src/pubsub/pubsub.module';

/**
 * Connect Resolver and Service
 */
@Module({
    imports: [
        PubsubModule,
        MongooseModule.forFeature([
            {
                name: Post.name,
                schema: PostSchema,
            },
        ]),
    ],
    providers: [PostResolver, PostService],
    exports: [PostService],
})
export class PostModule {}

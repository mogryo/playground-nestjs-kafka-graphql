import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { Post } from './post';
import { PostService } from './post.service';
import { FilterPostInput } from './post.filter';
import { CreatePostInput } from './post.create';
import { UpdatePostInput } from './post.update';
import { KafkaPubSubService } from '../pubsub/kafka.pubsub.service';

@Resolver(() => Post)
export class PostResolver {
    constructor(
        private postService: PostService,
        private pubsubService: KafkaPubSubService,
    ) {}

    @Query(() => Int)
    async totalPostCount(
        @Parent() posts: Post[],
        @Args('filters', { type: () => FilterPostInput, nullable: true })
        filters?: FilterPostInput,
    ): Promise<number> {
        const totalCount = await this.postService.getTotalCount(filters);
        return totalCount;
    }

    @Query(() => Post)
    async post(@Args('id') id: string): Promise<Post | null> {
        return this.postService.findOneById(id);
    }

    @Query(() => [Post])
    async posts(
        @Args('pageNumber', { type: () => Int }) pageNumber: number,
        @Args('pageSize', { type: () => Int }) pageSize: number,
        @Args('filters', { type: () => FilterPostInput, nullable: true })
        filters?: any,
    ): Promise<Post[] | null> {
        return this.postService.findAll(pageNumber, pageSize, filters);
    }

    @Mutation(() => Post)
    async createPost(@Args('post') post: CreatePostInput): Promise<Post> {
        const created = await this.postService.create(post);

        await this.pubsubService.getPubSub().publish(
            'postCreated', // channel / topic
            JSON.stringify({
                postCreated: created,
            }), // when publishing the message, the payload must first be serialized.
        );

        return created;
    }

    @Mutation(() => Post)
    async updatePost(
        @Args('id') id: string,
        @Args('post') post: UpdatePostInput,
    ): Promise<Post | null> {
        return this.postService.update(id, post);
    }

    @Mutation(() => Post)
    async deletePost(
        @Args('id') id: string,
        @Args('softDelete', { nullable: true, defaultValue: false })
        softDelete: boolean,
    ): Promise<Post | null> {
        return this.postService.delete(id, softDelete);
    }

    @Subscription(() => Post, {
        resolve(payload, args, context, info) {
            // Convert the Buffer to a string and parse the JSON
            const jsonString = payload?.value?.toString('utf-8');
            const parsedPayload = JSON.parse(jsonString);
            const postCreated = parsedPayload?.postCreated;

            if (postCreated) {
                postCreated.createdAt = new Date(postCreated.createdAt);
                postCreated.updatedAt = new Date(postCreated.updatedAt);
            }

            return postCreated;
        },
    })
    async postCreated() {
        return this.pubsubService.getPubSub().asyncIterator('postCreated');
    }
}

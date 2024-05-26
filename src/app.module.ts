import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { PostModule } from './post/post.module';
import { PubsubModule } from './pubsub/pubsub.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        MongooseModule.forRootAsync({
            useFactory: async () => ({
                uri: 'mongodb://localhost:27017', // add your database uri here
            }),
        }),

        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            playground: true,
            autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
            subscriptions: {
                'graphql-ws': true, // this enables graphql subscriptions
            },
            // here we need to include relevant modules with entities
            // that we need to consider for the graphql schema
            include: [],
        }),

        PostModule,

        PubsubModule,

        UserModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

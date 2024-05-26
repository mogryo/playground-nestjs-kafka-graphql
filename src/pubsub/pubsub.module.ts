import { Module } from '@nestjs/common';
import { KafkaPubSubService } from './kafka.pubsub.service';

@Module({
    providers: [KafkaPubSubService],
    exports: [KafkaPubSubService],
})
export class PubsubModule {}

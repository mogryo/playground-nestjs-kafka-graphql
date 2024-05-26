import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = 4000;
  const url = `localhost:${port}`;

  await app.listen(port);

  console.log(`🚀  Server ready at: http://${url}`);
  console.log(`🚀  GraphQL API ready at: http://${url}/graphql`);
  console.log(`🚀  GraphQL subscriptions ready at: ws://${url}/graphql`);
}

bootstrap();

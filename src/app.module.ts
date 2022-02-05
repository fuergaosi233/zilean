import { GraphQLModule } from '@nestjs/graphql';
import { Logger, Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { AppResolver } from './resolvers/app.resolver';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './configs/config';
import { GraphqlConfig, QueueOptions } from './configs/config.interface';
import { PrismaModule } from 'nestjs-prisma';
import { loggingMiddleware } from './logging.middleware';
import { WxReadService } from './services/wx-read/wx-read.service';
import { HttpModule } from '@nestjs/axios';
import { WxReadBookService } from './services/wx-read/wx-read-book.service';
import { WxReadController } from './controllers/wx-read/wx-read.controller';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [config] }),
    PrismaModule.forRootAsync({
      isGlobal: true,
      useFactory: () => {
        const logger = new Logger('PrismaMiddleware');
        return {
          middlewares: [loggingMiddleware(logger)], // configure your prisma middleware
        };
      },
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const graphqlConfig = configService.get<GraphqlConfig>('graphql');
        return {
          installSubscriptionHandlers: true,
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
          sortSchema: graphqlConfig.sortSchema,
          autoSchemaFile:
            graphqlConfig.schemaDestination || './src/schema.graphql',
          debug: graphqlConfig.debug,
          playground: graphqlConfig.playgroundEnabled,
          context: ({ req }) => ({ req }),
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueueAsync({
      name: 'wx-read',
      useFactory: async (configService: ConfigService) => {
        const bullConfig = await configService.get<QueueOptions>('bull');
        return bullConfig;
      },
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [AppController, WxReadController],
  providers: [AppService, AppResolver, WxReadService, WxReadBookService],
  exports: [AppService, AppResolver, WxReadService, WxReadBookService],
})
export class AppModule {}

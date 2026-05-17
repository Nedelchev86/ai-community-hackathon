import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DonationsModule } from './donations/donations.module';
import { ExchangesModule } from './exchanges/exchanges.module';
import { ReviewsModule } from './reviews/reviews.module';
import { MessagesModule } from './messages/messages.module';
import { EventsModule } from './events/events.module';
import { StoriesModule } from './stories/stories.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    DonationsModule,
    ExchangesModule,
    ReviewsModule,
    MessagesModule,
    EventsModule,
    StoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

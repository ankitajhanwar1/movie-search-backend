import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MoviesController } from './movies/movies.controller';
import { MoviesService } from './movies/service/movies.service';
import { MovieExternalService } from './movies/service/movieExternal.service';

@Module({
  imports: [],
  controllers: [AppController, MoviesController],
  providers: [AppService, MoviesService, MovieExternalService],
})
export class AppModule {}

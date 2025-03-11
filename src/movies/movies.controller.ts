import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { MoviesService } from './service/movies.service';
import { MovieDetail } from '../entity/movieDetail.entity';

@Controller('movies')
export class MoviesController {
    constructor(private movieService: MoviesService) {}
    
    @Get("/")
    async storeMovies() : Promise<MovieDetail[]> {
        return await this.movieService.getAndStoreAllMovies();
    }

    @Get("/search")
    async searchMovie(@Query('searchText') searchText: string) : Promise<MovieDetail[]> {
        if(!searchText) {
            throw new BadRequestException('Search query is required');
        }
        return await this.movieService.searchMovie(searchText);
    }
}

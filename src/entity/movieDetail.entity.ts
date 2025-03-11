export class MovieDetail {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
    Director: string;
    Plot: string;
    imdbRating: string;
  
    constructor(data: Partial<MovieDetail>) {
      this.Title = data.Title || "";
      this.Year = data.Year||"";
      this.imdbID = data.imdbID || "";
      this.Type = data.Type || "";
      this.Poster = data.Poster || "";
      this.Director = data.Director || "";
      this.Plot = data.Plot || "";
      this.imdbRating = data.imdbRating|| "";
    }
  }
  
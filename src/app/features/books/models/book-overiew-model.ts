export interface IAuthors {
  authorId: number;
  firstName: string;
  lastName: string;
}

export interface IBookSummary {
  row: number;
  bookId: number;
  title: string;
  authors: IAuthors[];
  authorCount: number;
}

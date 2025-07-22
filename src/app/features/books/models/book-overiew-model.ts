export interface IAuthors {
  authorId: number;
  firstName: string;
  lastName: string;
}

export interface IBookSummary {
  title: string;
  publisher: string;
  price: number;
  authorCount: number;
  authors: IAuthors[];
}

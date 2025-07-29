import { IAuthor } from "../../authors/models/author.model";

export interface IBookWithAuthorsMui {
  row: number;
  bookId: number;
  title: string;
  publisher: string;
  price: number | null;
  authors: IAuthor[];
  authorCount: number;
}

export interface IBookWithAuthorsMuiFlat {
  bookId: number | null;
  title: string | null;
  publisher: string | null;
  price: number | null;
  authorId: number | null;
  authorName: string | null;
  // rowspan: number | null;
  authorCount: number | null;
}


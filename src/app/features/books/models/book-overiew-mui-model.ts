import { IAuthor } from "../../authors/models/author.model";

export interface IBookWithAuthorsMui {
  row: number;
  bookId: number;
  title: string;
  publisher: string;
  price: number;
  authors: IAuthor[];
  authorCount: number;
}

export interface IBookWithAuthorsMuiFlat {
  bookId: number;
  title: string;
  publisher: string;
  price: number;
  authorId: number;
  author: string;
  rowspan: number;
}

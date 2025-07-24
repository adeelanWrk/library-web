import { IRequestServerSide } from "../../core/model";

export interface IGetBooksPagedRequest extends IRequestServerSide {
  authorId: number | null;
}
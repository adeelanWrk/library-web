export interface IBooksQueryParams {
  startRow: number;
  endRow: number;
  sortModel?: ISortModelItem[];    // Optional array
  filterModel?: IFilterModel;      // Optional object
  quickFilter?: string;           // Optional string
}

export interface ISortModelItem {
  colId: string;      // ชื่อคอลัมน์ เช่น "price", "title"
  sort: 'asc' | 'desc';
}

export interface IFilterModel {
  [colId: string]: IFilterCondition;  // key คือชื่อคอลัมน์, value คือเงื่อนไข filter
}

export interface IFilterCondition {
  filterType: 'text' | 'number' | 'set';
  type?: string;       // เช่น 'contains', 'equals', 'greaterThan' ฯลฯ (ตาม ag-Grid filter types)
  filter?: any;        // ค่าที่ใช้ filter เช่น string, number หรือ array (สำหรับ set filter)
  filterTo?: any;      // กรองแบบช่วง (range) ใช้ filterTo เช่น number range
}

export interface IBooksResponse {
  rows: IBook[];
  lastRow: number; // จำนวนแถวทั้งหมด หรือ -1 หากไม่รู้
}

export interface IBook {
  bookId: number;
  title: string;
  publisher: string;
  price: number;
}

export interface IOlympicData {
    athlete: string,
    age: number,
    country: string,
    year: number,
    date: string,
    sport: string,
    gold: number,
    silver: number,
    bronze: number,
    total: number
}

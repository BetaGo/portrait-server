import { IPagination } from '../../common/pagination/cursor-pagination';

export interface ILockDatePagination extends IPagination {
  lockDate: string;
}

// application/dto/PaginatedResponseDTO.ts
export class PaginatedResponseDTO<T> {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];

  constructor(items: T[], totalItems: number, currentPage: number, perPage: number) {
    this.items = items;
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.perPage = perPage;
    this.totalPages = Math.ceil(totalItems / perPage);
  }
}

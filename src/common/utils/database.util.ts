export class DatabaseUltil {
  static getSkip(page: number, limit: number): number {
    return Math.max(page - 1, 0) * limit;
  }

  static getPaginationMeta(params: {
    currentPage: number;
    limit: number;
    totalItems: number;
  }): {
    currentPage: number;
    nextPage: number | null;
    totalPage: number;
    totalItems: number;
    limit: number;
  } {
    const { limit, currentPage, totalItems } = params;

    const totalPage: number = Math.ceil(totalItems / limit);
    const nextPage: number | null =
      currentPage + 1 <= totalPage ? currentPage + 1 : null;

    return {
      currentPage,
      totalItems,
      nextPage: nextPage,
      totalPage: totalPage,
      limit,
    };
  }
}

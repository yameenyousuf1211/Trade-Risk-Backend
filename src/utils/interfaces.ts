export interface IPaginationResult<T> {
    data: T[];
    pagination: {
        totalItems: number;
        perPage: number;
        totalPages: number;
        currentPage: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
        prevPage: number | null;
        nextPage: number | null;
    };
}

export interface IPaginationFunctionParams {
    query?: Record<string, any>,
    page?: number,
    limit?: number,
    populate?: string | any[],
    select?: string,
    sort?: Record<string, any>,
}
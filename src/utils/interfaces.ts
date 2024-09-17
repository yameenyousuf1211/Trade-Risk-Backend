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
    query?: any, //Record<string, any>,
    page?: number,
    limit?: number,
    populate?: any,
    select?: string,
    sort?: Record<string, any>,
}

export interface ICreateAndSendNotificationParams {
    type: string;
    sender: string;
    lc?: string;
    bid?: string;
}

interface IPayload {
    [key: string]: string;
}

export interface IFirebaseNotificationParams {
    title: string;
    body: string;
    tokens: string[];
    data?: IPayload;
}
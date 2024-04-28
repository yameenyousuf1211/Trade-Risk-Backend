export enum STATUS_CODES {
    SUCCESS = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    PAYMENT_REQUIRED = 402,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE_ENTITY = 422,
    TOO_MANY_REQUESTS = 429,
    INTERNAL_SERVER_ERROR = 500
}

export enum ROLES {
    BANK = 'bank',
    ADMIN = 'admin',
    CORPORATE = 'corporate',
}

export enum COMPANY_CONSTITUTION {
    Partnership = 'partnership',
    Public_Limited_Co = 'public_limited_co',
    Limited_Liability_Co  = 'limited_liability_co',
    Individual_Proprietorship_Co = 'individual_proprietorship_co',
}
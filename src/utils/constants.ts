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

export const pakistanBanks = [
    { name: 'Habib Bank Limited (HBL)' },
    { name: 'United Bank Limited (UBL)' },
    { name: 'MCB Bank Limited' },
    { name: 'Allied Bank Limited (ABL)' },
    { name: 'National Bank of Pakistan (NBP)' },
    { name: 'Bank Alfalah Limited' },
    { name: 'Faysal Bank Limited' },
    { name: 'Askari Bank Limited' },
    { name: 'Bank Al Habib Limited' },
    { name: 'Silkbank Limited' }
  ];
  
  export const saudiBanks = [
    { name: 'National Commercial Bank (AlAhli Bank)' },
    { name: 'Al Rajhi Bank' },
    { name: 'Saudi British Bank (SABB)' },
    { name: 'Riyad Bank' },
    { name: 'Arab National Bank (ANB)' },
    { name: 'Saudi Investment Bank (SAIB)' },
    { name: 'Alinma Bank' },
    { name: 'Bank AlJazira' },
    { name: 'Banque Saudi Fransi (BSF)' },
    { name: 'Saudi Hollandi Bank' }
  ];
  
  export const uaeBanks = [
    { name: 'Emirates NBD (National Bank of Dubai)' },
    { name: 'First Abu Dhabi Bank (FAB)' },
    { name: 'Abu Dhabi Commercial Bank (ADCB)' },
    { name: 'Dubai Islamic Bank (DIB)' },
    { name: 'Mashreq Bank' },
    { name: 'Commercial Bank of Dubai (CBD)' },
    { name: 'Sharjah Islamic Bank (SIB)' },
    { name: 'Abu Dhabi Islamic Bank (ADIB)' },
    { name: 'Union National Bank (UNB)' },
    { name: 'RAKBANK (National Bank of Ras Al Khaimah)' }
  ];
  
  export const kenyaBanks = [
    { name: 'Equity Bank Kenya' },
    { name: 'Kenya Commercial Bank (KCB)' },
    { name: 'Cooperative Bank of Kenya' },
    { name: 'Standard Chartered Bank Kenya' },
    { name: 'Barclays Bank of Kenya (Absa Kenya)' },
    { name: 'Diamond Trust Bank Kenya (DTB)' },
    { name: 'Stanbic Bank Kenya' },
    { name: 'National Bank of Kenya' },
    { name: 'Commercial Bank of Africa (CBA)' },
    { name: 'Housing Finance Company of Kenya' }
  ];
  
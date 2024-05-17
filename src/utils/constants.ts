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
interface BankData {
  name: string;
}

interface BanksByCountry {
  [country: string]: BankData[];
}


export const banks:BanksByCountry  = {
  "United Arab Emirates": [
      { name: "Abu Dhabi Commercial Bank" },
      { name: "Abu Dhabi Islamic Bank" },
      { name: "Ajman Bank" },
      { name: "Al Hilal Bank" },
      { name: "Al Maryah Community Bank" },
      { name: "Al Masraf Arab Bank for Investment & Foreign Trade" },
      { name: "Bank of Sharjah" },
      { name: "Commercial Bank International" },
      { name: "Commercial Bank of Dubai" },
      { name: "Dubai Bank" },
      { name: "Dubai Finance Bank" },
      { name: "Dubai Islamic Bank" },
      { name: "Emirates Investment Bank" },
      { name: "Emirates Islamic" },
      { name: "Emirates NBD" },
      { name: "First Abu Dhabi Bank" },
      { name: "Invest Bank" },
      { name: "Mashreq" },
      { name: "National Bank of Fujairah" },
  ],
  "Saudi Arabia": [
      { name: "Saudi National Bank (SNB)" },
      { name: "Saudi Awwal Bank (SAB)" },
      { name: "The Saudi Investment Bank (SAIB)" },
      { name: "Alinma Bank" },
      { name: "Banque Saudi Fransi (BSF)" },
      { name: "Riyad Bank" },
      { name: "Al-Rajhi Bank" },
      { name: "Arab National Bank (ANB)" },
      { name: "Bank AlBilad" },
      { name: "Bank Aljazira" },
      { name: "Gulf International Bank Saudi Arabia (GIB-SA)" },
  ],
  "Pakistan": [
      { name: "Al Baraka Bank (Pakistan) Limited" },
      { name: "Allied Bank Limited (ABL)" },
      { name: "Askari Bank" },
      { name: "Bank Alfalah Limited (BAFL)" },
      { name: "Bank Al-Habib Limited (BAHL)" },
      { name: "BankIslami Pakistan Limited" },
      { name: "Bank Makramah Limited (BML)" },
      { name: "Bank of Punjab (BOP)" },
      { name: "Bank of Khyber" },
      { name: "Deutsche Bank A.G" },
      { name: "Dubai Islamic Bank Pakistan Limited (DIB Pakistan)" },
      { name: "Faysal Bank Limited (FBL)" },
      { name: "First Women Bank Limited" },
      { name: "Habib Bank Limited (HBL)" },
      { name: "Habib Metropolitan Bank Limited" },
      { name: "Industrial and Commercial Bank of China" },
      { name: "Industrial Development Bank of Pakistan" },
      { name: "JS Bank Limited" },
      { name: "MCB Bank Limited" },
  ],
  "Oman": [
      { name: "Bank Muscat" },
      { name: "Bank Dhofar" },
      { name: "National Bank of Oman" },
      { name: "Sohar International" },
      { name: "Oman Arab Bank" },
      { name: "HSBC Oman" },
      { name: "Ahli Bank" },
      { name: "Bank Nizwa" },
      { name: "Alizz Islamic Bank" },
      { name: "First Abu Dhabi Bank Oman" },
      { name: "Qatar National Bank Oman" },
      { name: "Standard Chartered Bank Oman" },
      { name: "State Bank of India Oman" },
  ],
  "Bahrain": [
      { name: "Ahli United Bank" },
      { name: "Arab Bank plc" },
      { name: "Arab Banking Corporation" },
      { name: "Allied Bank Limited, Wholesale Branch" },
      { name: "Alubaf Arab International Bank" },
      { name: "The Arab Investment Company S.A.A." },
      { name: "Arab Petroleum Investment Corporation" },
      { name: "Askari Wholesale Bank" },
      { name: "BNP Paribas CRB" },
      { name: "Bahrain Development Bank" },
      { name: "Bank of Bahrain and Kuwait" },
      { name: "Bahrain Middle East Bank" },
      { name: "Bank Al Habib Wholesale Branch, Manama" },
      { name: "Bank Alfalah" },
      { name: "Bank of Jordan" },
      { name: "Citibank N.A" },
      { name: "Credit Libanais SAL" },
      { name: "Cairo Amman Bank" },
      { name: "Citicorp Banking Corporation" },
  ],
};
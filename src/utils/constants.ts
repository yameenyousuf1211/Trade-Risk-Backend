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
export const banks = {
  Bahrain: {
    code: "650b50f4d5446e62c254e274",
    list: [
      "Ahli United Bank",
      "Bank of Bahrain and Kuwait (BBK)",
      "National Bank of Bahrain (NBB)",
      "Bahrain Islamic Bank (BisB)",
      "Gulf International Bank (GIB)",
      "Kuwait Finance House (KFH) - Bahrain",
      "HSBC Bank Middle East Limited - Bahrain",
      "Standard Chartered Bank Bahrain",
      "Citibank Bahrain",
      "Ithmaar Bank",
      "Bahrain Development Bank",
      "BMI Bank (Bank of Muscat International)",
      "Arab Banking Corporation (ABC)",
      "Al Salam Bank Bahrain",
      "Khaleeji Commercial Bank"
    ]
  },
  Bangladesh: {
    code: "650b50f4d5446e62c254dc50",
    list: [
      "Sonali Bank Limited",
      "Agrani Bank Limited",
      "Janata Bank Limited",
      "Rupali Bank Limited",
      "Pubali Bank Limited",
      "National Bank Limited",
      "Dutch-Bangla Bank Limited",
      "BRAC Bank Limited",
      "Standard Chartered Bank Bangladesh",
      "HSBC Bangladesh",
      "City Bank Limited",
      "Eastern Bank Limited",
      "United Commercial Bank Limited (UCB)"
    ]
  },
  Saudi: {
    code: "650b50f4d5446e62c25526d8",
    list: [
      "National Commercial Bank (NCB)",
      "Al Rajhi Bank",
      "Riyad Bank",
      "Saudi British Bank (SABB)",
      "Banque Saudi Fransi (BSF)",
      "Arab National Bank (ANB)",
      "Saudi Investment Bank",
      "Alinma Bank",
      "Bank AlJazira",
      "Bank Albilad"
    ]
  },
  Pakistan: {
    code: "650b50f4d5446e62c2550b28",
    list: [
      "National Bank of Pakistan (NBP)",
      "Habib Bank Limited (HBL)",
      "United Bank Limited (UBL)",
      "Muslim Commercial Bank (MCB Bank)",
      "Askari Bank Limited",
      "Allied Bank Limited (ABL)",
      "Bank Alfalah Limited",
      "Faysal Bank Limited",
      "Bank Al-Habib Limited",
      "Meezan Bank Limited",
      "Standard Chartered Bank Pakistan",
      "Soneri Bank Limited",
      "JS Bank Limited"
    ]
  },
  UAE: {
    code: "650b50f4d5446e62c255f04d",
    list: [
      "First Abu Dhabi Bank (FAB)",
      "Emirates NBD - Emirates National Bank of Dubai",
      "Abu Dhabi Commercial Bank (ADCB)",
      "Dubai Islamic Bank (DIB)",
      "Mashreq Bank",
      "Abu Dhabi Islamic Bank (ADIB)",
      "Bank of Sharjah",
      "Commercial Bank of Dubai (CBD)",
      "RAKBANK (National Bank of Ras Al Khaimah)",
      "Sharjah Islamic Bank (SIB)",
      "National Bank of Fujairah (NBF)",
      "Noor Bank",
      "Emirates Islamic Bank"
    ]
  },
  Qatar: {
    code: "650b50f4d5446e62c2560853",
    list: [
      "Qatar National Bank (QNB)",
      "Commercial Bank of Qatar",
      "Doha Bank",
      "Ahli Bank Qatar",
      "Qatar Islamic Bank (QIB)",
      "Masraf Al Rayan",
      "Barwa Bank",
      "Qatar International Islamic Bank (QIIB)",
      "Al Khaliji Commercial Bank (al khaliji)",
      "International Bank of Qatar (IBQ)",
      "Al Rayan Bank",
      "Qatar Development Bank (QDB)"
    ]
  }
};
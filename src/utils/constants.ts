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

// LG issuance within the country"
// value="LG 100% Cash Margin"
// value="LG Re-issuance in another country"
export enum LG_ISSUANCE_TYPES {
  LG_ISSUANCE_WITHIN_COUNTRY = "LG issuance within the country",
  LG_RE_ISSUANCE_IN_ANOTHER_COUNTRY = "LG Re-issuance in another country",
  LG_100_PERCENT_CASH_MARGIN = "LG 100% Cash Margin",
  NONE = "None"
}

export enum ROLES {
  ADMIN = 'admin',
  USER = 'user'
}

export enum ROLE_TYPES {
  BANK = 'bank',
  CORPORATE = 'corporate',
}

export enum NOTIFICATION_TYPES {
  LC_CREATED = 'lc_created',
  BID_CREATED = 'bid_created',
  BID_ACCEPTED = 'bid_accepted',
  BID_REJECTED = 'bid_rejected',
  RISK_CREATED = 'risk_created',
  RISK_ACCEPTED = 'risk_accepted',
  RISK_REJECTED = 'risk_rejected',
}

export enum SOCKET_EVENTS {
  LC_CREATED = 'lc-created',
  BID_CREATED = 'bid-created',
  RISK_CREATED = 'risk-created',
  // BID_ACCEPTED = 'bid-accepted',
  // BID_REJECTED = 'bid-rejected',
}

export enum LC_STATUS {
  PENDING = 'Pending',
  EXPIRED = 'Expired',
  ACCEPTED = 'Accepted',
  ADD_BID = 'Add bid',
}

export enum BID_STATUS {
  PENDING = 'Pending',
  EXPIRED = 'Expired',
  REJECTED = 'Rejected',
  ACCEPTED = 'Accepted'
}

export enum BID_APPROVAL_STATUS {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

export enum COMPANY_CONSTITUTION {
  PROPRIETORSHIP_COMPANY = 'Proprietorship Company',
  INDIVIDUAL = 'Individual',
  LIMITED_LIABILITY_COMPANY = 'Limited Liability Company',
  PUBLIC_LIMITED_COMPANY = 'Public Limited Company',
  PARTNERSHIP = 'Partnership',
  ESTABLISHMENT = 'Establishment'
}


interface BanksByCountry {
  "United Arab Emirates": string[];
  "Saudi Arabia": string[];
  "Pakistan": string[];
  "Oman": string[];
  "Bahrain": string[];
  "Nigeria": string[];
  "India": string[],
  "Bangladesh": string[],
  "Qatar": string[],
  "France": string[],
  "Egypt": string[]
}

export const banks: BanksByCountry = {
  "United Arab Emirates": [
    "Abu Dhabi Commercial Bank",
    "Abu Dhabi Islamic Bank",
    "Ajman Bank",
    "Al Hilal Bank",
    "Al Maryah Community Bank",
    "Al Masraf Arab Bank for Investment & Foreign Trade",
    "Bank of Sharjah",
    "Citibank",
    "Commercial Bank International",
    "Commercial Bank of Dubai",
    "Dubai Bank",
    "Dubai Finance Bank",
    "Dubai Islamic Bank",
    "Emirates Investment Bank",
    "Emirates Islamic",
    "Emirates NBD",
    "First Abu Dhabi Bank",
    "Invest Bank",
    "Mashreq",
    "National Bank of Fujairah",
  ],
  "Saudi Arabia": [
    "J.P. Morgan",
    "Saudi National Bank (SNB)",
    "Saudi Awwal Bank (SAB)",
    "The Saudi Investment Bank (SAIB)",
    "Alinma Bank",
    "Banque Saudi Fransi (BSF)",
    "Riyad Bank",
    "Al-Rajhi Bank",
    "Arab National Bank (ANB)",
    "Bank AlBilad",
    "Bank Aljazira",
    "Gulf International Bank Saudi Arabia (GIB-SA)",
  ],
  "Pakistan": [
    "Al Baraka Bank (Pakistan) Limited",
    "Allied Bank Limited (ABL)",
    "Askari Bank",
    "Bank Alfalah Limited (BAFL)",
    "Bank Al-Habib Limited (BAHL)",
    "BankIslami Pakistan Limited",
    "Bank Makramah Limited (BML)",
    "Bank of Punjab (BOP)",
    "Bank of Khyber",
    "Deutsche Bank A.G",
    "Dubai Islamic Bank Pakistan Limited (DIB Pakistan)",
    "Faysal Bank Limited (FBL)",
    "First Women Bank Limited",
    "Habib Bank Limited (HBL)",
    "Habib Metropolitan Bank Limited",
    "Industrial and Commercial Bank of China",
    "Industrial Development Bank of Pakistan",
    "JS Bank Limited",
    "MCB Bank Limited",
  ],
  "Oman": [
    "Bank Muscat",
    "Bank Dhofar",
    "National Bank of Oman",
    "Sohar International",
    "Oman Arab Bank",
    "HSBC Oman",
    "Ahli Bank",
    "Bank Nizwa",
    "Alizz Islamic Bank",
    "First Abu Dhabi Bank Oman",
    "Qatar National Bank Oman",
    "Standard Chartered Bank Oman",
    "State Bank of India Oman",
  ],
  "Bahrain": [
    "Ahli United Bank",
    "Arab Bank plc",
    "Arab Banking Corporation",
    "Allied Bank Limited, Wholesale Branch",
    "Alubaf Arab International Bank",
    "The Arab Investment Company S.A.A.",
    "Arab Petroleum Investment Corporation",
    "Askari Wholesale Bank",
    "BNP Paribas CRB",
    "Bahrain Development Bank",
    "Bank of Bahrain and Kuwait",
    "Bahrain Middle East Bank",
    "Bank Al Habib Wholesale Branch, Manama",
    "Bank Alfalah",
    "Bank of Jordan",
    "Citibank N.A",
    "Credit Libanais SAL",
    "Cairo Amman Bank",
    "Citicorp Banking Corporation",
  ],
  "Nigeria": [
    "Fidelity Bank Plc",
    "First City Monument Bank Limited",
    "First Bank of Nigeria Limited",
    "Guaranty Trust Holding Company Plc",
    "Union Bank of Nigeria Plc",
    "United Bank for Africa Plc",
    "Zenith Bank Plc",
    "Citibank Nigeria Limited",
    "Ecobank Nigeria",
    "Heritage Bank Plc",
    "Keystone Bank Limited",
    "Optimus Bank Limited",
    "Polaris Bank Limited",
    "Stanbic IBTC Bank Plc",
    "Standard Chartered",
    "Sterling Bank Plc",
    "Titan Trust Bank",
    "Unity Bank Plc",
    "Wema Bank Plc",
    "Globus Bank Limited",
    "Parallex Bank Limited",
    "PremiumTrust Bank Limited",
    "Providus Bank Limited",
    "SunTrust Bank Nigeria Limited",
    "Signature Bank Limited",
    "Jaiz Bank Plc",
    "Lotus Bank",
    "TAJBank Limited",
    "Mutual Trust Microfinance Bank",
    "Rephidim Microfinance Bank",
    "Shepherd Trust Microfinance Bank",
    "Empire Trust Microfinance Bank",
    "Finca Microfinance Bank Limited",
    "Moneyfield Microfinance Bank",
    "Accion Microfinance Bank",
    "Peace Microfinance Bank",
    "Infinity Microfinance Bank",
    "Covenant Microfinance Bank Ltd",
    "Advans La Fayette Microfinance Bank",
    "FairMoney Microfinance Bank",
    "Sparkle Bank",
    "Kuda Bank",
    "Moniepoint Microfinance Bank",
    "Opay",
    "Dot Microfinance Bank",
    "Palmpay",
    "Rubies Bank",
    "VFD Microfinance Bank",
    "Mint Finex MFB",
    "Mkobo MFB",
    "Raven Bank",
    "Rex Microfinance Bank",
    "Coronation Merchant Bank",
    "FBNQuest Merchant Bank",
    "FSDH Merchant Bank",
    "Greenwich Merchant Bank",
    "Rand Merchant Bank",
    "Nova Merchant Bank",
    "SunTrust Bank Nigeria Limited NIB",
    "Stanbic IBTC NIB",
  ],
  "India": [
    "Bank of Baroda",
    "Bank of India",
    "Bank of Maharashtra",
    "Canara Bank",
    "Central Bank of India",
    "Indian Bank",
    "Indian Overseas Bank",
    "Punjab and Sind Bank",
    "Punjab National Bank",
    "State Bank of India",
    "UCO Bank",
    "Union Bank of India",
    "Axis Bank",
    "Bandhan Bank",
    "CSB Bank",
    "City Union Bank",
    "DCB Bank",
    "Dhanlaxmi Bank",
    "Federal Bank",
    "HDFC Bank",
    "ICICI Bank",
    "IDBI Bank",
    "IDFC First Bank",
    "IndusInd Bank",
    "Jammu & Kashmir Bank",
    "Karnataka Bank",
    "Karur Vysya Bank",
    "Kotak Mahindra Bank",
    "Nainital Bank",
    "RBL Bank",
    "South Indian Bank",
    "Tamilnad Mercantile Bank",
    "Yes Bank",
    "Andhra Pradesh Grameena Vikas Bank",
    "Andhra Pragathi Grameena Bank",
    "Chaitanya Godavari Gramin Bank",
    "Saptagiri Gramin Bank",
    "Arunachal Pradesh Rural Bank",
    "Dakshin Bihar Gramin Bank",
    "Uttar Bihar Gramin Bank",
    "Chhattisgarh Rajya Gramin Bank",
    "Baroda Gujarat Gramin Bank",
    "Saurashtra Gramin Bank",
    "Sarva Haryana Gramin Bank",
    "Himachal Pradesh Gramin Bank",
    "Ellaquai Dehati Bank",
    "Jammu And Kashmir Grameen Bank",
    "Jharkhand Rajya Gramin Bank",
    "Karnataka Gramin Bank",
    "Karnataka Vikas Grameena Bank",
    "Kerala Gramin Bank",
    "Madhya Pradesh Gramin Bank",
    "Madhyanchal Gramin Bank",
    "Maharashtra Gramin Bank",
    "Vidarbha Konkan Gramin Bank",
    "Manipur Rural Bank",
    "Meghalaya Rural Bank",
    "Mizoram Rural Bank",
    "Nagaland Rural Bank",
    "Odisha Gramya Bank",
    "Utkal Grameen Bank",
    "Puduvai Bharathiar Grama Bank",
    "Punjab Gramin Bank",
    "Rajasthan Marudhara Gramin Bank",
    "Baroda Rajasthan Kshetriya Gramin Bank",
    "Tamil Nadu Grama Bank",
    "Telangana Grameena Bank",
    "Tripura Gramin Bank",
    "Aryavart Bank",
    "Baroda UP Bank",
    "Prathama UP Gramin Bank",
    "Uttarakhand Gramin Bank",
    "Bangiya Gramin Vikash Bank",
    "Paschim Banga Gramin Bank",
    "Uttarbanga Kshetriya Gramin Bank",
  ],
  "Bangladesh": [
    "AB Bank PLC",
    "Bangladesh Commerce Bank Limited",
    "Bank Asia Limited",
    "Bengal Commercial Bank Limited",
    "BRAC Bank PLC",
    "City Bank PLC",
    "Community Bank Bangladesh Limited",
    "Dhaka Bank Limited",
    "Dhaka Mercantile Co-Operative Bank Limited",
    "Dutch-Bangla Bank Limited",
    "Eastern Bank PLC",
    "IFIC Bank PLC",
    "Jamuna Bank Limited",
    "Meghna Bank Limited",
    "Mercantile Bank PLC",
    "Midland Bank Limited",
    "Modhumoti Bank Limited",
    "Mutual Trust Bank Limited",
    "National Credit & Commerce Bank Limited",
    "NRB Bank Limited",
    "NRBC Bank PLC",
    "One Bank Limited",
    "Premier Bank Limited",
    "Prime Bank PLC",
    "Pubali Bank Limited",
    "Shimanto Bank Limited",
    "Southeast Bank Limited",
    "South Bangla Agriculture and Commerce Bank Limited",
    "Trust Bank PLC",
    "United Commercial Bank PLC",
    "Uttara Bank PLC"
  ],
  "Qatar": [
    "Qatar National Bank",
    "Doha Bank",
    "Commercial Bank of Qatar",
    "Qatar International Islamic Bank",
    "Qatar Islamic Bank",
    "Qatar Development Bank",
    "Ahlibank",
    "Masraf Al Rayan",
    "Dukhan Bank"
  ],
  "France": [
    "BNP Paribas",
    "Société Générale",
    "Crédit Agricole",
    "Natixis",
    "HSBC France",
    "La Banque Postale",
    "Crédit Lyonnais (LCL)",
    "BPCE (Banque Populaire-Caisse d'Épargne)",
    "Société Générale Equipment Finance",
    "BRED Banque Populaire",
    "CIC (Crédit Industriel et Commercial)",
    "Eurobank",
    "ING France",
    "DNB France",
    "Commerzbank France",
    "Standard Chartered France",
    "UniCredit France",
    "Bank of China (France)",
    "Deutsche Bank France",
    "ABN AMRO France"
  ],
  "Egypt": [
    "National Bank of Egypt (NBE)",
    "Banque Misr",
    "Commercial International Bank (CIB)",
    "Qatar National Bank Alahli (QNB ALAHLI)",
    "Arab African International Bank (AAIB)",
    "Bank of Alexandria",
    "HSBC Egypt",
    "Suez Canal Bank",
    "Egyptian Gulf Bank (EGB)",
    "Faisal Islamic Bank of Egypt",
    "Alexbank (Intesa Sanpaolo)",
    "Banque du Caire",
    "Union National Bank - Egypt",
    "Emirates NBD Egypt",
    "Arab International Bank (AIB)",
    "National Bank of Kuwait (NBK) Egypt",
    "National Bank of Oman (NBO) Egypt",
    "Bank of China (Egypt)",
    "Cairo Amman Bank",
    "Kuwait Finance House Egypt",
    "Bank of Palestine",
    "Egyptian Arab Land Bank",
    "Egyptian Commercial Bank",
    "Piraeus Bank Egypt",
    "Suez Canal Bank",
    "First Abu Dhabi Bank Egypt",
    "RAK Bank Egypt",
    "Jordan Kuwait Bank Egypt",
    "Arab Bank Egypt",
    "Qatar Islamic Bank Egypt",
    "Kuwait Investment Authority Egypt",
    "SGBL Egypt (Société Générale de Banque au Liban)",
    "Cairo Bank",
    "Invest Bank Egypt",
    "Hellenic Bank Egypt",
    "Al Baraka Bank Egypt",
    "Bank AlJazira Egypt",
    "Bank AlEtihad Egypt",
    "Lebanon & Gulf Bank Egypt",
    "Samba Financial Group Egypt",
    "Jordan Ahli Bank Egypt",
    "Union Bank Egypt",
    "Misr Iran Development Bank",
    "Roya Bank Egypt",
    "Ahli United Bank Egypt",
    "Arab Investment Bank",
    "Oman Arab Bank Egypt",
    "Al Ahli Bank Egypt",
    "National Bank of Greece Egypt",
    "Qatar Islamic Bank (UK) Egypt"
  ],





};

interface PortsByCountry {
  "United Arab Emirates": string[];
  "Saudi Arabia": string[];
  "Pakistan": string[];
  "Oman": string[];
  "Bahrain": string[];
  "Qatar": string[];
  "Bangladesh": string[];


}

export const portsData = [
  {
    country: "United Arab Emirates",
    ports: [
      "Al Hamriya",
      "Port of Jebel Ali",
      "Port of Fujairah",
      "Port of Mina Zayed",
      "Port of Ras Al Khaimah",
      "Mina Rashid Port"
    ]
  },
  {
    country: "Saudi Arabia",
    ports: [
      "Jubail",
      "Jeddah",
      "Yanbu Commercial",
      "Jizan",
      "Dammam",
      "Dhuba"
    ]
  },
  {
    country: "Pakistan",
    ports: [
      "Gwadar",
      "Muhammad bin Qasim",
      "Karachi",
      "Keti Bandar",
      "Jiwani",
      "Port of Ormara"
    ]
  },
  {
    country: "Oman",
    ports: [
      "Khasab",
      "Mina Qaboos",
      "Muscat",
      "Qalhat",
      "Salalah",
      "Sohar"
    ]
  },
  {
    country: "Bahrain",
    ports: [
      "Khalifa Bin Salman Port",
      "Muharraq Fisherman Port",
      "Ras Rayya Fisherman Port",
      "Budaiya Fisherman Port",
      "Al Dur Jetty Fisherman Port",
      "Hidd Fisherman Port"
    ]
  },
  {
    country: "Qatar",
    ports: [
      "Al Rayyan Marine Terminal",
      "Doha",
      "Hamad",
      "Mesaieed",
      "Ras Laffan",
      "Umm Said"
    ]
  },
  {
    country: "Bangladesh",
    ports: [
      "Barisal",
      "Dhaka",
      "Benapole",
      "Mongla",
      "Chittagong",
      "Dhaka-Kamalapur"
    ]
  }
];


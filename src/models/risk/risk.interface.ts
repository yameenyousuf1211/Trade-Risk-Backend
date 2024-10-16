import { Document } from "mongoose";

export interface IRisk extends Document {
    business: string,
    user: string,
    draft: boolean,
    refId: number,
    status: string,

    banks: [{ country: string, city: string, bank: string, swiftCode: string }],
    signedCopy: [Object],

    // 1
    transaction: string,

    // 2
    riskParticipation: string,
    transactionType: string,
    riskParticipationTransaction: {
        currency: string,
        amount: number,
        isParticipationOffered: boolean,
        percentage: number,
        participationCurrency: string,
        participationValue: number,
        pricingOffered: number,
    },

    // 3
    issuingBank: { bank: string, country: string },
    advisingBank: { bank: string, country: string },
    confirmingBank: { bank: string, country: string, dateType: string, date: Date },
    lcPeriod: { dateType: string, date: Date, lcExpiry: Date },
    paymentTerms: string,
    extraInfo: { days: number, other: string },
    shipmentPort: { country: string, port: string },
    transhipment: boolean,
    productDescription: string,

    // 4 - Importer Info
    importerInfo: { name: string, countryOfImport: string, port: string },

    // 5 - Exporter Info
    exporterInfo: { name: string, countryOfExport: string, beneficiaryCountry: string },

    // 6 - Attach LC copy
    attachment: [Object],

    // 7 - Last Date of receiving bids
    lastDateOfReceivingBids: Date,

    // 8 - Additional notes
    additionalNotes: string,
}

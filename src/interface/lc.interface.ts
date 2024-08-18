import { Types } from 'mongoose';

interface ILcs extends Document {
    _id:string
    participantRole?: 'importer' | 'exporter';
    currency?: string;
    type?: 'LC Confirmation' | 'LC Discounting' | 'LC Confirmation & Discounting' | 'LG Issuance';
    amount?: {
        price?: number;
        margin?: number;
        amountPercentage?: string;
    };
    refId?: number;
    extraInfo?: {
        dats?: Date;
        other?: string;
    };
    paymentTerms?: string;
    issuingBank?: [{
        bank?: string;
        country?: string;
    }];
    advisingBank?: {
        bank?: string;
        country?: string;
    };
    expectedDiscountingDate?: Date;
    expectedConfirmationDate?: Date;
    confirmingBank?: {
        bank?: string;
        country?: string;
    };
    shipmentPort?: {
        country?: string;
        port?: string;
    };
    transhipment?: boolean;
    expectedDate?: Date;
    productDescription?: string;
    period?: {
        expectedDate?: boolean;
        startDate?: Date;
        endDate?: Date;
    };
    importerInfo?: {
        applicantName?: string;
        countryOfImport?: string;
    };
    exporterInfo?: {
        beneficiaryName?: string;
        countryOfExport?: string;
        beneficiaryCountry?: string;
        bank?: string;
    };
    confirmationInfo?: {
        behalfOf?: string;
        pricePerAnnum?: string;
    };
    discountingInfo?: {
        discountAtSight?: string;
        pricePerAnnum?: string;
        behalfOf?: string;
    };
    createdBy?: Types.ObjectId;
    attachments?: string[];
    draft?: boolean;
    isDeleted?: boolean;
    status?: 'Pending' | 'Expired' | 'Rejected' | 'Accepted' | 'Add bid';
    lgIssueAgainst?: string;
    lgType?: string;
    // purpose?: string;
    standardSAMA?: boolean;
    chargesBehalfOf?: string;
    remarks?: string;
    priceType?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export default ILcs;

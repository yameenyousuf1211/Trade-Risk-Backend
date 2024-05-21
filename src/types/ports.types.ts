interface Port {
    PORT_ID: string;
    PORT_NAME: string;
    CENTERX: string;
    CENTERY: string;
    COUNTRY: string;
    COUNTRY_CODE: string;
    UNLOCODE: string | null;
    COUNT_PHOTOS: string;
    SHIPCOUNT: string;
    DEPARTCOUNT: string;
    ARRIVECOUNT: string;
    EXPECTEDCOUNT: string;
    CURRENT_TIME: number;
    CURRENT_OFFSET: string;
    RELATED_ANCH_NAME: string | null;
    RELATED_ANCH_ID: string | null;
    AREA_CODE_NAME: string;
    AREA_NAME: string;
    COVERAGE: string;
    COVERAGE_STATUS: string;
}

export interface PortsData {
    totalCount: number;
    ports: Port[];
}
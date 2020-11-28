export enum ResMessage {
    OK = "OK",

    ENTITY_EXIST = "ENTITY_EXIST",
    ENTITY_NEXIST = "ENTITY_NEXIST",

    PARAMS_ERROR = "PARAMS_ERROR",
    BAD_REQUEST = "BAD_REQUEST",
    QUERY_ERROR = "QUERY_ERROR",
    PASSWORD_ERROT = "PASSWORD_ERROT",

    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export class InsertResponse {
    insertId: number;

    constructor(id: number) {
        this.insertId = id;
    }
}

export default class ResponseBody {
    constructor(status: boolean, code: number, message: string, data: unknown) {
        this.status = status;
        this.data = data;
        this.code = code;
        this.message = message;
    }

    status: boolean;

    message: string;

    code: number;

    data: unknown;
}

class AppError {
    public readonly message: string;
    public readonly statusCode: number;
    public readonly statusMessage: string;

    constructor(message: string, statusCode = 400, statusMessage = "No content") {
        this.message = message;
        this.statusCode = statusCode;
        this.statusMessage = statusMessage
        switch (this.statusCode) {
            case 404:
                this.statusMessage = "Not Found."
                break;
            case 400:
                this.statusMessage = "Bad Request."
                break;
            case 401:
                this.statusMessage = "Unauthorized"
            
        }
    }
}

export default AppError;
export class LateCheckInValidationError extends Error {
    constructor() {
        super("Check-in is late");
        this.name = "LateCheckInValidationError";
    }
}
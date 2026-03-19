import { SenderType } from "../enums/sender-type.enum";

export interface Message {
    senderType: SenderType,
    message: string
}
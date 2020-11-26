import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { MessageCreateDto } from "./message.dto"
import { Message } from "./message.entity"

@Injectable()
export class MessageService {
    constructor(protected connection: Connection) {}

    async insertOne(dto: MessageCreateDto): Promise<boolean> {
        const msg = new Message()
        msg.content = dto.content
        msg.contact = dto.contact
        await this.connection.manager.insert(Message, msg)
        return true
    }

    async find(
        limit: number,
        offset: number,
        order: "ASC" | "DESC",
        orderName: string,
    ): Promise<Message[]> {
        const builder = await this.connection
            .createQueryBuilder(Message, "message")
            .offset(offset)
            .limit(limit)
            .orderBy(`message.${orderName}`, order)
        return builder.getMany()
    }
}

import { Injectable } from "@nestjs/common"
import { OrderType } from "src/util/constant"
import { Connection } from "typeorm"
import { MessageCreateDto } from "./message.dto"
import { Message } from "./message.entity"

@Injectable()
export class MessageService {
    constructor(protected connection: Connection) {}

    async insertOne(dto: MessageCreateDto): Promise<number> {
        const msg = new Message()
        msg.content = dto.content
        msg.contact = dto.contact
        let result = await this.connection.manager.save(Message, msg)
        return result.id
    }

    async find(
        limit: number,
        offset: number,
        order: OrderType,
        orderName: string,
    ): Promise<Message[]> {
        const builder = await this.connection
            .createQueryBuilder(Message, "message")
            .offset(offset)
            .limit(limit)
            .orderBy(`message.${orderName}`, order)
        return builder.getMany()
    }

    async findOne(id: number): Promise<Message> {
        return this.connection.manager.findOne(Message, id)
    }
}

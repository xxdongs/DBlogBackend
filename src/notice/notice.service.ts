import { Injectable } from "@nestjs/common";
import { NoticeType, OrderType } from "src/util/constant";
import { Connection } from "typeorm";
import { Notice } from "./notice.entity";

@Injectable()
export class NoticeService {
    constructor(protected connection: Connection) {}

    async insertOne(type: NoticeType, link: string, ext: string = undefined) {
        if (type === "LIKED" && ext === "1") return;
        const notice: Notice = new Notice();
        notice.type = type;
        notice.link = link;
        await this.connection.manager.save(Notice, notice);
    }

    async markRead(id: number) {
        await this.connection.manager.update(Notice, id, { read: true });
    }

    async markReadAll() {
        await this.connection.manager.update(Notice, null, { read: true });
    }

    async find(
        limit: number,
        offset: number,
        order: OrderType,
        orderName: string,
    ): Promise<Notice[]> {
        const builder = await this.connection
            .createQueryBuilder(Notice, "notice")
            .offset(offset)
            .limit(limit)
            .orderBy(`notice.${orderName}`, order);
        return builder.getMany();
    }
}

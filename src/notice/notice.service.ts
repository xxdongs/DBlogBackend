import { Injectable } from "@nestjs/common"
import { NoticeType } from "src/util/constant"
import { Connection } from "typeorm"
import { Notice } from "./notice.entity"

@Injectable()
export class NoticeService {
    constructor(protected connection: Connection) {}

    async insertOne(type: NoticeType, link: string, ext: string = undefined) {
        if (type === "LIKED" && ext === "1") return
        let notice: Notice = new Notice()
        notice.type = type
        notice.link = link
        await this.connection.manager.save(Notice, notice)
    }
}

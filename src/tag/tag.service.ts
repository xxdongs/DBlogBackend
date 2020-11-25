import { Injectable } from "@nestjs/common"
import { Connection } from "typeorm"
import { Tag } from "./tag.entity"

@Injectable()
export class TagService {
    constructor(protected connection: Connection) {}

    async find(): Promise<Tag[]> {
        return await this.connection
            .getRepository(Tag)
            .query("select distinct name from tag")
    }
}

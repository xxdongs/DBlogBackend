import { Injectable } from "@nestjs/common"
import { Connection, EntityManager } from "typeorm"
import { Tag } from "./tag.entity"

@Injectable()
export class TagService {
    constructor(protected connection: Connection) {}

    async find(): Promise<Tag[]> {
        return await this.connection
            .getRepository(Tag)
            .query("select distinct name from tag")
    }

    async insertMany(manager: EntityManager, tags: string[]): Promise<Tag[]> {
        const result: Tag[] = []
        for (const val of tags) {
            const tag: Tag = new Tag(val)
            await manager.save(Tag, tag)
            result.push(tag)
        }
        return result
    }

    async deleteMany(manager: EntityManager, tags: Tag[]) {
        for (const val of tags) {
            await manager.delete(Tag, val)
        }
    }
}

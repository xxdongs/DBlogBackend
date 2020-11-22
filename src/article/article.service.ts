import { Injectable } from "@nestjs/common"
import { Tag } from "src/tag/tag.entity"
import { User } from "src/user/user.entity"
import { Connection, FindManyOptions, FindOneOptions } from "typeorm"
import { ArticleCreateDto } from "./article.dto"
import { Article } from "./article.entity"

@Injectable()
export class ArticleService {
    constructor(protected connection: Connection) {}

    async find(
        userId: number,
        limit: number,
        offset: number,
        order: string,
        orderName: string,
    ): Promise<[Article[], number]> {
        const options: FindManyOptions<Article> = {
            select: ["id", "title", "open", "create"],
            relations: ["comments", "tags"],
            skip: offset,
            take: limit,
            order: {
                [orderName]: order,
            },
        }
        if (userId > 0) {
            options.where = [
                { user: await this.connection.manager.findOne(User, userId) },
            ]
        } else {
            options.where = [{ open: true }]
        }
        return this.connection.manager.findAndCount(Article, options)
    }

    async findOne(id: number, authed: boolean = false): Promise<Article> {
        const options: FindOneOptions<Article> = {
            select: ["id", "title", "content", "open", "create", "update"],
            relations: ["comments", "tags"],
            where: { id },
        }
        if (!authed) options.where = { id, open: true }
        return await this.connection.manager.findOne(Article, options)
    }

    async insertOne(userId: number, dto: ArticleCreateDto): Promise<number> {
        return await this.connection.transaction(async (manager) => {
            const user = await manager.findOne(User, userId)
            const a = new Article()
            a.title = dto.title
            a.content = dto.content
            a.open = dto.open
            a.user = user
            const tags: Tag[] = []
            // attach tags to article
            if (Array.isArray(dto.tags) && dto.tags.length > 0) {
                for (const val of dto.tags) {
                    const tag: Tag = new Tag(val)
                    await manager.save(Tag, tag)
                    tags.push(tag)
                }
            }
            a.tags = tags
            const result = await manager.save(Article, a)
            return result ? result.id : 0
        })
    }
}

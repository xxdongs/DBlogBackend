import { Injectable } from "@nestjs/common"
import { Tag } from "src/tag/tag.entity"
import { Connection, FindManyOptions, FindOneOptions } from "typeorm"
import { ArticleBindTagDto, ArticleCreateDto } from "./article.dto"
import { Article } from "./article.entity"

@Injectable()
export class ArticleService {
    constructor(protected connection: Connection) {}

    async find(
        limit: number,
        offset: number,
        order: string,
        orderName: string,
        authed: boolean = false,
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
        if (!authed) {
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

    async insertOne(dto: ArticleCreateDto): Promise<number> {
        return await this.connection.transaction(async (manager) => {
            const a = new Article()
            a.title = dto.title
            a.content = dto.content
            a.open = dto.open
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

    async bindTag(
        articleId: number,
        dto: ArticleBindTagDto,
        authed: boolean = true,
    ): Promise<boolean> {
        const one = await this.findOne(articleId, authed)
        if (!one) return false
        return await this.connection.manager.transaction(async (manager) => {
            const tags: Tag[] = []
            for (const val of one.tags) {
                await manager.delete(Tag, val)
            }
            for (const val of dto.tags) {
                const tag: Tag = new Tag(val)
                await manager.save(Tag, tag)
                tags.push(tag)
            }
            one.tags = tags
            await manager.save(Article, one)
            return true
        })
    }
}

import { Injectable } from "@nestjs/common"
import { Tag } from "src/tag/tag.entity"
import { Connection, FindOneOptions } from "typeorm"
import { ArticleBindTagDto, ArticleCreateDto } from "./article.dto"
import { Article } from "./article.entity"

@Injectable()
export class ArticleService {
    constructor(protected connection: Connection) {}

    async find(
        limit: number,
        offset: number,
        order: "ASC" | "DESC",
        orderName: string,
        tag: string,
        key: string,
        authed: boolean = false,
    ): Promise<Article[]> {
        const builder = await this.connection
            .createQueryBuilder(Article, "article")
            .leftJoinAndSelect("article.tags", "tag")
            .offset(offset)
            .limit(limit)
            .orderBy(`article.${orderName}`, order)
        if (!authed) builder.andWhere("article.open = :open", { open: 1 })
        if (tag) builder.andWhere("tag.name = :tag", { tag })
        if (key)
            builder.andWhere("article.title like :key", { key: `%${key}%` })
        return builder.getMany()
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

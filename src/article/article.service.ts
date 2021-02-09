import { Injectable } from "@nestjs/common"
import { Tag } from "src/tag/tag.entity"
import { TagService } from "src/tag/tag.service"
import { OrderType } from "src/util/constant"
import { Connection, FindOneOptions } from "typeorm"
import {
    ArticleBindTagDto,
    ArticleCreateDto,
    ArticleUpdateDto,
} from "./article.dto"
import { Article } from "./article.entity"

@Injectable()
export class ArticleService {
    constructor(
        protected connection: Connection,
        private tagService: TagService,
    ) {}

    async find(
        limit: number,
        offset: number,
        order: OrderType,
        orderName: string,
        tag: string,
        key: string,
        authed = false,
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

    async findOne(id: number, authed = false): Promise<Article> {
        const options: FindOneOptions<Article> = {
            select: ["id", "title", "content", "open", "create", "update"],
            relations: ["comments", "tags"],
            where: { id },
        }
        if (!authed) options.where = { id, open: true }
        return await this.connection.manager.findOne(Article, options)
    }

    async insertOrUpdateOne(
        dto: ArticleCreateDto | ArticleUpdateDto,
        articleId = 0,
    ): Promise<number> {
        return await this.connection.transaction(async (manager) => {
            let a: Article
            if (articleId > 0) a = await manager.findOne(Article, articleId)
            else a = new Article()
            if (dto.title) a.title = dto.title
            if (dto.content) a.content = dto.content
            if (dto.open !== undefined) a.open = dto.open
            const tags: Tag[] = await this.tagService.insertMany(
                manager,
                dto.tags,
            )
            a.tags = tags
            const result = await manager.save(Article, a)
            return result ? result.id : 0
        })
    }

    async deleteOne(id: number): Promise<boolean> {
        const result = await this.connection.manager.delete(Article, id)
        return result.affected > 0
    }

    async count(id: number, type: number): Promise<boolean> {
        let column: string
        if (type === 1) column = "read"
        else if (type === 2) column = "liked"
        else return false
        const result = await this.connection
            .createQueryBuilder()
            .update(Article)
            .set({
                [column]: () => `${column} + 1`,
            })
            .where("id = :id", { id })
            .execute()
        return result.affected > 0
    }

    async bindTag(
        articleId: number,
        dto: ArticleBindTagDto,
        authed = true,
    ): Promise<boolean> {
        const one = await this.findOne(articleId, authed)
        if (!one) return false
        return await this.connection.manager.transaction(async (manager) => {
            await this.tagService.deleteMany(manager, one.tags)
            const tags: Tag[] = await this.tagService.insertMany(
                manager,
                dto.tags,
            )
            one.tags = tags
            await manager.save(Article, one)
            return true
        })
    }
}

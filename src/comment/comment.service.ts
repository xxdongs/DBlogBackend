import { Injectable } from "@nestjs/common"
import { Article } from "src/article/article.entity"
import { Connection } from "typeorm"
import { CommentCreateDto } from "./comment.dto"
import { Comment } from "./comment.entity"

@Injectable()
export class CommentService {
    constructor(protected connection: Connection) {}

    async insertOne(dto: CommentCreateDto): Promise<number> {
        const article = await this.connection.manager.findOne(
            Article,
            dto.articleId,
        )
        if (!article) return 0
        const comment = new Comment()
        comment.content = dto.content
        comment.article = article
        const result = await this.connection.manager.save(Comment, comment)
        return result ? result.id : 0
    }

    async findOne(id: number, authed: boolean = false): Promise<Comment> {
        const comm = await this.connection.manager.findOne(Comment, id)
        if (!authed && comm) {
            if (!comm.article.open) return null
        }
        return comm
    }

    async deleteOne(id: number): Promise<boolean> {
        const result = await this.connection.manager.delete(Comment, id)
        return result.affected > 0
    }
}

import {
    BadRequestException,
    Body,
    Controller,
    Param,
    Post,
    UseGuards,
    Request,
    NotFoundException,
    Delete,
    Get,
} from "@nestjs/common"
import { ApiCreatedResponse } from "@nestjs/swagger"
import { NoticeService } from "src/notice/notice.service"
import { JwtAuthGuard } from "src/util/jtw.authguard"
import { InsertResponse } from "src/util/ResMessage"
import { CommentCreateDto } from "./comment.dto"
import { Comment } from "./comment.entity"
import { CommentService } from "./comment.service"

@Controller("comment")
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        private readonly noticeService: NoticeService,
    ) {}

    @ApiCreatedResponse({ type: InsertResponse })
    @Post()
    async createComment(
        @Body() dto: CommentCreateDto,
    ): Promise<InsertResponse> {
        const insertId = await this.commentService.insertOne(dto)
        if (insertId === 0) throw new BadRequestException()
        await this.noticeService.insertOne("COMMENT", `/comment/${insertId}`)
        return new InsertResponse(insertId)
    }

    @ApiCreatedResponse({ type: InsertResponse })
    @UseGuards(new JwtAuthGuard(false))
    @Get(":id")
    async getAComment(
        @Request() req,
        @Param("id") id: number,
    ): Promise<Comment> {
        const authed = req.user ? true : false
        const comm = await this.commentService.findOne(id, authed)
        if (!comm) throw new NotFoundException()
        return comm
    }

    @UseGuards(new JwtAuthGuard())
    @Delete(":id")
    async delComment(@Param("id") id: number) {
        const ok = await this.commentService.deleteOne(id)
        if (!ok) throw new NotFoundException()
    }
}

import {
    Controller,
    UseGuards,
    Request,
    Get,
    Query,
    Post,
    Body,
    BadRequestException,
    Param,
    NotFoundException,
} from "@nestjs/common"
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiOkResponse,
} from "@nestjs/swagger"
import { User } from "src/user/user.entity"
import { JwtAuthGuard } from "src/util/jtw.authguard"
import { InsertResponse } from "src/util/ResMessage"
import { ArticleBindTagDto, ArticleCreateDto } from "./article.dto"
import { Article } from "./article.entity"
import { ArticleService } from "./article.service"

@Controller("article")
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    LIMIT = 3
    OFFSET = 0
    ORDER = "DESC"
    ORDER_NAME = "create"

    @ApiOkResponse({ type: [Article] })
    @UseGuards(new JwtAuthGuard(false))
    @Get()
    async getArticle(
        @Request() req,
        @Query("limit") limit = this.LIMIT,
        @Query("offset") offset = this.OFFSET,
        @Query("order") order = this.ORDER,
        @Query("order_name") orderName = this.ORDER_NAME,
    ): Promise<[Article[], number]> {
        const id = req.user ? (req.user as User).id : 0
        return await this.articleService.find(
            id,
            limit,
            offset,
            order,
            orderName,
        )
    }

    @ApiOkResponse({ type: Article })
    @UseGuards(new JwtAuthGuard(false))
    @Get(":id")
    async getOneArticle(
        @Request() req,
        @Param("id") id: number,
    ): Promise<Article> {
        let authed = req.user ? true : false
        const art = await this.articleService.findOne(id, authed)
        if (!art) throw new NotFoundException()
        return art
    }

    @ApiBearerAuth()
    @ApiCreatedResponse({ type: InsertResponse })
    @UseGuards(new JwtAuthGuard())
    @Post()
    async createArticle(
        @Request() req,
        @Body() dto: ArticleCreateDto,
    ): Promise<InsertResponse> {
        const id = (req.user as User).id
        const insertId = await this.articleService.insertOne(id, dto)
        if (insertId === 0) throw new BadRequestException()
        return new InsertResponse(insertId)
    }

    @ApiBearerAuth()
    @UseGuards(new JwtAuthGuard())
    @Post(":id/bind")
    async bindTag(@Param("id") id: number, @Body() dto: ArticleBindTagDto) {
        const ok = await this.articleService.bindTag(id, dto)
        if (!ok) throw new NotFoundException()
    }
}

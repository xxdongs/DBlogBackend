import { IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class ArticleCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly title: string
    @ApiProperty()
    @IsNotEmpty()
    readonly content: string
    @ApiProperty()
    readonly open: boolean
    @ApiProperty({ type: [String] })
    readonly tags?: string[]
}

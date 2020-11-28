import { IsNotEmpty, ArrayMinSize, IsDefined } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ArticleCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly title: string;

    @ApiProperty()
    @IsNotEmpty()
    readonly content: string;

    @ApiProperty()
    readonly open: boolean;

    @ApiProperty({ type: [String] })
    readonly tags?: string[];
}

export class ArticleUpdateDto {
    @ApiProperty()
    readonly title: string;

    @ApiProperty()
    readonly content: string;

    @ApiProperty()
    readonly open: boolean;

    @ApiProperty({ type: [String] })
    @IsDefined()
    readonly tags?: string[];
}

export class ArticleBindTagDto {
    @ApiProperty({ type: [String] })
    @ArrayMinSize(0)
    tags: string[];
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsDefined } from "class-validator";

export class CommentCreateDto {
    @ApiProperty()
    @IsNotEmpty()
    readonly content: string;

    @ApiProperty()
    @IsDefined()
    readonly articleId: number;
}

import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from "@nestjs/common"
import { QueryFailedError } from "typeorm"

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : exception instanceof QueryFailedError
                ? 400
                : HttpStatus.INTERNAL_SERVER_ERROR
        response.code(status).send({ err: (exception as Error).message })
    }
}

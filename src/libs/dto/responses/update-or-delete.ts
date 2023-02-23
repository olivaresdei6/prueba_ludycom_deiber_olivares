import { ApiProperty } from "@nestjs/swagger";
import { ResponseFormat } from "./format";

export class ResponseForUpdateOrDelete extends ResponseFormat<any> {
    @ApiProperty()
    data: string;
}
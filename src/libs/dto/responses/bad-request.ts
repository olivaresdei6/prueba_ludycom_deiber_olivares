import { ApiProperty } from "@nestjs/swagger";

export class ResponseBadRequestFormat {
    @ApiProperty()
    code: number;
    @ApiProperty()
    timestamp: Date;
    @ApiProperty()
    path: string;
    @ApiProperty()
    message: string;
};
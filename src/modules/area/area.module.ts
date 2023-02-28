import { Module } from '@nestjs/common';
import { MySQLDatabaseModule } from "../../framework/database/mysql/mysql-data.module";
import { ExceptionsModule } from '../../config/exceptions/exceptions.module';
import {AreaController} from "./area.controller";
import {AreaService} from "./area.service";

@Module({
    controllers: [AreaController],
    providers: [AreaService],
    exports:  [AreaService],
    imports: [
        ExceptionsModule,
        MySQLDatabaseModule,
    ],
    
})
export class AreaModule {}

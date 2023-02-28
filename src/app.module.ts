import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UsuarioModule } from './modules/usuario/usuario.module';
import { SwaggerConfig } from './config/swagger/swagger';
import { MySQLDatabaseModule } from './framework/database/mysql/mysql-data.module';
import {AreaModule} from "./modules/area/area.module";

@Module({
	imports: [
		SwaggerConfig,
		MySQLDatabaseModule,
		UsuarioModule,
		AreaModule
	],
	providers: [AppService],
})
export class AppModule { }

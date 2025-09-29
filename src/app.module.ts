import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ProductAttrModule } from './product-attr/product-attr.module';
import { ProductAttrValModule } from './product-attr-val/product-attr-val.module';
import { ProductAttrVarModule } from './product-attr-var/product-attr-var.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        port: configService.get('DB_PORT'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: configService.get('DB_AUTO_LOAD_ENTITIES') === 'true',
        synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    ProductAttrModule,
    ProductAttrValModule,
    ProductAttrVarModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}

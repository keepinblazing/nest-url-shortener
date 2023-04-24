import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url/url.entity';
import cuid from 'cuid';

@Controller('url')
export class UrlController {
  constructor(
    @InjectRepository(Url)
    private readonly urlRepository: Repository<Url>,
  ) {}

  @Post('shorten')
  async shortenUrl(@Body('longUrl') longUrl: string, @Res() res) {
    const baseUrl = '';
    const expression =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);

    if (longUrl.match(regex)) {
      try {
        let url: Url;
        const urls: Url[] = await this.urlRepository.find({
          where: {
            longUrl,
          },
        });

        if (urls.length > 0) {
          url = urls[0];
        } else {
          const code: string = cuid().slice(-4);
          url = new Url();
          url.id = code;
          url.longUrl = longUrl;
          url.shortUrl = baseUrl + '/' + code;
          await this.urlRepository.save(url);
        }
        res.status(HttpStatus.OK).json(url);
      } catch (err) {
        console.error(err.message);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json('Server Error');
      }
    } else {
      res.status(HttpStatus.BAD_REQUEST).json('Invalid long Url');
    }
  }

  @Get(':id')
  async redirect(@Param('id') id: string, @Res() res) {
    try {
      const url = await this.urlRepository.findOneBy({ id: id });
      if (url) {
        res.redirect(url.longUrl);
      } else {
        res.status(HttpStatus.NOT_FOUND).json('Url Not found');
      }
    } catch (err) {
      console.error(err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        message: err.message,
      });
    }
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Book2 } from './interfaces';
@Injectable()
export class WxReadBookService {
  constructor(private prisma: PrismaService) {}
  // find or create Books
  async findOrCreateBooks(books: Book2[], userVid: number) {
    const upsertBooksPromises = books.map(async (bookInfo) => {
      const { bookId, title, author, cover } = bookInfo;
      const book = await this.prisma.book.upsert({
        where: {
          bookId,
        },
        create: {
          bookId,
          title,
          author,
          cover,
          wxUsers: {
            create: {
              userVid,
            },
          },
        },
        update: {},
      });
      return book;
    });
    return await Promise.all(upsertBooksPromises);
  }
  async getAllBooksByVid(vid: number) {
    const books = await this.prisma.book.findMany({
      where: {
        wxUsers: {
          some: {
            userVid: vid,
          },
        },
      },
    });
    return books;
  }
}

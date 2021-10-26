import { PrismaClient } from '@prisma/client';
import authorData from './authors.json';
import bookData from './books.json';

const prisma = new PrismaClient();

async function main() {
  const books: any = (bookData as any).books;

  prisma.$executeRawUnsafe('DELETE FROM table authors');
  prisma.$executeRawUnsafe('DELETE FROM table books');
  prisma.$executeRawUnsafe('DELETE FROM table books');
  prisma.$executeRawUnsafe('DELETE FROM table books_on_authors');
  prisma.$executeRawUnsafe('DELETE FROM table wikipedia_links');
  prisma.$executeRawUnsafe('DELETE FROM table goodreads_links');
  prisma.$executeRawUnsafe('DELETE FROM table gutenberg_links');
  prisma.$executeRawUnsafe('DELETE FROM table "_AuthorToBook"');

  for (const book of books) {
    const {
      id: bookId,
      content_name: contentName,
      isbn,
      original_title: originalTitle,
      year,
      author_name: authorName,
      images_urls: imagesUrls,
      languageCode,
      images,
      category,
      plot,
      genres,
      copyright,
      title,
      wikipedia,
      averageRating,
      ratingCount,
      goodreads,
      similar_books: similarBooks,
      description,
      loc_class: locClass,
      gutenberg,
      pages,
      language,
      isbn13,
      countries,
      release_date: releaseDate,
      author,
      cover,
      summary,
      content_cleaned: contentCleaned,
      classes,
      content_available: contentAvailable,
      n_authors: nAuthors,
    } = book;

    const newBook = await prisma.book.upsert({
      where: { id: bookId },
      update: {},
      create: {
        contentName,
        isbn,
        originalTitle,
        year,
        authorName,
        imagesUrls,
        languageCode,
        images,
        category,
        plot,
        genres,
        copyright,
        title,
        wikipedia: {
          create: {
            url: gutenberg ? wikipedia.url : undefined,
            found: gutenberg ? wikipedia.found : undefined,
          },
        },
        averageRating,
        ratingCount,
        goodreads: {
          create: {
            url: goodreads ? goodreads.url : undefined,
            found: goodreads ? goodreads.found : undefined,
            year: goodreads ? goodreads.year : undefined,
          },
        },
        similarBooks,
        description,
        locClass,
        gutenberg: {
          create: {
            url: gutenberg ? gutenberg.url : undefined,
            num: gutenberg ? gutenberg.num : undefined,
          },
        },
        pages,
        language,
        isbn13,
        countries,
        releaseDate: releaseDate ? new Date(releaseDate) : undefined,
        author,
        cover,
        summary,
        contentCleaned,
        classes,
        contentAvailable,
        nAuthors,
      },
    });

    console.log(`created id: ${newBook.id} original_id: ${bookId} title: ${title}`);
  }

  for (const author of authorData.authors) {
    const {
      id: authorId,
      bio,
      name,
      countries,
      gender,
      wikipedia,
      summary,
      born,
      died,
      books: authorBooks,
      n_books: nBooks
    } = author;

    const newAuthor = await prisma.author.upsert({
      where: { id: authorId },
      update: {},
      include: {
        books: true,
      },
      create: {
        bio: bio,
        name,
        countries: countries,
        gender,
        nBooks,
        summary,
        born: born ? new Date(born) : undefined,
        died: died ? new Date(died) : undefined,
        wikipedia: {
          create: {
            url: wikipedia ? wikipedia.url : undefined,
            found: wikipedia ? wikipedia.found : undefined,
          },
        },
      },
    });

    for (const book of books.filter((book) => authorBooks.includes(book.id))) {
      const updatedAuthor = await prisma.author.update({
        where: {
          id: authorId,
        },
        include: {
          books: true,
        },
        data: {
          books: {
            connect: {
              id: book.id,
            },
          }
        },
      });
    }
    console.log('created', authorId);
  }
  console.log('done');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
const pool = require("../config/database");

const sampleBooks = [
  {
    id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Classic Literature",
    rating: 4.2,
    pages: 180,
    year: 1925,
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-7432-7356-5",
    publisher: "Scribner",
  },
  {
    id: "2",
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    rating: 4.3,
    pages: 688,
    year: 1965,
    description: "An epic science fiction novel set on the desert planet Arrakis, following Paul Atreides in his quest for revenge and power.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-441-17271-9",
    publisher: "Chilton Books",
  },
  {
    id: "1",
    title: "Divergent",
    author: "Veronica Roth",
    genre: "Dystopian",
    rating: 4.1,
    pages: 487,
    year: 2011,
    description: "A dystopian social science fiction novel about the Divergent series tackles themes of identity and belonging.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-452-28423-4",
    publisher: "HarperCollins Children's Books",
  },
  {
    id: "4",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic Literature",
    rating: 4.3,
    pages: 281,
    year: 1960,
    description: "A powerful story of racial injustice and moral growth in the American South, seen through the eyes of young Scout Finch.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-06-112008-4",
    publisher: "J. B. Lippincott & Co.",
  },
  {
   id: "7",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    year: 1997,
    pages: 223,
    genre: "Fantasy",
    rating: 4.7,
    cover: "/Harry Potter.jpg",
    authorInitial: "J",
    description:
      "The first book in the beloved Harry Potter series about a young wizard discovering his magical heritage.",
    isbn: "978-0-7475-3269-9",
    publisher: "Bloomsbury",
  },
  {
    id: "8",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    rating: 4.3,
    pages: 310,
    year: 1937,
    description: "A fantasy novel about the adventures of hobbit Bilbo Baggins, who is swept into an epic quest to reclaim a dwarf kingdom.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-618-00221-3",
    publisher: "George Allen & Unwin",
  },
  {
    id: "5",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Classic Literature",
    rating: 4.3,
    pages: 279,
    year: 1813,
    description: "A romantic novel of manners that follows the emotional development of Elizabeth Bennet, who learns about the repercussions of hasty judgments.",
    cover_image: "/placeholder.svg?height=250&width=150",
    isbn: "978-0-19-953556-9",
    publisher: "T. Egerton, Whitehall",
  },
  {
    id: "6",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    year: 1951,
    pages: 277,
    genre: "Coming of Age",
    rating: 3.8,
    cover: "/The catcher in the Rye.jpg",
    authorInitial: "J",
    description:
      "A controversial novel about teenage rebellion and alienation, narrated by the iconic Holden Caulfield.",
    isbn: "978-0-316-76948-0",
    publisher: "Little, Brown and Company",
  }
];

async function seedBooks() {
  try {
    console.log("Starting to seed books...");

    // First, clear existing data to avoid duplicates
    await pool.query("TRUNCATE TABLE books RESTART IDENTITY CASCADE");
    console.log("✓ Cleared existing books");

    for (const book of sampleBooks) {
      const query = `
        INSERT INTO books (
          title, author, genre, rating, pages, year, 
          description, cover_image, isbn, publisher
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;

      const values = [
        book.title,
        book.author,
        book.genre,
        book.rating,
        book.pages,
        book.year,
        book.description,
        book.cover_image,
        book.isbn,
        book.publisher,
      ];

      await pool.query(query, values);
      console.log(`✓ Added: ${book.title}`);
    }

    console.log("✅ Successfully seeded 8 books!");
  } catch (error) {
    console.error("❌ Error seeding books:", error);
  } finally {
    await pool.end();
  }
}

// Run the seed function
seedBooks();
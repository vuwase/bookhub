const { Pool } = require("pg")
require("dotenv").config()

async function createTables() {
  console.log("🏗️  Creating database tables...")

  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false,
  })

  try {
    const client = await pool.connect()

    // Create books table
    console.log("📚 Creating books table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS books (
          id SERIAL PRIMARY KEY,
          title VARCHAR(200) NOT NULL,
          author VARCHAR(100) NOT NULL,
          isbn VARCHAR(20) UNIQUE,
          genre VARCHAR(50) NOT NULL,
          published_date DATE,
          publisher VARCHAR(100),
          pages INTEGER CHECK (pages > 0 AND pages <= 10000),
          language VARCHAR(50) DEFAULT 'English',
          description TEXT,
          cover_image TEXT,
          price DECIMAL(10,2) CHECK (price >= 0),
          rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
          review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
          availability VARCHAR(20) DEFAULT 'Available' CHECK (availability IN ('Available', 'Out of Stock', 'Coming Soon')),
          tags TEXT[],
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create users table
    console.log("👥 Creating users table...")
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `)

    // Create indexes
    console.log("🔍 Creating indexes...")
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('english', title));
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('english', author));
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_books_genre ON books(genre);
    `)
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `)

    // Insert sample data
    console.log("📖 Inserting sample books...")
    await client.query(`
      INSERT INTO books (title, author, isbn, genre, published_date, publisher, pages, description, cover_image, price, rating, review_count, tags) VALUES
      ('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 'Classic Literature', '1925-04-10', 'Scribner', 180, 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream through the eyes of Nick Carraway.', '/placeholder.svg?height=250&width=150', 12.99, 4.2, 1250, ARRAY['classic', 'american literature', 'jazz age']),
      
      ('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 'Classic Literature', '1960-07-11', 'J.B. Lippincott & Co.', 324, 'A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.', '/placeholder.svg?height=250&width=150', 13.99, 4.5, 2100, ARRAY['classic', 'social justice', 'coming of age']),
      
      ('Dune', 'Frank Herbert', '978-0-441-17271-9', 'Science Fiction', '1965-08-01', 'Chilton Books', 688, 'An epic science fiction novel set on the desert planet Arrakis, following Paul Atreides in his quest for revenge and power.', '/placeholder.svg?height=250&width=150', 16.99, 4.3, 1800, ARRAY['sci-fi', 'epic', 'space opera']),
      
      ('The Hobbit', 'J.R.R. Tolkien', '978-0-547-92822-7', 'Fantasy', '1937-09-21', 'George Allen & Unwin', 310, 'A fantasy adventure following Bilbo Baggins on his unexpected journey to help a group of dwarves reclaim their homeland.', '/placeholder.svg?height=250&width=150', 14.99, 4.6, 3200, ARRAY['fantasy', 'adventure', 'tolkien']),
      
      ('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 'Romance', '1813-01-28', 'T. Egerton', 432, 'A romantic novel exploring themes of love, reputation, and class in Georgian England through Elizabeth Bennet and Mr. Darcy.', '/placeholder.svg?height=250&width=150', 11.99, 4.4, 1900, ARRAY['romance', 'classic', 'regency'])
      
      ON CONFLICT (isbn) DO NOTHING;
    `)

    // Check results
    const bookCount = await client.query("SELECT COUNT(*) FROM books")
    const userCount = await client.query("SELECT COUNT(*) FROM users")

    console.log("✅ Database setup complete!")
    console.log(`📚 Books table: ${bookCount.rows[0].count} records`)
    console.log(`👥 Users table: ${userCount.rows[0].count} records`)

    client.release()
    await pool.end()
  } catch (error) {
    console.error("❌ Error setting up database:", error)
    await pool.end()
    process.exit(1)
  }
}

createTables()

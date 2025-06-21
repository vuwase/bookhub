-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
    pages INTEGER CHECK (pages > 0),
    year INTEGER CHECK (year >= 1000 AND year <= EXTRACT(YEAR FROM CURRENT_DATE)),
    description TEXT NOT NULL,
    cover_image VARCHAR(500),
    isbn VARCHAR(17),
    publisher VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

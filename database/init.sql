-- ============================================
-- PostgREST Showcase - Database Initialization
-- ============================================

-- Create roles for PostgREST
CREATE ROLE web_anon NOLOGIN;
CREATE ROLE web_user NOLOGIN;

-- Grant privileges
GRANT web_anon TO authenticator;
GRANT web_user TO authenticator;

-- ============================================
-- Tables
-- ============================================

-- Authors table
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Genres table
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    year INTEGER,
    author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
    genre_id INTEGER REFERENCES genres(id) ON DELETE SET NULL,
    description TEXT,
    isbn TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- Views
-- ============================================

-- Book details view with joined author and genre information
CREATE VIEW book_details AS
SELECT
    b.id,
    b.title,
    b.year,
    b.description,
    b.isbn,
    b.created_at,
    a.id as author_id,
    a.name as author_name,
    a.bio as author_bio,
    g.id as genre_id,
    g.name as genre_name
FROM books b
LEFT JOIN authors a ON b.author_id = a.id
LEFT JOIN genres g ON b.genre_id = g.id;

-- ============================================
-- RPC Functions
-- ============================================

-- Get top genres by book count
CREATE FUNCTION get_top_genres(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(genre_name TEXT, book_count BIGINT) AS $$
    SELECT g.name, COUNT(b.id)::BIGINT as book_count
    FROM genres g
    LEFT JOIN books b ON g.id = b.genre_id
    GROUP BY g.id, g.name
    ORDER BY COUNT(b.id) DESC
    LIMIT limit_count;
$$ LANGUAGE SQL STABLE;

-- Search books by title or description
CREATE FUNCTION search_books(search_term TEXT)
RETURNS SETOF books AS $$
    SELECT * FROM books
    WHERE title ILIKE '%' || search_term || '%'
       OR description ILIKE '%' || search_term || '%'
    ORDER BY title;
$$ LANGUAGE SQL STABLE;

-- ============================================
-- Permissions
-- ============================================

-- Anonymous role: full CRUD access for demo purposes
GRANT USAGE ON SCHEMA public TO web_anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON authors, genres, books TO web_anon;
GRANT SELECT ON book_details TO web_anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO web_anon;
GRANT EXECUTE ON FUNCTION get_top_genres(INTEGER) TO web_anon;
GRANT EXECUTE ON FUNCTION search_books(TEXT) TO web_anon;

-- Authenticated role: full CRUD access
GRANT USAGE ON SCHEMA public TO web_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON authors, genres, books TO web_user;
GRANT SELECT ON book_details TO web_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO web_user;
GRANT EXECUTE ON FUNCTION get_top_genres(INTEGER) TO web_user;
GRANT EXECUTE ON FUNCTION search_books(TEXT) TO web_user;

-- ============================================
-- Seed Data
-- ============================================

-- Insert genres
INSERT INTO genres (name) VALUES
    ('Fantasy'),
    ('Science Fiction'),
    ('Mystery'),
    ('Romance'),
    ('Non-Fiction');

-- Insert authors
INSERT INTO authors (name, bio) VALUES
    ('J.K. Rowling', 'British author best known for the Harry Potter series.'),
    ('Isaac Asimov', 'Prolific science fiction writer and biochemistry professor.'),
    ('Agatha Christie', 'The best-selling novelist of all time, known for detective novels.'),
    ('Jane Austen', 'English novelist known for romantic fiction set among the landed gentry.'),
    ('Malcolm Gladwell', 'Canadian journalist and author of popular psychology and sociology books.'),
    ('Brandon Sanderson', 'American fantasy author known for intricate magic systems.'),
    ('Andy Weir', 'American novelist, best known for The Martian.'),
    ('Gillian Flynn', 'American author known for psychological thrillers.');

-- Insert books
INSERT INTO books (title, year, author_id, genre_id, description, isbn) VALUES
    ('Harry Potter and the Philosopher''s Stone', 1997, 1, 1, 'A young wizard discovers his magical heritage on his 11th birthday.', '978-0-7475-3269-9'),
    ('Harry Potter and the Chamber of Secrets', 1998, 1, 1, 'Harry returns to Hogwarts and faces a mysterious monster lurking in the school.', '978-0-7475-3849-3'),
    ('Foundation', 1951, 2, 2, 'A mathematician develops a theory to reduce the coming dark age from millennia to centuries.', '978-0-553-29335-0'),
    ('I, Robot', 1950, 2, 2, 'A collection of nine science fiction short stories exploring the Three Laws of Robotics.', '978-0-553-38256-3'),
    ('Murder on the Orient Express', 1934, 3, 3, 'Detective Hercule Poirot investigates a murder on a snowbound train.', '978-0-00-712426-4'),
    ('The Murder of Roger Ackroyd', 1926, 3, 3, 'A village doctor narrates the investigation of a wealthy man''s death.', '978-0-00-651432-4'),
    ('Pride and Prejudice', 1813, 4, 4, 'The story of Elizabeth Bennet and her complex relationship with Mr. Darcy.', '978-0-14-143951-8'),
    ('Sense and Sensibility', 1811, 4, 4, 'Two sisters navigate love and heartbreak in Georgian England.', '978-0-14-143966-2'),
    ('Outliers', 2008, 5, 5, 'An examination of the factors that contribute to high levels of success.', '978-0-316-01792-3'),
    ('The Tipping Point', 2000, 5, 5, 'How little things can make a big difference in social epidemics.', '978-0-316-31696-8'),
    ('Mistborn: The Final Empire', 2006, 6, 1, 'A street urchin joins a rebellion against an immortal emperor in a world of ash.', '978-0-7653-5038-2'),
    ('The Way of Kings', 2010, 6, 1, 'Epic fantasy following multiple characters in a world of storms and ancient magic.', '978-0-7653-2635-5'),
    ('The Martian', 2011, 7, 2, 'An astronaut struggles to survive after being stranded on Mars.', '978-0-8041-3902-1'),
    ('Project Hail Mary', 2021, 7, 2, 'A lone astronaut must save Earth from an extinction-level threat.', '978-0-5933-9556-2'),
    ('Gone Girl', 2012, 8, 3, 'A man becomes the prime suspect in his wife''s disappearance.', '978-0-3078-8194-3'),
    ('Sharp Objects', 2006, 8, 3, 'A journalist returns to her hometown to cover a series of murders.', '978-0-7679-2799-4'),
    ('Emma', 1815, 4, 4, 'A well-meaning but misguided young woman plays matchmaker.', '978-0-14-143957-0'),
    ('The Caves of Steel', 1954, 2, 2, 'A detective and a robot partner investigate a murder in a future Earth.', '978-0-553-29340-4'),
    ('And Then There Were None', 1939, 3, 3, 'Ten strangers are invited to an island where they are mysteriously murdered one by one.', '978-0-00-712437-0'),
    ('Blink', 2005, 5, 5, 'The power of thinking without thinking and rapid cognition.', '978-0-316-01066-5');

-- ============================================
-- Initialization Complete
-- ============================================
--
-- Database ready with:
-- - 8 authors
-- - 5 genres
-- - 20 books
-- - 2 views (book_details)
-- - 2 RPC functions (get_top_genres, search_books)
-- - Roles: web_anon (read-only), web_user (full CRUD)

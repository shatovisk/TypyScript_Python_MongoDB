import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

// Интерфейс для книги
interface Book {
  id: string;
  title: string;
  description: string;
  cover: string;
}

// Функция для получения списка книг
const fetchBooks = async (page: number) => {
  const response = await fetch(`/api/books?skip=${page * 10}&limit=10`);
  return await response.json();
};

const Home = () => {
  const [page, setPage] = useState(0);

  // Использование useQuery для получения данных книг
  const { data: books = [], isLoading, isError, error } = useQuery<Book[], Error>({
    queryKey: ['books', page], 
    queryFn: () => fetchBooks(page), 
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Book List</h1>
      <div className="grid grid-cols-3 gap-4">
        {books.map((book: Book) => (
          <div key={book.id} className="p-4 border rounded">
            <img src={book.cover} alt={book.title} className="w-full h-64 object-cover mb-4" />
            <h2 className="text-lg font-bold">{book.title}</h2>
            <p>{book.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between">
        <button onClick={() => setPage(Math.max(page - 1, 0))} disabled={page === 0}>
          Previous
        </button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default Home;
import { create } from "zustand";
import type { Book } from "../api";

interface BookState {
  books: Book[];
  allCategories: string[];
  setBooks: (books: Book[]) => void;
  getBookById: (id: number | string) => Book | undefined;
}

const useBookStore = create<BookState>((set, get) => ({
  books: [],
  allCategories: [],
  setBooks: (books) =>
    set({
      books,
      allCategories: [...new Set(books.map((book) => book.category))],
    }),
  getBookById: (id) => {
    const bookId = Number(id);
    return get().books.find((book) => book.id === bookId);
  },
}));

export default useBookStore;

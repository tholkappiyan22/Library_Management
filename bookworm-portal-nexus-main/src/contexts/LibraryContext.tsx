
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockBooks, type Book } from '@/data/mockBooks';
import { useAuth } from '@/components/AuthContext';

interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string;
  borrowDate: string;
  dueDate: string;
  status: 'active' | 'overdue';
  renewals: number;
}

interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string;
  reservationDate: string;
  position: number;
  estimatedAvailableDate: string;
}

interface LibraryContextType {
  books: Book[];
  userLoans: Loan[];
  userReservations: Reservation[];
  borrowBook: (bookId: string) => boolean;
  reserveBook: (bookId: string) => boolean;
  returnBook: (loanId: string) => boolean;
  renewBook: (loanId: string) => boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedBooks = localStorage.getItem('library-books');
    const storedLoans = localStorage.getItem('library-loans');
    const storedReservations = localStorage.getItem('library-reservations');

    if (storedBooks) {
      setBooks(JSON.parse(storedBooks));
    }
    if (storedLoans) {
      setLoans(JSON.parse(storedLoans));
    }
    if (storedReservations) {
      setReservations(JSON.parse(storedReservations));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('library-books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('library-loans', JSON.stringify(loans));
  }, [loans]);

  useEffect(() => {
    localStorage.setItem('library-reservations', JSON.stringify(reservations));
  }, [reservations]);

  const borrowBook = (bookId: string) => {
    if (!user) return false;
    
    const book = books.find(b => b.id === bookId);
    if (!book || book.availableCopies <= 0) return false;

    // Create new loan
    const newLoan: Loan = {
      id: Date.now().toString(),
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      userId: user.id,
      borrowDate: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      renewals: 0
    };

    // Update book availability
    const updatedBooks = books.map(b => 
      b.id === bookId 
        ? { 
            ...b, 
            availableCopies: b.availableCopies - 1,
            availability: b.availableCopies - 1 === 0 ? 'checked-out' as const : b.availability
          }
        : b
    );

    setBooks(updatedBooks);
    setLoans([...loans, newLoan]);
    return true;
  };

  const reserveBook = (bookId: string) => {
    if (!user) return false;
    
    const book = books.find(b => b.id === bookId);
    if (!book) return false;

    // Check if user already has a reservation for this book
    const existingReservation = reservations.find(r => r.bookId === bookId && r.userId === user.id);
    if (existingReservation) return false;

    const newReservation: Reservation = {
      id: Date.now().toString(),
      bookId,
      bookTitle: book.title,
      bookAuthor: book.author,
      userId: user.id,
      reservationDate: new Date().toISOString(),
      position: reservations.filter(r => r.bookId === bookId).length + 1,
      estimatedAvailableDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };

    setReservations([...reservations, newReservation]);
    return true;
  };

  const returnBook = (loanId: string) => {
    const loan = loans.find(l => l.id === loanId);
    if (!loan) return false;

    // Update book availability
    const updatedBooks = books.map(b => 
      b.id === loan.bookId 
        ? { 
            ...b, 
            availableCopies: b.availableCopies + 1,
            availability: 'available' as const
          }
        : b
    );

    // Remove loan
    const updatedLoans = loans.filter(l => l.id !== loanId);

    setBooks(updatedBooks);
    setLoans(updatedLoans);
    return true;
  };

  const renewBook = (loanId: string) => {
    const updatedLoans = loans.map(loan => 
      loan.id === loanId 
        ? { 
            ...loan, 
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            renewals: loan.renewals + 1
          }
        : loan
    );

    setLoans(updatedLoans);
    return true;
  };

  // Get user-specific data
  const userLoans = user ? loans.filter(loan => loan.userId === user.id) : [];
  const userReservations = user ? reservations.filter(res => res.userId === user.id) : [];

  return (
    <LibraryContext.Provider value={{
      books,
      userLoans,
      userReservations,
      borrowBook,
      reserveBook,
      returnBook,
      renewBook
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
};

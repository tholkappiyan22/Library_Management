import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/firebase'; // Import Firestore instance
import { collection, query, onSnapshot, addDoc, doc, deleteDoc, updateDoc, getDocs, where, writeBatch } from "firebase/firestore";
import { useAuth } from '@/components/AuthContext';
import { type Book } from '@/data/mockBooks'; // We'll still use the Book type definition

// Define types for Firestore documents
export interface Loan {
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

export interface Reservation {
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
  addBook: (bookData: Omit<Book, 'id'|'availability'|'availableCopies'>) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  borrowBook: (book: Book) => Promise<boolean>;
  reserveBook: (book: Book) => Promise<boolean>;
  returnBook: (loanId: string) => Promise<boolean>;
  renewBook: (loanId: string) => Promise<boolean>;
  isLoading: boolean;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to fetch all library data in real-time from Firestore
  useEffect(() => {
    setIsLoading(true);
    
    // Listener for books collection
    const booksQuery = query(collection(db, "books"));
    const unsubscribeBooks = onSnapshot(booksQuery, (querySnapshot) => {
      const booksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Book));
      setBooks(booksData);
      setIsLoading(false);
    });

    // Listener for loans collection
    const loansQuery = query(collection(db, "loans"));
    const unsubscribeLoans = onSnapshot(loansQuery, (querySnapshot) => {
        const loansData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Loan));
        setLoans(loansData);
    });

    // Listener for reservations collection
    const reservationsQuery = query(collection(db, "reservations"));
    const unsubscribeReservations = onSnapshot(reservationsQuery, (querySnapshot) => {
        const reservationsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Reservation));
        setReservations(reservationsData);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeBooks();
      unsubscribeLoans();
      unsubscribeReservations();
    };
  }, []);

  // Function to add a new book to the Firestore database
  const addBook = async (bookData: Omit<Book, 'id'|'availability'|'availableCopies'>) => {
    const newBookData = {
      ...bookData,
      availability: 'available',
      availableCopies: bookData.totalCopies,
    };
    await addDoc(collection(db, "books"), newBookData);
  };

  const deleteBook = async (bookId: string) => {
    await deleteDoc(doc(db, "books", bookId));
  };
  
  const borrowBook = async (book: Book): Promise<boolean> => {
    if (!user || book.availableCopies <= 0) return false;

    const bookRef = doc(db, "books", book.id);
    const newLoanRef = doc(collection(db, "loans")); // Create a new doc reference for the loan
    
    const batch = writeBatch(db);

    // Update book availability
    batch.update(bookRef, {
        availableCopies: book.availableCopies - 1,
        availability: book.availableCopies - 1 === 0 ? 'checked-out' : 'available'
    });

    // Create new loan document
    const newLoan: Omit<Loan, 'id'> = {
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        userId: user.uid,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        renewals: 0
    };
    batch.set(newLoanRef, newLoan);

    await batch.commit();
    return true;
  };

  const reserveBook = async (book: Book): Promise<boolean> => {
    if (!user) return false;

    // Check if user already has a reservation
    const q = query(collection(db, "reservations"), where("bookId", "==", book.id), where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return false; // User already has a reservation
    }

    const newReservation: Omit<Reservation, 'id'|'position'|'estimatedAvailableDate'> = {
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        userId: user.uid,
        reservationDate: new Date().toISOString(),
    };
    
    await addDoc(collection(db, "reservations"), newReservation);
    
    // Update book status if it's the first reservation
    if (book.availability === 'available' && book.availableCopies === 0) {
        await updateDoc(doc(db, "books", book.id), { availability: 'reserved' });
    }

    return true;
  };

  const returnBook = async (loanId: string): Promise<boolean> => {
    const loanDoc = doc(db, "loans", loanId);
    const loanData = loans.find(l => l.id === loanId);
    if (!loanData) return false;

    const bookRef = doc(db, "books", loanData.bookId);
    const bookData = books.find(b => b.id === loanData.bookId);
    if (!bookData) return false;
    
    const batch = writeBatch(db);
    batch.update(bookRef, {
        availableCopies: bookData.availableCopies + 1,
        availability: 'available'
    });
    batch.delete(loanDoc);
    await batch.commit();
    return true;
  };

  const renewBook = async (loanId: string): Promise<boolean> => {
    const loanRef = doc(db, "loans", loanId);
    const loanData = loans.find(l => l.id === loanId);
    if (!loanData || loanData.renewals >= 2) return false; // Example: Max 2 renewals

    await updateDoc(loanRef, {
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        renewals: loanData.renewals + 1
    });
    return true;
  };


  const userLoans = user ? loans.filter(loan => loan.userId === user.uid) : [];
  const userReservations = user ? reservations.filter(res => res.userId === user.uid) : [];

  return (
    <LibraryContext.Provider value={{
      books,
      userLoans,
      userReservations,
      addBook,
      deleteBook,
      borrowBook,
      reserveBook,
      returnBook,
      renewBook,
      isLoading
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

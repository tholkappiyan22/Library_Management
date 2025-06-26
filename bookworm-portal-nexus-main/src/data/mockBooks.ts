
export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  category: string;
  availability: 'available' | 'checked-out' | 'reserved';
  totalCopies: number;
  availableCopies: number;
  description: string;
  coverImage: string;
  publishedYear: number;
  language: string;
  pages: number;
}

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    publisher: 'MIT Press',
    category: 'Computer Science',
    availability: 'available',
    totalCopies: 5,
    availableCopies: 3,
    description: 'A comprehensive textbook covering algorithms and data structures.',
    coverImage: '/placeholder.svg',
    publishedYear: 2009,
    language: 'English',
    pages: 1312
  },
  {
    id: '2',
    title: 'Calculus: Early Transcendentals',
    author: 'James Stewart',
    isbn: '978-1285741550',
    publisher: 'Cengage Learning',
    category: 'Mathematics',
    availability: 'available',
    totalCopies: 8,
    availableCopies: 6,
    description: 'Essential calculus textbook for undergraduate mathematics courses.',
    coverImage: '/placeholder.svg',
    publishedYear: 2015,
    language: 'English',
    pages: 1368
  },
  {
    id: '3',
    title: 'Principles of Economics',
    author: 'N. Gregory Mankiw',
    isbn: '978-1305585126',
    publisher: 'Cengage Learning',
    category: 'Economics',
    availability: 'checked-out',
    totalCopies: 4,
    availableCopies: 0,
    description: 'Comprehensive introduction to economic principles and theories.',
    coverImage: '/placeholder.svg',
    publishedYear: 2017,
    language: 'English',
    pages: 888
  },
  {
    id: '4',
    title: 'Organic Chemistry',
    author: 'Paula Yurkanis Bruice',
    isbn: '978-0134042282',
    publisher: 'Pearson',
    category: 'Chemistry',
    availability: 'available',
    totalCopies: 6,
    availableCopies: 4,
    description: 'Comprehensive textbook covering organic chemistry principles.',
    coverImage: '/placeholder.svg',
    publishedYear: 2016,
    language: 'English',
    pages: 1344
  },
  {
    id: '5',
    title: 'World History: Patterns of Interaction',
    author: 'Roger B. Beck',
    isbn: '978-0547491127',
    publisher: 'Houghton Mifflin Harcourt',
    category: 'History',
    availability: 'available',
    totalCopies: 10,
    availableCopies: 8,
    description: 'Comprehensive world history textbook covering major civilizations.',
    coverImage: '/placeholder.svg',
    publishedYear: 2012,
    language: 'English',
    pages: 1152
  },
  {
    id: '6',
    title: 'Campbell Biology',
    author: 'Jane B. Reece',
    isbn: '978-0134093413',
    publisher: 'Pearson',
    category: 'Biology',
    availability: 'reserved',
    totalCopies: 7,
    availableCopies: 1,
    description: 'Leading biology textbook covering all major biological concepts.',
    coverImage: '/placeholder.svg',
    publishedYear: 2016,
    language: 'English',
    pages: 1488
  },
  {
    id: '7',
    title: 'The Art of Public Speaking',
    author: 'Stephen E. Lucas',
    isbn: '978-1259924606',
    publisher: 'McGraw-Hill Education',
    category: 'Communication',
    availability: 'available',
    totalCopies: 5,
    availableCopies: 5,
    description: 'Comprehensive guide to effective public speaking and presentation skills.',
    coverImage: '/placeholder.svg',
    publishedYear: 2019,
    language: 'English',
    pages: 448
  },
  {
    id: '8',
    title: 'Introduction to Psychology',
    author: 'James W. Kalat',
    isbn: '978-1337565691',
    publisher: 'Cengage Learning',
    category: 'Psychology',
    availability: 'available',
    totalCopies: 6,
    availableCopies: 3,
    description: 'Comprehensive introduction to psychological principles and research.',
    coverImage: '/placeholder.svg',
    publishedYear: 2018,
    language: 'English',
    pages: 640
  }
];

export const categories = [
  'All Categories',
  'Computer Science',
  'Mathematics',
  'Economics',
  'Chemistry',
  'History',
  'Biology',
  'Communication',
  'Psychology',
  'Literature',
  'Engineering',
  'Business'
];

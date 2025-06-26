import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Book, User, Calendar } from 'lucide-react';
import { categories, type Book as BookType } from '@/data/mockBooks';
import { useAuth } from '@/components/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { useToast } from '@/hooks/use-toast';

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const { user } = useAuth();
  const { books, borrowBook, reserveBook } = useLibrary();
  const { toast } = useToast();

  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.isbn.includes(searchTerm);
      
      const matchesCategory = selectedCategory === 'All Categories' || book.category === selectedCategory;
      
      const matchesAvailability = availabilityFilter === 'all' || 
                                 (availabilityFilter === 'available' && book.availability === 'available') ||
                                 (availabilityFilter === 'unavailable' && book.availability !== 'available');
      
      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [books, searchTerm, selectedCategory, availabilityFilter]);

  const handleBorrow = (book: BookType) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to borrow books.",
        variant: "destructive",
      });
      return;
    }

    const success = borrowBook(book.id);
    if (success) {
      toast({
        title: "Book Borrowed Successfully",
        description: `You have borrowed "${book.title}". Due date: ${new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      });
    } else {
      toast({
        title: "Unable to Borrow",
        description: "This book is currently unavailable for borrowing.",
        variant: "destructive",
      });
    }
  };

  const handleReserve = (book: BookType) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to reserve books.",
        variant: "destructive",
      });
      return;
    }

    const success = reserveBook(book.id);
    if (success) {
      toast({
        title: "Book Reserved Successfully",
        description: `You have reserved "${book.title}". You will be notified when it becomes available.`,
      });
    } else {
      toast({
        title: "Unable to Reserve",
        description: "You may already have a reservation for this book.",
        variant: "destructive",
      });
    }
  };

  const getAvailabilityBadge = (book: BookType) => {
    switch (book.availability) {
      case 'available':
        return <Badge className="bg-green-100 text-green-800">Available</Badge>;
      case 'checked-out':
        return <Badge className="bg-red-100 text-red-800">Checked Out</Badge>;
      case 'reserved':
        return <Badge className="bg-yellow-100 text-yellow-800">Reserved</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Library Catalog</h1>
          <p className="text-gray-600">Explore our collection of books and resources</p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by title, author, or ISBN..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Books</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
          </p>
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <User className="h-4 w-4 mr-1" />
                      {book.author}
                    </CardDescription>
                  </div>
                  {getAvailabilityBadge(book)}
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>ISBN:</strong> {book.isbn}</p>
                  <p><strong>Publisher:</strong> {book.publisher}</p>
                  <p><strong>Category:</strong> {book.category}</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{book.publishedYear}</span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {book.description}
                </p>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm">
                    <p className="text-gray-600">
                      Copies: {book.availableCopies}/{book.totalCopies}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {book.pages} pages
                  </div>
                </div>

                <div className="flex gap-2">
                  {book.availability === 'available' ? (
                    <Button 
                      onClick={() => handleBorrow(book)} 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Book className="mr-2 h-4 w-4" />
                      Borrow
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleReserve(book)} 
                      variant="outline" 
                      className="flex-1"
                    >
                      Reserve
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;

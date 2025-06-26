
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Book } from 'lucide-react';
import { mockBooks, categories, type Book as BookType } from '@/data/mockBooks';
import { useToast } from '@/hooks/use-toast';

const ManageBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    category: '',
    totalCopies: 1,
    publishedYear: new Date().getFullYear(),
    pages: 0,
    description: ''
  });

  const filteredBooks = mockBooks.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    
    const matchesCategory = selectedCategory === 'All Categories' || book.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddBook = () => {
    toast({
      title: "Book Added Successfully",
      description: `"${newBook.title}" has been added to the catalog.`,
    });
    setIsAddDialogOpen(false);
    setNewBook({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      category: '',
      totalCopies: 1,
      publishedYear: new Date().getFullYear(),
      pages: 0,
      description: ''
    });
  };

  const handleDeleteBook = (book: BookType) => {
    toast({
      title: "Book Deleted",
      description: `"${book.title}" has been removed from the catalog.`,
      variant: "destructive",
    });
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
            <p className="text-gray-600 mt-2">Add, edit, and manage the library catalog</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Add New Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Enter the details for the new book you want to add to the catalog.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newBook.title}
                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                    placeholder="Enter book title"
                  />
                </div>
                <div>
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={newBook.author}
                    onChange={(e) => setNewBook({...newBook, author: e.target.value})}
                    placeholder="Enter author name"
                  />
                </div>
                <div>
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input
                    id="isbn"
                    value={newBook.isbn}
                    onChange={(e) => setNewBook({...newBook, isbn: e.target.value})}
                    placeholder="Enter ISBN"
                  />
                </div>
                <div>
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={newBook.publisher}
                    onChange={(e) => setNewBook({...newBook, publisher: e.target.value})}
                    placeholder="Enter publisher"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newBook.category} onValueChange={(value) => setNewBook({...newBook, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'All Categories').map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="copies">Total Copies</Label>
                  <Input
                    id="copies"
                    type="number"
                    value={newBook.totalCopies}
                    onChange={(e) => setNewBook({...newBook, totalCopies: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="year">Published Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newBook.publishedYear}
                    onChange={(e) => setNewBook({...newBook, publishedYear: parseInt(e.target.value) || new Date().getFullYear()})}
                  />
                </div>
                <div>
                  <Label htmlFor="pages">Pages</Label>
                  <Input
                    id="pages"
                    type="number"
                    value={newBook.pages}
                    onChange={(e) => setNewBook({...newBook, pages: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newBook.description}
                    onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                    placeholder="Enter book description"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddBook}>Add Book</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search books..."
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
            </div>
          </CardContent>
        </Card>

        {/* Books Table */}
        <Card>
          <CardHeader>
            <CardTitle>Books Catalog ({filteredBooks.length} items)</CardTitle>
            <CardDescription>Manage your library's book collection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBooks.map((book) => (
                <div key={book.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{book.title}</h3>
                        {getAvailabilityBadge(book)}
                      </div>
                      <p className="text-gray-600 mb-1">by {book.author}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ISBN:</span> {book.isbn}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {book.category}
                        </div>
                        <div>
                          <span className="font-medium">Copies:</span> {book.availableCopies}/{book.totalCopies}
                        </div>
                        <div>
                          <span className="font-medium">Year:</span> {book.publishedYear}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDeleteBook(book)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManageBooks;

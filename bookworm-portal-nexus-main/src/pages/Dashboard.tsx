import React from 'react';
import { useAuth } from '@/components/AuthContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Clock, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { userLoans, userReservations, renewBook } = useLibrary();
  const { toast } = useToast();

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'faculty':
        return 'Faculty Dashboard';
      case 'student':
        return 'Student Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const handleRenew = (loanId: string, bookTitle: string) => {
    const success = renewBook(loanId);
    if (success) {
      toast({
        title: "Book Renewed",
        description: `"${bookTitle}" has been renewed for another 14 days.`,
      });
    } else {
      toast({
        title: "Unable to Renew",
        description: "This book cannot be renewed at this time.",
        variant: "destructive",
      });
    }
  };

  const overdueLoans = userLoans.filter(loan => getDaysUntilDue(loan.dueDate) < 0);
  const dueSoonLoans = userLoans.filter(loan => {
    const days = getDaysUntilDue(loan.dueDate);
    return days <= 3 && days >= 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{getDashboardTitle()}</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name}</p>
          {userLoans.length === 0 && userReservations.length === 0 && (
            <p className="text-blue-600 mt-1 text-sm">
              Welcome to the library! Start by browsing our catalog to find books to borrow.
            </p>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Book className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Books Borrowed</p>
                  <p className="text-2xl font-bold text-gray-900">{userLoans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Due Soon</p>
                  <p className="text-2xl font-bold text-gray-900">{dueSoonLoans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">{userReservations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900">{overdueLoans.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Loans */}
          <Card>
            <CardHeader>
              <CardTitle>Current Loans</CardTitle>
              <CardDescription>Books you currently have checked out</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userLoans.length > 0 ? (
                  userLoans.map((loan) => {
                    const daysUntilDue = getDaysUntilDue(loan.dueDate);
                    const isOverdue = daysUntilDue < 0;
                    const isDueSoon = daysUntilDue <= 3 && daysUntilDue >= 0;
                    
                    return (
                      <div key={loan.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{loan.bookTitle}</h4>
                            <p className="text-sm text-gray-600">{loan.bookAuthor}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="text-sm text-gray-600">
                                Due: {new Date(loan.dueDate).toLocaleDateString()}
                              </span>
                              {isOverdue && (
                                <span className="text-red-600 text-sm font-medium">
                                  Overdue ({Math.abs(daysUntilDue)} days)
                                </span>
                              )}
                              {isDueSoon && !isOverdue && (
                                <span className="text-yellow-600 text-sm font-medium">
                                  Due in {daysUntilDue} day{daysUntilDue !== 1 ? 's' : ''}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Renewals: {loan.renewals}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleRenew(loan.id, loan.bookTitle)}
                          >
                            Renew
                          </Button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8">
                    <Book className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No current loans</p>
                    <p className="text-sm text-gray-400 mt-1">Browse our catalog to find books to borrow</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reservations */}
          <Card>
            <CardHeader>
              <CardTitle>Reservations</CardTitle>
              <CardDescription>Books you have reserved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userReservations.length > 0 ? (
                  userReservations.map((reservation) => (
                    <div key={reservation.id} className="border rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900">{reservation.bookTitle}</h4>
                      <p className="text-sm text-gray-600">{reservation.bookAuthor}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Position in queue: #{reservation.position}</p>
                        <p>Estimated availability: {new Date(reservation.estimatedAvailableDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No current reservations</p>
                    <p className="text-sm text-gray-400 mt-1">Reserve books that are currently unavailable</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity - keeping as placeholder for now */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent library transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Activity tracking coming soon</p>
                <p className="text-sm text-gray-400 mt-1">Your library transactions will appear here</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common library tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/catalog">
                  <Button className="w-full justify-start" variant="outline">
                    <Book className="mr-2 h-4 w-4" />
                    Browse Catalog
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button className="w-full justify-start" variant="outline">
                    <User className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="mr-2 h-4 w-4" />
                  Loan History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

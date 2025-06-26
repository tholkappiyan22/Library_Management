import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Book, User, LogOut, Home, Search, Users } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    
    if (user.role.includes('admin')) return '/admin';
    if (user.role.includes('librarian')) return '/librarian';
    if (user.role.includes('faculty')) return '/dashboard';
    if (user.role.includes('student')) return '/dashboard';
    
    return '/';
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Book className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">College Library</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/catalog" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Search className="h-4 w-4" />
                  <span>Catalog</span>
                </Link>
                
                <Link to={getDashboardLink()} className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                {(user.role.includes('librarian') || user.role.includes('admin')) && (
                  <Link to="/manage" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                    <Users className="h-4 w-4" />
                    <span>Manage</span>
                  </Link>
                )}

                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </Link>

                <Button onClick={handleLogout} variant="outline" size="sm" className="flex items-center space-x-1">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/catalog" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Browse Catalog
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

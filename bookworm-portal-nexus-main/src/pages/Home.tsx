
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Search, Users, Clock, Award, Globe } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: Book,
      title: 'Extensive Collection',
      description: 'Access to thousands of books, journals, and digital resources across all academic disciplines.'
    },
    {
      icon: Search,
      title: 'Advanced Search',
      description: 'Find exactly what you need with our powerful search filters and categorization system.'
    },
    {
      icon: Clock,
      title: '24/7 Digital Access',
      description: 'Browse our digital collection and manage your account anytime, anywhere.'
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Connect with fellow students and faculty through our collaborative learning platform.'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Books Available' },
    { number: '2,500+', label: 'Active Members' },
    { number: '100+', label: 'Daily Checkouts' },
    { number: '95%', label: 'User Satisfaction' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Welcome to Our
              <span className="text-blue-600 block">Digital Library</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover a world of knowledge with our comprehensive collection of books, 
              digital resources, and research materials. Your gateway to academic excellence.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {user ? (
              <Link to="/catalog">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Catalog
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/catalog">
                  <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-blue-600 text-blue-600 hover:bg-blue-50">
                    Browse Catalog
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Library?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience modern library services designed for the digital age
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 bg-blue-600 rounded-full w-fit">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and faculty who rely on our library for their academic success.
          </p>
          {!user && (
            <Link to="/login">
              <Button size="lg" variant="secondary" className="px-8 py-3 text-lg">
                Create Account Today
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

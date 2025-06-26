import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, Building, IdCard, Edit } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    studentId: user?.studentId || ''
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const renderRoleBadges = (roles: string[]) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      faculty: 'bg-green-100 text-green-800',
      librarian: 'bg-purple-100 text-purple-800',
      admin: 'bg-red-100 text-red-800'
    };
    return roles.map(role => (
      <Badge key={role} className={colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    ));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Your account details and contact information</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center mt-2">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center mt-2">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{user.email}</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center mt-2">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{user.phone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    {isEditing ? (
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center mt-2">
                        <Building className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{user.department || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {user.studentId && (
                    <div>
                      <Label htmlFor="studentId">Student ID</Label>
                      <div className="flex items-center mt-2">
                        <IdCard className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{user.studentId}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Role</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {renderRoleBadges(user.role)}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Library Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Books Borrowed</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Currently Active</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reservations</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fines</span>
                    <span className="font-semibold">$0.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Your account is in good standing with no restrictions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

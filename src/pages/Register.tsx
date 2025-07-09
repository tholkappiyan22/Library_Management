@@ .. @@
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.role) {
      toast({
        title: "Role Required",
        description: "Please select your role.",
        variant: "destructive",
      });
      return;
    }

-    const success = await register({
-      name: formData.name,
-      email: formData.email,
-      password: formData.password,
-      role: formData.role as 'student' | 'faculty' | 'librarian' | 'admin',
-      studentId: formData.studentId || undefined,
-      department: formData.department || undefined,
-      phone: formData.phone || undefined
-    });
-    
-    if (success) {
-      toast({
-        title: "Registration Successful",
-        description: "Your account has been created successfully!",
-      });
-      navigate('/dashboard');
-    } else {
-      toast({
-        title: "Registration Failed",
-        description: "An account with this email already exists.",
-        variant: "destructive",
-      });
-    }
+    try {
+      const success = await register({
+        name: formData.name,
+        email: formData.email,
+        password: formData.password,
+        role: formData.role as 'student' | 'faculty' | 'librarian' | 'admin',
+        studentId: formData.studentId || undefined,
+        department: formData.department || undefined,
+        phone: formData.phone || undefined
+      });
+      
+      if (success) {
+        toast({
+          title: "Registration Successful",
+          description: "Your account has been created successfully!",
+        });
+        navigate('/dashboard');
+      }
+    } catch (error: any) {
+      toast({
+        title: "Registration Failed",
+        description: error.message || "Registration failed. Please try again.",
+        variant: "destructive",
+      });
+    }
  };
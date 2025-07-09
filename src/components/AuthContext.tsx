@@ .. @@
   const login = async (email: string, password: string): Promise<boolean> => {
-    setIsLoading(true);
     try {
+      setIsLoading(true);
       await signInWithEmailAndPassword(auth, email, password);
-      setIsLoading(false);
       return true;
     } catch (error) {
       console.error("Error signing in:", error);
-      setIsLoading(false);
       return false;
+    } finally {
+      setIsLoading(false);
     }
   };

   const register = async (data: RegisterData): Promise<boolean> => {
-    setIsLoading(true);
     try {
+      setIsLoading(true);
       const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
       const newUser = userCredential.user;

@@ .. @@
       await setDoc(doc(db, "users", newUser.uid), userProfile);
       
-      setIsLoading(false);
       return true;
     } catch (error) {
       console.error("Error registering:", error);
-      setIsLoading(false);
       return false;
+    } finally {
+      setIsLoading(false);
     }
   };
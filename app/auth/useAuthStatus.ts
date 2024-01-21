// useAuthStatus.ts
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

const useAuthStatus = () => {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace('/dashboard');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return { isLoading };
};

export default useAuthStatus;
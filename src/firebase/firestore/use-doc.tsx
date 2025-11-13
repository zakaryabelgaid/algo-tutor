'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, DocumentReference, DocumentData } from 'firebase/firestore';

interface UseDocReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useDoc<T>(ref: DocumentReference | null): UseDocReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!ref) {
        setLoading(false);
        setData(null);
        return;
    }
    setLoading(true);

    const unsubscribe = onSnapshot(ref, 
      (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      }, 
      (err) => {
        console.error("Error fetching document:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [ref?.path]);

  return { data, loading, error };
}

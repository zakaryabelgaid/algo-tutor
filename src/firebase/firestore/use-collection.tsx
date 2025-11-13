'use client';

import { useState, useEffect } from 'react';
import { onSnapshot, Query, DocumentData, CollectionReference } from 'firebase/firestore';

interface UseCollectionReturn<T> {
  data: T[] | null;
  loading: boolean;
  error: Error | null;
}

export function useCollection<T>(query: Query | CollectionReference | null): UseCollectionReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setData([]);
      return;
    }
    
    if (typeof query !== 'object' || query === null || !('onSnapshot' in query)) {
      setLoading(false);
      setData([]);
      setError(new Error("Invalid query passed to useCollection hook."));
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(documents);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching collection:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [JSON.stringify(query)]); // Simple but potentially inefficient for complex queries

  return { data, loading, error };
}

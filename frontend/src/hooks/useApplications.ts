import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { getApplications } from '@/store/slices/app/applicationSlice';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useApplications = (companyId?: string, autoFetch: boolean = true) => {
  const dispatch = useAppDispatch();
  const { applications, loading, error, lastFetched } = useAppSelector((state) => state.app.application);

  const shouldFetchApplications = useCallback(() => {
    if (!lastFetched) return true;
    
    const timeSinceLastFetch = Date.now() - new Date(lastFetched).getTime();
    return timeSinceLastFetch > CACHE_DURATION;
  }, [lastFetched]);

  const fetchApplications = useCallback(async (force: boolean = false) => {
    if (!companyId) return;
    
    if (force || shouldFetchApplications()) {
      return dispatch(getApplications({ companyId })).unwrap();
    }
  }, [companyId, dispatch, shouldFetchApplications]);

  useEffect(() => {
    if (autoFetch) {
      fetchApplications();
    }
  }, [autoFetch, fetchApplications]);

  return {
    applications,
    loading,
    error,
    lastFetched,
    fetchApplications,
    isStale: shouldFetchApplications()
  };
}; 
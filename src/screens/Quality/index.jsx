import { View, Text } from 'react-native';
import React, { useState } from 'react';
import SidebarLayout from '../../layout/SidebarLayout';
import useQuality from '../../services/useQuality';
import { useQuery } from '@tanstack/react-query';

const Quality = () => {
  const { getAllQualityIssues } = useQuality();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['pendingProductions', page, search],
    queryFn: () => getAllQualityIssues(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <SidebarLayout>
      <Text>Quality</Text>
    </SidebarLayout>
  );
};

export default Quality;

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../../components/common/Button';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';
import useQuality from '../../services/useQuality';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../reducer/authSlice';
import SidebarLayout from '../../layout/SidebarLayout';
import Heading from '../../components/common/Heading';

const TicketDetails = () => {
  const { tw } = useTheme();
  const navigation = useNavigation();
  const { params } = useRoute();
  const ticketId = params?.id;
  const user = useSelector(selectAuth);
  console.log(user.route.role);
  const { getSpecificQualityIssue, approveQualityIssue, deleteQualityIssue } =
    useQuality();

  const {
    data: issue,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['quality-issue', ticketId],
    queryFn: () => getSpecificQualityIssue(ticketId),
    enabled: !!ticketId,
  });

  const queryClient = useQueryClient();

  const handleApprove = async () => {
    if (!issue || issue.action_taken) return;

    try {
      await approveQualityIssue(ticketId);
      queryClient.invalidateQueries(['quality-issue', ticketId]);
      queryClient.invalidateQueries(['quality-issues']);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to approve quality issue:', error);
    } finally {
    }
  };

  const handleDelete = async () => {
    if (!issue) return;

    try {
      await deleteQualityIssue(ticketId);
      queryClient.invalidateQueries(['quality-issue', ticketId]);
      queryClient.invalidateQueries(['quality-issues']);
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete quality issue:', error);
    } finally {
    }
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isError || !issue) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <Text style={tw`text-red-500`}>Failed to load ticket details</Text>
      </View>
    );
  }

  const vendorName = issue?.created_by?.split('(')[0]?.trim() ?? '—';
  const finishedGood = issue?.finished_good?.[0];
  const model = finishedGood?.model ?? '—';
  const type = finishedGood?.type ?? '—';
  const ratio = finishedGood?.ratio ?? '—';
  const power = finishedGood?.power ?? '—';
  const issueType = issue?.issue_type ?? '—';
  const description = issue?.issue ?? '—';
  const createdAt = new Date(issue?.created_at).toLocaleDateString();

  return (
    <SidebarLayout>
      <ScrollView contentContainerStyle={tw`flex-1 p-5 bg-white`}>
        {/* Section Title */}
        <Heading>
          Quality Ticket Details
        </Heading>

        {/* Ticket Card */}
        <View
          style={tw`bg-white p-4 rounded-xl border border-gray-200 shadow-sm`}
        >
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            Reporter - {vendorName}
          </Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>Model - {model}</Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>Type - {type}</Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>Ratio - {ratio}</Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>Power - {power}</Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>Date - {createdAt}</Text>
          <Text style={tw`text-sm text-gray-700 mb-1`}>
            Issue In - {issueType}
          </Text>

          <Text style={tw`text-sm font-medium text-gray-800 mt-3`}>
            Description :
          </Text>
          <Text style={tw`text-sm text-gray-600 mt-1 leading-5`}>
            {description}
          </Text>

          {/* Action Buttons */}
          <View style={tw`flex-row justify-between mt-5`}>
            {user.route.role === 'ADMIN' && (
              <View>
                <TouchableOpacity
                  onPress={handleApprove}
                  style={tw`flex-row items-center bg-blue-600 px-4 py-2 rounded-md`}
                >
                  <Ionicons
                    name="checkmark-done-sharp"
                    size={16}
                    color="white"
                  />
                  <Text style={tw`text-white font-medium text-sm ml-2`}>
                    Action Taken
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={tw`flex-row items-center bg-blue-600 px-4 py-2 rounded-md`}
                  onPress={handleDelete}
                >
                  <Ionicons name="trash-outline" size={16} color="white" />
                  <Text style={tw`text-white font-medium text-sm ml-2`}>
                    Delete Ticket
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SidebarLayout>
  );
};

export default TicketDetails;

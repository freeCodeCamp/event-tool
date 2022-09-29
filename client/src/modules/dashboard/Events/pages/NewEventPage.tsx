import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import {
  useCreateEventMutation,
  useSendEventInviteMutation,
} from '../../../../generated/graphql';
import { isOnline, isPhysical } from '../../../../util/venueType';
import { DashboardLoading } from '../../shared/components/DashboardLoading';
import { Layout } from '../../shared/components/Layout';
import EventForm from '../components/EventForm';
import { EventFormData } from '../components/EventFormUtils';
import { CHAPTER } from '../../../chapters/graphql/queries';
import { EVENTS } from '../graphql/queries';
import { HOME_PAGE_QUERY } from '../../../home/graphql/queries';
import { useParam } from '../../../../hooks/useParam';

export const NewEventPage: NextPage = () => {
  const { param: chapterId, isReady } = useParam('id');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const [createEvent] = useCreateEventMutation();

  const [publish] = useSendEventInviteMutation();

  const onSubmit = async (data: EventFormData) => {
    setLoading(true);

    try {
      const { chapter_id, sponsors, ...rest } = data;
      const sponsorArray = sponsors.map((s) => parseInt(String(s.id)));

      const eventData = {
        ...rest,
        capacity: parseInt(String(data.capacity)),
        start_at: data.start_at,
        ends_at: data.ends_at,
        venue_id: isPhysical(data.venue_type)
          ? parseInt(String(data.venue_id))
          : null,
        streaming_url: isOnline(data.venue_type) ? data.streaming_url : null,
        sponsor_ids: sponsorArray,
      };
      const event = await createEvent({
        variables: { chapterId: chapter_id, data: { ...eventData } },
        refetchQueries: [
          { query: CHAPTER, variables: { chapterId: chapter_id } },
          { query: EVENTS },
          { query: HOME_PAGE_QUERY, variables: { offset: 0, limit: 2 } },
        ],
      });

      if (event.data) {
        publish({ variables: { eventId: event.data.createEvent.id } });
        router.replace(
          `/dashboard/events/[id]`,
          `/dashboard/events/${event.data.createEvent.id}`,
        );
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  if (!isReady) return <DashboardLoading loading={isReady} />;

  return (
    <Layout>
      {isReady && (
        <EventForm
          loading={loading}
          onSubmit={onSubmit}
          submitText={'Add event'}
          loadingText={'Adding Event'}
          chapterId={chapterId}
        />
      )}
    </Layout>
  );
};

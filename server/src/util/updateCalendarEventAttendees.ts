import { inspect } from 'util';

import { prisma } from '../prisma';
import { patchCalendarEvent } from '../services/Google';
import { redactSecrets } from './redact-secrets';

export const updateCalendarEventAttendees = async ({
  eventId,
  calendarId,
  calendarEventId,
}: {
  eventId: number;
  calendarId: string | null;
  calendarEventId: string | null;
}) => {
  const attendees = await prisma.event_users.findMany({
    where: {
      event_id: eventId,
      rsvp: { name: 'yes' },
    },
    select: { user: { select: { email: true } } },
  });

  if (calendarId && calendarEventId) {
    try {
      // Patch is necessary here, since an update with unchanged start and end
      // will remove attendees' yes/no/maybe response without notifying them.
      await patchCalendarEvent({
        calendarId,
        calendarEventId,
        attendeeEmails: attendees.map(({ user }) => user.email),
      });
    } catch (e) {
      console.log('Unable to update calendar event attendees');
      console.error(inspect(redactSecrets(e), { depth: null }));
    }
  }
};

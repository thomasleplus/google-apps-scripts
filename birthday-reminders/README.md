# Birthday Reminders

Receive an email notification for each birthday in your 'Birthdays' calendar. This script requires you to use Gmail and Google Calendar. If you are also using Google Contacts, you can [create a birthdays' calendar automatically](https://support.google.com/calendar/answer/6084659) from your contacts.

I run this daily using a [standalone script](https://developers.google.com/apps-script/guides/standalone) with [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers).

The script has two optional script properties:
- calendar: the name of the Google Calendar to monitor (default is 'Birthdays').
- offset: the numbers of days before an event that you want to receive the email (default is 0).

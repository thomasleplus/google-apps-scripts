# Birthday Reminders

Receive an email notification for each birthday in your 'Birthdays' calendar. This script requires you to use Gmail and Google Calendar. If you are also using Google Contacts, you can [create a birthdays' calendar automatically](https://support.google.com/calendar/answer/6084659) from your contacts.

I run this daily using a [standalone script](https://developers.google.com/apps-script/guides/standalone) with [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers).

The script has two optional [script properties](https://developers.google.com/apps-script/guides/properties#manage_script_properties_manually):
- calendar: the name of the Google Calendar to monitor (default is 'Birthdays').
- offset: the numbers of days before an event that you want to receive the email (default is 0).
- prefix: if set the string contained in this property will be added at the beginning of the email subject. No space or separator is added by the script so if needed, it should be added explicitly at the end of this property's value (e.g., a trailing space).
- suffix: if set the string contained in this property will be added at the end of the email subject. No space or separator is added by the script so if needed, it should be added explicitly at the beginning of this property's value (e.g., a leading space).

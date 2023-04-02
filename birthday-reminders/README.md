# Birthday Reminders

Receive an email notification for each birthday in your 'Birthdays' calendar. This script requires you to use Gmail and Google Calendar. If you are also using Google Contacts, you can [create a birthdays' calendar automatically](https://support.google.com/calendar/answer/6084659) from your contacts.

I run this daily using a [standalone script](https://developers.google.com/apps-script/guides/standalone) with [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers).

The script has two optional [script properties](https://developers.google.com/apps-script/guides/properties#manage_script_properties_manually):
- calendar: the name of the Google Calendar to monitor (default is 'Birthdays').
- offset: the numbers of days before an event that you want to receive the email (default is 0).
- subjectTemplate: template used to generate the email subject, see syntax below (default is ${event.summary}).
- bodyTemplate: template used to generate the email body, see syntax below (default is ${event.description}).

The syntax for the template properties is a string where the following substitutions will be conducted:
- all occurrences of the ${event.foo} where foo is a valid property of the [Google Calendar event object](https://developers.google.com/calendar/api/v3/reference/events) will be replaced with the corresponding value.
- all occurrences of the ${properties.foo} where foo can be any [script property](https://developers.google.com/apps-script/guides/properties#manage_script_properties_manually) will be replaced with the corresponding value.

"use strict";

function sendBirthdayRemindersByEmail() {
    var calendarName = PropertiesService.getScriptProperties().getProperty('calendar');
    if (calendarName == null) {
        calendarName = 'Birthdays';
    }
    CalendarApp.getCalendarsByName(calendarName).forEach(function(calendar) {
        console.log('Checking calendar "' + calendar.getName() + '"');
        var eventDate = new Date();
        var offset = PropertiesService.getScriptProperties().getProperty('offset');
        if (offset != null) {
           console.log('Using offset of ' + offset + ' day(s)');
           eventDate = new Date(eventDate.getTime() + offset * 24 * 60 * 60 * 1000);
        }
        console.log('Searching for date ' + eventDate);
        calendar.getEventsForDay(eventDate).forEach(function(event) {
            var email = Session.getActiveUser().getEmail();
            var title = event.getTitle();
            console.log('Emailing "' + title + '" to ' + email);
            MailApp.sendEmail({
                to: email,
                subject: title,
                htmlBody: event.getDescription()
            });
        });
    });
}

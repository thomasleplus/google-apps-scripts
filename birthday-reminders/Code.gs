function sendBirthdayRemindersByEmail() {
  CalendarApp.getCalendarsByName('Birthdays').forEach(function (calendar) {
    console.log('Checking calendar "' + calendar.getName() + '"');
    var today = new Date();
    calendar.getEventsForDay(today).forEach(function (event) {
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

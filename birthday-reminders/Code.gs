'use strict'

function sendBirthdayRemindersByEmail () {
  let calendarName = PropertiesService.getScriptProperties().getProperty('calendar')
  if (calendarName == null) {
    calendarName = 'Birthdays'
  }
  let prefix = PropertiesService.getScriptProperties().getProperty('prefix')
  if (prefix == null) {
    prefix = ''
  }
  let suffix = PropertiesService.getScriptProperties().getProperty('suffix')
  if (suffix == null) {
    suffix = ''
  }
  CalendarApp.getCalendarsByName(calendarName).forEach(function (calendar) {
    console.log('Checking calendar "' + calendar.getName() + '"')
    let eventDate = new Date()
    const offset = PropertiesService.getScriptProperties().getProperty('offset')
    if (offset != null) {
      console.log('Using offset of ' + offset + ' day(s)')
      eventDate = new Date(eventDate.getTime() + offset * 24 * 60 * 60 * 1000)
    }
    console.log('Searching for date ' + eventDate)
    calendar.getEventsForDay(eventDate).forEach(function (event) {
      const email = Session.getActiveUser().getEmail()
      const subject = prefix + event.getTitle() + suffix
      console.log('Emailing "' + subject + '" to ' + email)
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: event.getDescription()
      })
    })
  })
}

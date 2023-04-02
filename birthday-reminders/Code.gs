'use strict'

function sendBirthdayRemindersByEmail () {
  const properties = PropertiesService.getScriptProperties();
  let calendarName = properties.getProperty('calendar')
  if (calendarName == null) {
    calendarName = 'Birthdays'
  }
  let subjectTemplate = properties.getProperty('emailSubjectTemplate')
  if (subjectTemplate == null) {
    subjectTemplate = '${event.title}'
  }
  let bodyTemplate = properties.getProperty('emailBodyTemplate')
  if (bodyTemplate == null) {
    bodyTemplate = '${event.description}'
  }
  CalendarApp.getCalendarsByName(calendarName).forEach(function (calendar) {
    console.log('Checking calendar "' + calendar.getName() + '"')
    let eventDate = new Date()
    const offset = properties.getProperty('offset')
    if (offset != null) {
      console.log('Using offset of ' + offset + ' day(s)')
      eventDate = new Date(eventDate.getTime() + offset * 24 * 60 * 60 * 1000)
    }
    console.log('Searching for date ' + eventDate)
    calendar.getEventsForDay(eventDate).forEach(function (event) {
      const email = Session.getActiveUser().getEmail()
      const subject = processTemplate(subjectTemplate, event, properties)
      const body = processTemplate(bodyTemplate, event, properties)
      console.log('Emailing "' + subject + '" to ' + email)
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: body
      })
    })
  })
}

function processTemplate(template, event, properties) {
  return template.replace(/\$\{(event|properties)\.(\w+)\}/g, function(match, p1, p2, offset, string, groups) {
    if (p1 == 'event') {
      return event[p2] || string
    } else if (p1 == 'properties') {
      return properties.getProperty(p2) || string
    }
  })
}

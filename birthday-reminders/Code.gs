'use strict'

function sendBirthdayRemindersByEmail () {
  const properties = PropertiesService.getScriptProperties()

  let calendarName = properties.getProperty('calendar')
  if (calendarName == null) {
    calendarName = 'Birthdays'
  }
  console.log('calendarName=' + calendarName)

  let offset = properties.getProperty('offset')
  if (offset == null) {
    offset = 0
  }
  console.log('offset=' + offset)

  const eventDate = new Date(new Date().getTime() + offset * 24 * 60 * 60 * 1000)
  console.log('eventDate=' + eventDate)

  const email = Session.getActiveUser().getEmail()
  console.log('email=' + email)

  let subjectTemplate = properties.getProperty('emailSubjectTemplate')
  if (subjectTemplate == null) {
    subjectTemplate = '${event.getTitle()}'
  }
  console.log('subjectTemplate=' + subjectTemplate)

  let bodyTemplate = properties.getProperty('emailBodyTemplate')
  if (bodyTemplate == null) {
    bodyTemplate = '${event.getDescription()}'
  }
  console.log('bodyTemplate=' + bodyTemplate)
  
  CalendarApp.getCalendarsByName(calendarName).forEach(function (calendar) {
    console.log('Found calendar "' + calendar.getName() + '"')
    calendar.getEventsForDay(eventDate).forEach(function (event) {
      console.log('Found event "' + event.getTitle() + '"')
      const subject = processTemplate(subjectTemplate, event, properties)
      const body = processTemplate(bodyTemplate, event, properties)
      console.log('Emailing "' + subject + '" to ' + email + ' with body "' + body + '"')
      MailApp.sendEmail({
        to: email,
        subject: subject,
        htmlBody: body
      })
    })
  })
}

function processTemplate(template, event, properties) {
  return template.replace(/\$\{(event|properties)\.([^\}]+)\}/g, function(match, p1, p2, offset, string, groups) {
    if (p1 == 'event') {
      console.log('Template matches ${event.' + p2 + '}')
      if (p2.endsWith('()')) {
          console.log('Invoking event.' + p2)
          return event[p2.slice(0, -2)]() || match
      }
      return match
    } else if (p1 == 'properties') {
      console.log('Template matches ${properties.' + p2 + '}')
      return properties.getProperty(p2) || match
    }
    return string
  })
}

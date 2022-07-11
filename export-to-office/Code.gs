'use strict'

function exportToOffice () {
  let folderName = PropertiesService.getScriptProperties().getProperty('folder')
  if (folderName == null) {
    folderName = 'Export'
  }
  const description = '#ExportedToOffice'
  const conversions = [
    ['application/vnd.google-apps.spreadsheet', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xslx'],
    ['application/vnd.google-apps.document', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
    ['application/vnd.google-apps.presentation', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', '.pptx']
  ]
  const folders = DriveApp.getRootFolder().getFoldersByName(folderName)
  if (!folders.hasNext()) {
    throw 'Folder "' + folderName + '" not found'
  }
  const folder = folders.next()
  if (folders.hasNext()) {
    throw 'More than one "' + folderName + '" folder'
  }
  const oldFiles = folder.getFiles()
  while (oldFiles.hasNext()) {
    const oldFile = oldFiles.next()
    if (oldFile.getDescription() === description) {
      console.log('Deleting file "' + oldFile.getName() + '"')
      oldFile.setTrashed(true)
    }
  }
  for(var i = 0; i < conversions.length; i++) {
    const conversion = conversions[i]
    console.log('Searching for "' + conversion[0] + '" files...')
    const files = DriveApp.getFilesByType(conversion[0])
    while (files.hasNext()) {
      const file = files.next()
      if (file.isTrashed()) {
        console.log('Skipping trashed file "' + file.getName() + '"')
        continue
      }
      if (file.getAccess(Session.getActiveUser()) !== DriveApp.Permission.OWNER) {
        console.log('Skipping shared file "' + file.getName() + '"')
        continue
      }
      console.log('Converting "' + file.getName() + '"')
      const blob = getFileAsBlob(file.getId(), conversion[1])
      const newFile = folder.createFile(blob)
      newFile.setName(file.getName() + conversion[2])
      newFile.setDescription(description)
    }
  }
}

function getFileAsBlob (fileId, mimeType) {
  const response = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '/export?mimeType=' + encodeURIComponent(mimeType), {
    headers: {
      Authorization: 'Bearer ' +  ScriptApp.getOAuthToken(),
    },
  })
  return response.getBlob()
}

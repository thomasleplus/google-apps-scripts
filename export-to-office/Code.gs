"use strict";

function exportToOffice() {
  let expiry = PropertiesService.getScriptProperties().getProperty("expiry");
  if (expiry == null) {
    expiry = 30;
  }
  let folderName =
    PropertiesService.getScriptProperties().getProperty("folder");
  if (folderName == null) {
    folderName = "Export";
  }
  const modulo = new Date().getUTCHours();
  const now = new Date();
  const description = "#ExportedToOffice";
  const conversions = [
    [
      "application/vnd.google-apps.document",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".docx",
    ],
    [
      "application/vnd.google-apps.presentation",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      ".pptx",
    ],
    [
      "application/vnd.google-apps.map",
      "application/vnd.google-earth.kmz",
      ".kmz",
    ],
    [
      "application/vnd.google-apps.spreadsheet",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xslx",
    ],
  ];
  const folders = DriveApp.getRootFolder().getFoldersByName(folderName);
  if (!folders.hasNext()) {
    throw 'Folder "' + folderName + '" not found';
  }
  const folder = folders.next();
  if (folders.hasNext()) {
    throw 'More than one "' + folderName + '" folder';
  }
  const oldFiles = folder.getFiles();
  while (oldFiles.hasNext()) {
    const oldFile = oldFiles.next();
    if (
      oldFile.getDescription() !== null &&
      oldFile.getDescription().indexOf(description) > -1
    ) {
      if (oldFile.getDateCreated() - now > expiry) {
        console.log('Deleting orphaned file "' + oldFile.getName() + '"');
        oldFile.setTrashed(true);
        /*
      To support a large number of files, this script is to be run once an hour and on each run it
      it will export approximatly 1/24th of the files.
      */
      } else if (oldFile.getName().charCodeAt(0) % 24 === modulo) {
        console.log('Deleting file "' + oldFile.getName() + '"');
        oldFile.setTrashed(true);
      }
    }
  }
  for (var i = 0; i < conversions.length; i++) {
    const conversion = conversions[i];
    console.log('Searching for "' + conversion[0] + '" files...');
    const files = DriveApp.getFilesByType(conversion[0]);
    while (files.hasNext()) {
      const file = files.next();
      /*
      To support a large number of files, this script is to be run once an hour and on each run it
      it will export approximatly 1/24th of the files.
      */
      if (file.getName().charCodeAt(0) % 24 === modulo) {
        if (file.isTrashed()) {
          console.log('Skipping trashed file "' + file.getName() + '"');
          continue;
        }
        if (
          file.getDescription() !== null &&
          file.getDescription().indexOf(description) > -1
        ) {
          console.log('Skipping ignored file "' + file.getName() + '"');
          continue;
        }
        if (
          file.getAccess(Session.getActiveUser()) !== DriveApp.Permission.OWNER
        ) {
          console.log('Skipping shared file "' + file.getName() + '"');
          continue;
        }
        if (conversion[0] === "application/vnd.google-apps.map") {
          console.log('Sharing "' + file.getName() + '"');
          file.setSharing(
            DriveApp.Access.ANYONE_WITH_LINK,
            DriveApp.Permission.VIEW,
          );
        }
        console.log('Converting "' + file.getName() + '"');
        const blob = getFileAsBlob(file.getId(), conversion[1]);
        const newFile = folder.createFile(blob);
        newFile.setName(file.getName() + conversion[2]);
        newFile.setDescription(description);
      }
    }
  }
}

function getFileAsBlob(fileId, mimeType) {
  if (mimeType === "application/vnd.google-earth.kmz") {
    const response = UrlFetchApp.fetch(
      "https://mapsengine.google.com/map/kml?mid=" + fileId,
      {
        headers: {
          Authorization: "Bearer " + ScriptApp.getOAuthToken(),
          Accept: mimeType,
        },
        compressed: true,
        "Accept-Encoding": "gzip",
      },
    );
    return response.getBlob();
  } else {
    const response = UrlFetchApp.fetch(
      "https://www.googleapis.com/drive/v3/files/" +
        fileId +
        "/export?mimeType=" +
        encodeURIComponent(mimeType),
      {
        headers: {
          Authorization: "Bearer " + ScriptApp.getOAuthToken(),
        },
      },
    );
    return response.getBlob();
  }
}

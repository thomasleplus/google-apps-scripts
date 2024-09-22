# Export To Office

Export all Google Docs, Google Spreasheets and Google Slides to Microsoft Word, Microsoft Excel and Microsoft Powerpoint format (respectively).

Since Apps Scripts have a 6-minute runtime limite, I run this script hourly using a [standalone script](https://developers.google.com/apps-script/guides/standalone) with [time-driven trigger](https://developers.google.com/apps-script/guides/triggers/installable#time-driven_triggers). Each run exports 1/24th of the files in Google Drive so at the end of each day, all files should have been exported.

The script has two optional [script properties](https://developers.google.com/apps-script/guides/properties#manage_script_properties_manually):

- folder: the name of the Google Drive folder to save the converted files (default is 'Export'). This folder must be at the root of your Google Drive (to avoid name collisions).
- expiry: the number of days after which an orphan exported file gets deleted (default is 30).

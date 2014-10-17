bitbucket-filters
=================

Chrome Extension for adding custom filters to Bitbucket Issues;
can be found in the [app store][extension].


If you're thankful for this extension, I'd appreciate a [gittip][1] :wink:

## Usage

### Adding Filter
To add a filter, go to Issues > Advanced Search, select your options, then press the "Save & Search" button.

### Editing Filter
To edit a filter, go to Issues > Advanced Search, select 'edit' from dropdown of one of the filters. Change your filter options, and press the "Save & Search" button. Select "OK" when the name comes up, and confirm overwrite.

### Deleting Filter
To delete a filter, go to Issues > Advanced Search, select 'delete' from dropdown of one of the filters. Confirm that you want to delete by clicking "OK".


## Build

Requirements Node/npm.

```
node install
bower install
grunt build
```

### Installing

First see the *Building* section.

To install go to the extensions page (settings button > Tools > Extensions), 
then check "Developer mode" in the top right. Click 
*Load unpacked extension..* and select the `dist` directory. 
Once the extension finishes installing, click "options" and enter your username in the "assignee" box and save. 
Now open an issues page in any Bitbucket project, you should see a new filter called "My Priorities".


[1]: https://www.gittip.com/knownasilya
[extension]: https://chrome.google.com/webstore/detail/bitbucket-filters/dbifmilkbhjgdgalenpladkndcfjdpbk?utm_source=chrome-ntp-icon

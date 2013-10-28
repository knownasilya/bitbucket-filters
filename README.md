Bitbucket-Issue-Filters
=======================

Chrome Extension for adding custom filters to Bitbucket Issues

### Building

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

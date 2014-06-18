Bitbucket-Issue-Filters
=======================

Chrome Extension for adding custom filters to Bitbucket Issues.

Extension can be found [here][extension].

If you're thankful for this extension, I'd appreciate a [gittip][1] :wink:


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


[1]: https://www.gittip.com/knownasilya
[extension]: https://chrome.google.com/webstore/detail/bitbucket-filters/dbifmilkbhjgdgalenpladkndcfjdpbk?utm_source=chrome-ntp-icon

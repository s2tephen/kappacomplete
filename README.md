# KappaComplete

![KappaComplete](icon128.png)

A lightweight autocomplete Chrome extension for Twitch emotes. [Get it here](https://chrome.google.com/webstore/detail/gldlaombdcbakndhnaahbhcaikdjkbek).

On any Twitch channel page, hit the TAB key in chat to autocomplete any valid emote. This works for both global and subscriber emotes. Autocomplete will only fire on strings of one or more characters. Keep hitting TAB to cycle through all matching emotes. You can still pull up usernames/suggestions with the @ key.

I'm aware that [BetterTTV](https://nightdev.com/betterttv) has this exact feature, but I just wanted this functionality without any of the other bloat that comes with BTTV. This was mostly an opportunity for me to learn how to make a Chrome extension (and inadvertently, a thing or two about the Twitch client/Ember.js).

Thanks to [Twitchemotes](https://twitchemotes.com) for their global emotes API, which I'm using as a fallback if [TMI.js](https://www.tmijs.org) doesn't load for whatever reason.

## Changelog

### 0.5 (05/28/16)
* Fixed a bug where the extension wouldn't work if users navigated from the Twitch homepage

### 0.4 (05/28/16)
* Resolved race condition between loading TMI.js and importing emotes
* Added Twitchemotes API as fallback

### 0.3 (05/11/16)
* Chatting with button now updates emote counts
* Two-character prerequisite removed

### 0.2 (05/10/16)
* Emotes now sort based on frequency of usage (doesn't merge variants yet)
* Added changelog to README

### 0.1 (05/09/16)
* Added MVP – basic "tab to autocomplete" functionality
* Added Chrome extension manifest
* Added icon image
* Added README

## Future updates
* Image previews (once I figure out a good UI)
* Emote counts should merge regex variants
* Support for custom emotes
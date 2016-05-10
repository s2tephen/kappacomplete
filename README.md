# KappaComplete

![KappaComplete](icon128.png)

A lightweight autocomplete Chrome extension for Twitch emotes. [Get it here](https://chrome.google.com/webstore/detail/gldlaombdcbakndhnaahbhcaikdjkbek).

On any Twitch channel page, hit the TAB key in chat to autocomplete any valid emote. This works for both global and subscriber emotes. Autocomplete will only fire on strings of two or more characters (any shorter and it's not actually saving you any keypresses). Keep hitting TAB to cycle through all matching emotes. You can still pull up usernames/suggestions with the @ key.

I'm aware that [BetterTTV](https://github.com/night/BetterTTV) has this exact feature, but I just wanted this functionality without any of the other bloat that comes with BTTV. This was mostly an opportunity for me to learn how to make a Chrome extension (and inadvertently, a thing or two about the Twitch client/Ember.js). Updates to come: image previews (once I figure out a good UI) and sorting based on previous emote usage.

## Changelog

### 0.2 (05/10/16)
* Emotes now sort based on frequency of usage (doesn't merge variants yet)
* Added changelog to README

### 0.1 (05/09/16)
* Added MVP – basic "tab to autocomplete" functionality
* Added Chrome extension manifest
* Added icon image
* Added README
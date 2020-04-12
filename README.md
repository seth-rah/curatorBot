# curatorBot

## Description

In its current state the bot can probably do almost none of the following, so this is rather a planned implementation list

1. Taking user image submissions and storing their information in the database. (completed)
2. Accepting or rejecting submissions via a supergroup of admins.
3. Ban users from submitting images.
4. Posting a response to the user if their image was accepted.
5. Managing images that still need to be posted.
6. Super admins are created via config variable.
7. Super admins can use the bot to assign new normal admins, that have access to using the Accept / Reject buttons in the group.

## Known issues

### Startup Issues

Starting up the bot before mysql has properly initialized itself, and it has images in waiting from user submissions will cause the bot to crash.

In the event of this happening, please just start up the bot again with mysql already initialized while I try to figure out how to handle the scenario.

## Afterword

Special thanks to people from https://t.me/shit_tg_says for being the motivation I needed to attempt programming something from scratch. RIP European heatwave boys.

Special thanks to https://t.me/otakugallery for providing input for where I am being a brainlet.
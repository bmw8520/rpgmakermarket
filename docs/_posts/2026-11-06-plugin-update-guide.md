---
layout: post
title: "Plugin Update Guide for RPG Maker MV and MZ"
date: 2026-11-06
description: "Update RPG Maker MV and MZ plugins without losing parameters or breaking your game: backups, refresh steps, load order, conflict checks and fixes."
image: "https://media.babylovegrowth.ai/blog-images/organization-61610/1793839757080_Plugin-update-sketches-frame-a-clear-title-area.jpeg"
tags: ["plugin update guide"]
source: babylovegrowth
---
# Plugin Update Guide for RPG Maker MV and MZ

![Plugin update sketches frame a clear title area](https://media.babylovegrowth.ai/blog-images/organization-61610/1793839757080_Plugin-update-sketches-frame-a-clear-title-area.jpeg)

To update an RPG Maker plugin, back up your project, drop the new .js file into js/plugins, keep the old entry in the Plugin Manager, hit Refresh, then playtest. That's the whole loop for both MV and MZ. The details below keep your parameters intact, your load order sane and your game from crashing on startup.

We build and maintain a big library of MV and MZ plugins, so we've seen what goes wrong when updates go sideways. Here's the playbook.

## TL;DR

- Back up first. Copy the whole project, or at least the data and js folders, before touching anything.
- Replace the .js file in js/plugins and keep the old Plugin Manager entry, so your parameters stay put.
- Click Refresh in the Plugin Manager (MV: Tools > Plugin Manager; MZ: F10), then read every warning.
- Check load order and base plugins. Many post-update errors come from a plugin loading before the one it depends on.
- If something breaks, turn plugins off one at a time and test in a copy, never in your only project.

## Table of Contents

- [Before you update: back up and read the notes](#before-you-update-back-up-and-read-the-notes)
- [Updating a plugin in RPG Maker MV](#updating-a-plugin-in-rpg-maker-mv)
- [Updating a plugin in RPG Maker MZ](#updating-a-plugin-in-rpg-maker-mz)
- [Read the Plugin Manager warnings](#read-the-plugin-manager-warnings)
- [Check settings and load order](#check-settings-and-load-order)
- [Update one plugin at a time](#update-one-plugin-at-a-time)
- [Test after you update](#test-after-you-update)
- [What to do when an update breaks your game](#what-to-do-when-an-update-breaks-your-game)
- [Our perspective on updating plugins](#our-perspective-on-updating-plugins)
- [Get plugins that fit your engine](#get-plugins-that-fit-your-engine)
- [FAQ](#faq)
- [Sources](#sources)

## Before you update: back up and read the notes

Updating can break a project, and RPG Maker's own team says so. The official MZ update posts tell you to [create a backup of your project, or at least its data and js folders](https://www.rpgmakerweb.com/blog/rpg-maker-mz-1-5-0-update), before you update, because an update can sometimes break things. Treat that as the rule for plugins too.

A quick pre-flight routine:

1. Close the editor.
2. Copy the entire project folder and add the date to its name, like MyGame_2026-11-04.
3. Open the copy and do your updating there first.
4. Read the plugin's changelog or help text for new parameters, renamed commands or new requirements.
5. Note which other plugins depend on the one you're updating.

Step 4 saves the most pain. A new version may add parameters that your saved settings don't cover, rename a plugin command, or require a base plugin it didn't need before. Two minutes with the notes beats an hour with the console.

If your plugin vendor publishes release notes, read them like a game team reads patch notes. Seeing how [patch notes for a live game](https://app.eclesiar.com/en/article/5018) list what changed helps you spot the same things in a plugin changelog: new options, changed behavior and fixes that may touch your setup.

## Updating a plugin in RPG Maker MV

MV's process is simple. The official MV help says to copy the plugin's .js file into the project's js/plugins folder, and that [changes show up in the editor when you click Refresh in the Plugin Manager](https://rpgmakerofficial.com/product/MV_Help/page/01_11_09.html) under Tools > Plugin Manager.

Step by step:

1. Download the new version of the plugin.
2. Open your project's js/plugins folder.
3. Overwrite the old .js file with the new one. Keep the file name the same. If the name changes, the Plugin Manager treats it as a different plugin and your old entry points at a missing file.
4. Open the Plugin Manager and click Refresh.
5. Open the plugin entry and check that your parameters are still there. Look for any new ones.
6. Save the project, then run a playtest.

For MV, also keep two kinds of update apart. Updating a plugin only replaces one file. Updating the MV editor's core scripts is a different job, and it changes base project files. One MV update write-up explains that [existing projects are not updated automatically](https://himeworks.com/2016/04/rpg-maker-mv-1-2-0-update/) and that you copy JS files over by hand, leaving out the plugins file. If a core update is part of your plan, do it in your backup copy, then re-test every plugin.

## Updating a plugin in RPG Maker MZ

MZ works much the same, with one habit worth learning: never delete the old entry. A community guide to MZ plugins explains that you should [add the new .js file to js/plugins and right-click the plugin entry to choose Refresh](https://steamcommunity.com/sharedfiles/filedetails/?id=2470222580). Removing the entry risks wiping the parameters you already set.

Here's the MZ routine:

1. Back up the project.
2. Copy the new .js file into js/plugins, replacing the old file.
3. Press F10 to open the Plugin Manager.
4. Right-click the existing entry and choose Refresh.
5. Confirm the Status is still ON and your parameters are intact.
6. Click OK to apply, save the project, then playtest.

Some plugins want one more step. The same guide notes that depending on the plugin, you may need to reopen it and save its parameters again after a refresh. If a new parameter shows up blank, fill it in rather than assuming the default is what you want.

If you're setting up a plugin for the first time rather than updating, the official beginner's guide covers it: [select the plugin, set its Status to ON and apply your settings](https://www.rpgmakerweb.com/blog/beginners-guide-to-plugins-part1). Updating is the same flow with the entry already in place.

### Updating MZ itself

Editor updates are separate from plugin updates. The official MZ posts say to use [Main Tool Bar > Game > Update Corescript](https://www.rpgmakerweb.com/blog/rpg-maker-mz-1-1-1-update) after you back up. Core updates change the engine your plugins sit on, so plan to retest all of them afterward. If you're running a long project, update the editor and the plugins in separate sessions. That way, when something breaks, you know which change did it.

## Read the Plugin Manager warnings

MZ tells you when something looks wrong, and the warnings are worth reading. According to the official MZ plugin guide, the Plugin Manager (F10) shows messages at the bottom of the screen when a plugin [may not support MZ, needs a base plugin, is in the wrong order, is duplicated or cannot be loaded](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html).

What each warning usually means after an update:

| Warning | Likely cause after an update | What to do |
|---|---|---|
| May not support MZ | An MV version of the plugin got copied in | Get the MZ version of the plugin |
| Base plugin required | The new version depends on a base plugin | Install the base plugin and place it above |
| Wrong order | The new version must load before or after another plugin | Drag the entry to the position the warning names |
| Duplicate | Two copies registered, often after a file rename | Remove the stale entry |
| Cannot be loaded | The file name no longer matches the entry | Restore the original file name or re-add the entry |

These warnings come from plugin metadata. A community guide to plugin annotations explains that tags like [@base, @orderAfter and @orderBefore](https://forum.rmplanet.com/threads/a-guide-to-plugin-annotations.221/) are what let the manager flag dependencies and ordering. So when you update, a plugin whose author filled those in correctly will tell you what it needs. One forum answer for a common PluginManagerEx error says to [load dependent plugins after PluginCommonBase.js](https://forums.rpgmakerweb.com/threads/pluginmanagerex-not-defined-error.155705/). It's a good example of how a base plugin must sit above the plugins that use it.

MV has no equivalent warning system, so in MV you're the checker. Read the plugin's header for ordering notes and place it accordingly.

## Check settings and load order

Load order is the most common silent problem. Plugins run top to bottom in the Plugin Manager, and when two plugins change the same part of the engine, the later one wins or the two clash.

The official MV guide describes it this way: conflicts happen when [several plugins overwrite the same script location](https://rpgmakerofficial.com/product/mv/guide/011_001.html), and changing the order, following any note that says to place a plugin after another, can sometimes fix it. A forum tool that hunts for plugin conflicts adds a useful caveat: [reordering doesn't always solve it](https://forums.rpgmakerweb.com/threads/release-rpgmaker-plugin-conflict-finder-automatically-find-conflicts-between-plugins.170277/), for example when both plugins overwrite the same method.

After each update, run this settings check:

- Open the updated plugin and compare its parameters with your notes or your backup.
- Look for new parameters and set them on purpose.
- Confirm any base or core plugin sits above it.
- Confirm nothing is listed twice.
- Confirm the Status is still ON.

In both engines you can toggle plugins and edit parameter values in the Plugin Manager. The official MV help describes [switching plugins ON and OFF and editing parameters](https://rpgmakerofficial.com/product/MV_Help/page/01_05.html), which is the same control you'll use for troubleshooting.

## Update one plugin at a time

It's tempting to drop in 20 updated files and press play. Don't. Update one plugin, refresh, playtest, save, and move on. If you update in batches and something breaks, you have 20 suspects. If you update singly, you have one.

A workable rhythm:

1. Update the base or core plugins first. Many other plugins sit on them.
2. Test that the game boots and loads a save.
3. Update the plugins that depend on those bases.
4. Update standalone plugins last.
5. Keep a short text log: plugin, old version, new version, what you tested.

The log sounds fussy, but it pays off the first time you need to roll back. Keep the old .js file in a folder outside js/plugins, named with its version, so you can drop it back in.

## Test after you update

Playtest the parts of your game that use the plugin, not just the title screen. A plugin that handles battle effects can load fine and still throw an error on the first enemy turn.

Test list:

- Boot the game and load an existing save, since saves can behave differently from new games.
- Trigger every feature the plugin touches: menus, battle, map events, plugin commands.
- Run any scene that uses a plugin command, because commands can be renamed between versions.
- Open the console with F8 during playtest and watch for red errors.
- Save, quit and reload once.

Do this in the copy first. Once it passes, repeat the update in your main project, or just replace the main project with the tested copy if you've made no other changes.

## What to do when an update breaks your game

Don't panic and don't keep stacking changes. Roll back to your backup if you need to, then diagnose in the copy.

### Turn plugins off one at a time

This is the official troubleshooting method. The MV guide says to [turn suspected plugins OFF one at a time](https://rpgmakerofficial.com/product/mv/guide/011_001.html) and confirm each works alone, then try reordering. Start by switching off the plugin you just updated. If the problem vanishes, you've found the culprit or at least its neighbor. Turn it on again and switch off others that touch the same system.

![Steps for isolating a troublesome plugin](https://media.babylovegrowth.ai/blog-images/organization-61610/1793839780240_Steps-for-isolating-a-troublesome-plugin.jpeg)

### "Cannot read property of undefined"

This error often means a dependency is out of date. One forum reply says it usually means [you didn't update all your plugins](https://forums.rpgmakerweb.com/threads/cannot-read-property-x-of-undefined.85876/), and points to a core engine plugin that hadn't been updated. If you updated a plugin that depends on a core plugin, update that core plugin too.

### "Maximum call stack size exceeded"

This is typically infinite recursion, a function calling itself. Forum guidance says it's [often caused by multiple copies of the same plugin](https://forums.rpgmakerweb.com/threads/need-some-help-with-maximum-call-stack-size-exceeded.174302/) being enabled at once, and recommends checking plugin order and deactivating plugins one by one. After an update that renamed a file, check for a leftover entry of the old name.

### Crash at startup after a core update

Core script changes can break plugins until their authors update them. A forum reply on a core script upgrade recommends [testing in a copy, checking which plugins can be updated and replacing a plugin that is too old](https://forums.rpgmakerweb.com/threads/game-crashes-at-startup-when-updating-core-script-from-1-7-0-to-1-9-0-with-fossil-plugin.178618/). Compatibility moves. When the engine changes, some plugins need a new version, and a few need a replacement.

### Two plugins that fight

Sometimes two plugins both modify the same thing and neither is wrong. A long-running forum thread on compatibility points out that [you are the one who tests your specific plugin list](https://forums.rpgmakerweb.com/threads/how-to-go-about-finding-using-testing-plugin-compatibility.105570/), because no author can test every combination. Narrow it down by switching off, reorder, then look for an alternative that doesn't touch the same code.

## Our perspective on updating plugins

> We build our plugins to be modular, and updates are where that pays off. Each plugin does one job, so updating it means replacing one file and refreshing the Plugin Manager, not rebuilding your project.
>
> Our advice is to treat updating as a routine, not a risk. Back up, update one plugin, refresh, playtest, save. Do it in small steps and every update is easy to reverse. Our library of over 900 plugins covers both MV and MZ, so you can pick the version made for your engine instead of forcing an old file into a new editor.
>
> We also keep updating our plugins and offer support, because a plugin is something you live with across a whole project. If you hit a snag after an update, tell us which engine, which plugins and what the console says. That gets you to a fix fast.
>
> *RPG_Maker_Plugins*

## Get plugins that fit your engine

If you're adding plugins to a project, start with the right version for your editor. Our [MZ/MV plugin library](https://rpg-maker-plugins.itch.io/) has over 900 downloadable plugins, from minigames to sound generators, plus music generators, a minigame collection and tilesheet and sprite bundles.

[![RPG_Maker_Market](https://media.babylovegrowth.ai/blog-images/organization-61610/1792828959492_rpg-maker-plugins.png)](https://rpg-maker-plugins.itch.io/)

Want access to the whole catalog? The [Lifetime Supporter Pass](https://rpg-maker-plugins.itch.io/lifetime-supporter-pass/) is listed at $79.99, one-time. Browse the store, pick what fits your game, and keep your update routine handy.

## FAQ

### Will updating a plugin erase my parameters?

Not if you keep the old entry in the Plugin Manager. Replace the .js file in js/plugins, keep the entry, then click Refresh (right-click in MZ). Deleting the entry is what risks losing your settings. Check the parameters after refreshing, since new versions may add options.

### Do I need to update every plugin when I update the editor?

Not always, but retest every one. Core script changes can break plugins until their authors release new versions. Back up, update the core in a copy, and check each plugin. Replace any that no longer work.

### Can I use an MV plugin in MZ?

MZ's Plugin Manager warns when a plugin may not support MZ, which is what happens with MV plugins. Look for the MZ version of the plugin instead of forcing the MV file in. If you only have an MV version, test it in a copy before using it.

### Where do I get help with a plugin that stopped working?

Start with the console (F8) and turn plugins off one at a time. If you're using one of ours, contact us through our [itch.io page](https://rpg-maker-plugins.itch.io/) with your engine version, plugin list and the exact error message.

## Sources

- [RPG Maker MZ 1.5.0 Update, The Official RPG Maker Blog](https://www.rpgmakerweb.com/blog/rpg-maker-mz-1-5-0-update)
- [RPG Maker MZ 1.1.1 Update, The Official RPG Maker Blog](https://www.rpgmakerweb.com/blog/rpg-maker-mz-1-1-1-update)
- [Enabling Plugins, RPG Maker MV Help](https://rpgmakerofficial.com/product/MV_Help/page/01_11_09.html)
- [How to Use Aid Tools, RPG Maker MV Help](https://rpgmakerofficial.com/product/MV_Help/page/01_05.html)
- [Plugin guide for MV, plugin conflicts](https://rpgmakerofficial.com/product/mv/guide/011_001.html)
- [Plugin installation, RPG Maker MZ](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)
- [Beginner's Guide to Plugins, The Official RPG Maker Blog](https://www.rpgmakerweb.com/blog/beginners-guide-to-plugins-part1)
- [Beginner's Guide to Plugins, Steam Community](https://steamcommunity.com/sharedfiles/filedetails/?id=2470222580)
- [RPG Maker MV 1.2.0 Update, HimeWorks](https://himeworks.com/2016/04/rpg-maker-mv-1-2-0-update/)
- [A guide to plugin annotations, RM Planet Forums](https://forum.rmplanet.com/threads/a-guide-to-plugin-annotations.221/)
- [PluginManagerEx not defined error, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/pluginmanagerex-not-defined-error.155705/)
- [Plugin conflict finder release, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/release-rpgmaker-plugin-conflict-finder-automatically-find-conflicts-between-plugins.170277/)
- [Cannot read property of undefined, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/cannot-read-property-x-of-undefined.85876/)
- [Maximum call stack size exceeded, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/need-some-help-with-maximum-call-stack-size-exceeded.174302/)
- [Game crashes at startup when updating core script, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/game-crashes-at-startup-when-updating-core-script-from-1-7-0-to-1-9-0-with-fossil-plugin.178618/)
- [Plugin compatibility testing, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/how-to-go-about-finding-using-testing-plugin-compatibility.105570/)
- [Patch Notes, Eclesiar](https://app.eclesiar.com/en/article/5018)

Disclaimer: This article is for informational purposes only. The author is not affiliated with the creators of RPG Maker or the plugins discussed. All plugin names, trademarks, and links belong to their respective owners. The author may include links to external projects or repositories. Readers should review each project’s license and documentation before downloading or using any plugin.

---
layout: post
title: "How to Upgrade RPG Maker MV to MZ: Step-by-Step Conversion"
date: 2026-11-16
description: "There is no one-click upgrade from RPG Maker MV to MZ, but there is an official conversion workflow. Here is what carries over, what breaks, and how to test."
image: "https://media.babylovegrowth.ai/blog-images/organization-61610/1794665871155_Hand-drawn-game-tools-frame-a-clean-title-area.jpeg"
tags: ["upgrade rpg maker mv to mz"]
source: babylovegrowth
---
# How to Upgrade RPG Maker MV to MZ: Step-by-Step Conversion

![Hand-drawn game tools frame a clean title area](https://media.babylovegrowth.ai/blog-images/organization-61610/1794665871155_Hand-drawn-game-tools-frame-a-clean-title-area.jpeg)

You can move an RPG Maker MV project into MZ, but not with a button that upgrades the original folder. The official route is to create a fresh MZ project, copy your MV data into it, and let MZ run its conversion when it launches. Your maps, database and most art and audio come across. Your plugins are the part you have to plan, because MV plugins are not guaranteed to run in MZ. That is where we can take work off your plate: our library of 900+ downloadable plugins covers both MV and MZ.

This guide walks through the whole process in order: backing up, copying the right files, handling the files you should leave behind, swapping plugins, and playtesting. It is written for indie developers, hobbyists, educators and small studios who want their existing game running in MZ without rebuilding it.

## TL;DR

- There is no in-place upgrade. [MZ's official conversion guide](https://rpgmakerofficial.com/product/mz/course/convert/convert.html) has you create a new MZ project, copy MV files in, and launch MZ so conversion runs.
- Back up first. Your original MV folder stays untouched because you only copy from it.
- Maps, events, database entries, audio, icons and most image folders carry over. A short list of MV system images and the old font CSS file should stay behind.
- Plugins are the real work: each one needs an MZ-ready version, and it must be switched on in Plugin Manager to affect the game.
- Finish with a full playtest, using F9 and F8 to find broken switches, variables and script errors.

## Table of Contents

- [Why there is no one-click upgrade](#why-there-is-no-one-click-upgrade)
- [Before you start: back up and take stock](#before-you-start-back-up-and-take-stock)
- [Step 1: Create a new MZ project](#step-1-create-a-new-mz-project)
- [Step 2: Close MZ before copying](#step-2-close-mz-before-copying)
- [Step 3: Copy the right MV files into the MZ project](#step-3-copy-the-right-mv-files-into-the-mz-project)
- [Step 4: Launch MZ and let conversion run](#step-4-launch-mz-and-let-conversion-run)
- [Step 5: Replace your plugins with MZ-ready versions](#step-5-replace-your-plugins-with-mz-ready-versions)
- [Step 6: Playtest everything](#step-6-playtest-everything)
- [Common problems and quick fixes](#common-problems-and-quick-fixes)
- [Should you migrate at all?](#should-you-migrate-at-all)
- [Add what your MZ project needs](#add-what-your-mz-project-needs)
- [Our take on migrating MV to MZ](#our-take-on-migrating-mv-to-mz)
- [FAQ](#faq)
- [Sources](#sources)

## Why there is no one-click upgrade

MV and MZ are separate engines with their own project structures. MZ does not open an MV folder and rewrite it in place. Instead, the official workflow treats your MV project as a source of data. You build a clean MZ project, bring the data over, and MZ converts what it can on first launch.

That design has a useful side effect. Your MV project is never the thing being modified, so the original is your safety net. If the converted version has problems, you still have a working MV game and can try again.

So "upgrade" really means "migrate". Plan it as a small project with a backup, a copy step and a test pass, not as a quick patch.

![MV project data migrating into a tested MZ project](https://media.babylovegrowth.ai/blog-images/organization-61610/1794665901146_MV-project-data-migrating-into-a-tested-MZ-project.jpeg)

## Before you start: back up and take stock

Two minutes of preparation saves hours later.

1. **Copy your whole MV project folder.** MZ's official Q&A says that [backing up or transferring a project is done by copying or moving the folder where it is saved](https://rpgmakerofficial.com/product/mz/guide/q-and-a/mz.html). Put the copy somewhere outside your working directory, such as an external drive or cloud storage.
2. **List your plugins.** Open MV's Plugin Manager and write down every plugin that is switched on, in order, with its parameters. You will need this list in the plugin step. Screenshots of each plugin's parameter panel work well.
3. **Note any custom scripts.** If you pasted code into events (Script commands, conditional branches with script calls), mark those events. Code written against MV may behave differently in MZ.
4. **Decide what is worth bringing.** A migration is a good moment to drop abandoned plugins, test maps and unused assets.

## Step 1: Create a new MZ project

Open RPG Maker MZ and start a new project. Give it a name that makes clear it is the converted version, for example the game title plus "MZ". This fresh project provides the MZ engine files your game will run on.

Resist the urge to copy the entire MV folder over the top of it. The official guide is specific about which parts to bring, and the engine files (the contents of the project's `js` folder) belong to MZ, not MV. Overwriting them with MV versions would defeat the purpose.

## Step 2: Close MZ before copying

The official guide tells you to close MZ while you copy the files. This matters. If the editor is open while files change underneath it, it can hold stale data, and conversion may not run as intended.

Leave MZ closed until the copy is finished.

## Step 3: Copy the right MV files into the MZ project

This is the core of the migration. According to [the official conversion guide](https://rpgmakerofficial.com/product/mz/course/convert/convert.html), you can bring over:

- Maps and map events
- Database data: actors, classes, skills, items, weapons, armor, enemies, troops, states, tilesets, common events and system data
- Audio
- Icons
- Most of the standard image folders

In practice, you copy the `data` folder contents, the `audio` folder, the `icons` folder and the `img` subfolders from MV into the matching places in the MZ project, replacing the defaults when asked.

Here is a quick reference for what to do with each category.

| What | Bring it? | Notes |
|---|---|---|
| Maps and map events | Yes | Converted when MZ launches |
| Database (actors, classes, skills, items, weapons, armor, enemies, troops, states, tilesets, common events, system) | Yes | Review values after conversion |
| Audio (BGM, BGS, ME, SE) | Yes | Copy the audio folder |
| Icons | Yes | MZ uses its own icon sheet layout, so check the result in the item and skill lists |
| Most image folders | Yes | Characters, faces, tilesets, parallaxes and similar |
| ButtonSet.png, Damage.png, Loading.png, MadeWithMv.png | No | The guide lists these MV system images as ones not to bring |
| Animations | Not recommended | MZ cannot edit them; if you include them, `img/animations` must be copied |
| Fonts | Yes, without gamefont.css | Set the font inside MZ instead |
| MV plugins | See below | Handled separately |

### The system images to leave behind

Four MV system images, ButtonSet.png, Damage.png, Loading.png and MadeWithMv.png, should not be copied. MZ has its own versions of these, and bringing the MV ones over would replace graphics MZ expects to find in its own format. If you customized any of them, redo that customization using MZ's files as the base.

### Animations

The guide does not recommend carrying animations over, because MZ cannot edit MV-style animations. If your game relies on them and you decide to include them anyway, you need to copy the `img/animations` folder. They will play, but you will not be able to adjust them in MZ's editor. If your battle effects matter to your game, plan to rebuild the important ones with MZ's animation tools over time.

### Fonts

Copy your font files, but not `gamefont.css`. MZ sets the font differently. After conversion, open the database, go to System 2, then Advanced Settings, and choose the font there. This is a small detail that is easy to miss, and it explains why text sometimes looks wrong after a migration.

### A note on sprites and art

MZ and MV character art are not identical in every respect. The official RPG Maker blog has a post on converting MV sprites to MZ, covering how to rework character sprites when MV art does not line up with MZ's style. If your game uses the default MV character generator output, expect to spend some time on that if you want a consistent look.

## Step 4: Launch MZ and let conversion run

With the files copied, open MZ and load the new project. The official guide says conversion processing runs when you launch. Open a few maps, click through the database tabs, and confirm that your actors, items and skills are all there.

If you see missing graphics, check the folder names first. A wrong subfolder is the most common cause, and it is a copy mistake, not an engine fault.

## Step 5: Replace your plugins with MZ-ready versions

This step decides how smooth the migration is. Plugins are scripts that extend the engine, and an MV plugin is written against MV's code. MZ is a different engine version, so you should not assume an MV plugin will behave in MZ.

Work through your plugin list one at a time:

1. **Check for an MZ version.** For each plugin on your list, find a version made for MZ. Many plugin authors publish separate MV and MZ files.
2. **Copy the plugin file** into the MZ project's `js/plugins` folder.
3. **Enable it in Plugin Manager.** MZ's official Q&A says that [an imported plugin must be enabled in Plugin Manager to affect the game](https://rpgmakerofficial.com/product/mz/guide/q-and-a/mz.html). A plugin sitting in the folder does nothing until it is switched on.
4. **Re-enter the parameters.** Use the screenshots you took earlier. Parameter names sometimes change between versions.
5. **Re-check plugin commands in your events.** If an event called a plugin command, confirm it still exists and does the same thing in the MZ version.
6. **Mind the order.** Plugins often depend on load order, so keep the order from your MV list unless the plugin's notes say otherwise.

Our [MZ/MV plugin library](https://rpg-maker-plugins.itch.io/) is built for exactly this situation. It offers more than 900 downloadable plugins for RPG Maker MV and MZ, including minigames and sound generators, and each is a modular add-on. You install the capability you need rather than reworking your game around it. That makes it practical to replace one broken plugin at a time instead of rewriting a whole feature set.

### What if a plugin has no MZ version?

You have three honest options: remove the feature, rebuild it with MZ's built-in tools, or replace it with a different plugin that does the same job. Before you decide, ask whether MZ already does it natively. Some features that needed plugins in MV are handled by the editor now, so a migration can shrink your plugin list.

For a gameplay feature such as an animated travel scene, a minigame or a custom menu, replacing the plugin is usually the fastest path. Our modular plugins are designed so non-coders can add these without extensive coding.

## Step 6: Playtest everything

MZ's help describes playtesting as the way to check that settings and events behave as intended: from the menu, choose Game, then Playtest. [The official help on aid tools](https://rpgmakerofficial.com/product/MZ_help-en/01_05.html) also covers two debugging shortcuts you will use constantly during a migration:

- **F9** opens the debug screen, where you can inspect and change switches and variables during play.
- **F8** opens Developer Tools, which let you inspect the HTML5 game and see technical errors.

Use them together. If an event does not fire, F9 shows whether the switch or variable it depends on has the value you expect. If the game stops or a plugin misbehaves, F8's console usually names the file and the line.

### A migration test checklist

Play the game start to finish at least once, and check these specifically:

- **Title screen and menus:** fonts, windows, icons and text alignment
- **Every map:** tilesets, passability, parallax backgrounds, autorun and parallel events
- **Battle:** skills, states, damage formulas, enemy behavior, troop events and animations
- **Shops, saves and loading:** buy and sell, and a save made then reloaded
- **Plugin features:** each one used at least once, including its plugin commands
- **Audio:** music loops and sound effects on every key scene
- **Custom scripts:** every event you marked earlier

Keep a simple log of problems with the map or event where each appeared. Fix them in order of how early in the game a player would meet them.

## Common problems and quick fixes

**Black screen on launch.** Open F8 and read the console. A plugin error on startup is the usual cause. Switch off plugins in Plugin Manager and turn them back on one by one until the error returns.

**A plugin has no effect.** Confirm it is enabled in Plugin Manager and sits in the right folder.

**Wrong font.** You probably copied `gamefont.css`, or you have not set the font under Database, System 2, Advanced Settings.

**Missing or odd graphics.** Check that you did not copy the four excluded MV system images, and that image subfolders match MZ's names.

**Battle animations look off.** Animations are the one category the guide does not recommend carrying over. Rebuild key effects in MZ.

**Event behaves differently.** Use F9 to watch switches and variables, then look at any script calls in that event.

## Should you migrate at all?

Migrating makes sense when you want to keep building on a game you have already made and want MZ's engine for it. For a brand-new game, you can simply start in MZ and skip the migration. If your MV game is nearly finished, finishing it in MV is a reasonable call too. Both engines are supported by our plugins, so that choice is yours to make on project needs.

## Add what your MZ project needs

Once the migration works, the fun part starts. Many developers use the move to add features the old project lacked.

![Add what your MZ project needs](https://media.babylovegrowth.ai/blog-images/organization-61610/1794665918269_Add-what-your-MZ-project-needs.jpeg)

Our store at [rpg-maker-plugins.itch.io](https://rpg-maker-plugins.itch.io/) carries MZ/MV plugins, background music generators, an MZ minigame collection, and tilesheets, sprite assets and bundles. The plugins include features like animated travel scenes and multiplayer capabilities, and the minigames include historically themed and STEM educational ones, which suits teachers building learning games. Resources are whitelabel-ready for commercial use or resale.

If you expect to keep adding to your project, the [Lifetime Supporter Pass](https://rpg-maker-plugins.itch.io/lifetime-supporter-pass/) is a one-off payment of $79.99.

[![RPG_Maker_Market](https://media.babylovegrowth.ai/blog-images/organization-61610/1792828959492_rpg-maker-plugins.png)](https://rpg-maker-plugins.itch.io/)

Browse the full range on our [itch.io storefront](https://rpg-maker-plugins.itch.io/) and pick the plugins that replace the ones on your migration list.

## Our take on migrating MV to MZ

> Most migration stress comes from one place: plugins. The maps, the database and the art mostly come across by following the official steps. The features you built your game around are what you have to rebuild.
>
> That is why we build modular. Each plugin adds one capability and plugs into your project without extensive coding, so you can replace features one at a time and test as you go. You do not need to be a programmer to finish a migration.
>
> We keep our library growing, with 900+ plugins for MV and MZ, from minigames to sound generators, plus updates and support from a community of users who give feedback. Move your project, rebuild the features you love, and get back to making your game.
>
> *RPG_Maker_Plugins*

## FAQ

### Can I open my MV project directly in MZ?

Not as an in-place upgrade. The official workflow is to create a new MZ project, close MZ, copy the supported MV files into it, and launch MZ so conversion runs. Your original MV project stays as it was, which gives you a built-in backup.

### Will my MV plugins work in MZ?

Do not assume so. Plugins are written for a specific engine version, so check each one for an MZ version, copy it to the plugins folder and enable it in Plugin Manager. Our library includes plugins for both MV and MZ, so you can replace ones that lack an MZ version.

### Which files should I not copy from MV?

Leave out ButtonSet.png, Damage.png, Loading.png and MadeWithMv.png, and do not copy gamefont.css. Animations are not recommended either, since MZ cannot edit them. Set your font in the database under System 2, Advanced Settings.

### How do I find what broke after conversion?

Run Game, then Playtest. During play, press F9 to inspect and change switches and variables, and F8 to open Developer Tools for technical errors. Work through maps, battles, menus and plugin features in turn.

### Can I use my MV sprites and art in MZ?

Most image folders can be copied over. Character sprites may need rework to match MZ's style, and the official RPG Maker blog has a post about converting MV sprites. Our store also sells tilesheets, sprite assets and bundles if you want fresh art.

## Sources

- [MZ official conversion guide: converting MV data](https://rpgmakerofficial.com/product/mz/course/convert/convert.html)
- [RPG Maker MZ official Q&A](https://rpgmakerofficial.com/product/mz/guide/q-and-a/mz.html)
- [RPG Maker MZ official help: How to Use Aid Tools](https://rpgmakerofficial.com/product/MZ_help-en/01_05.html)

## Recommended

- [RPG Maker Plugins](https://rpg-maker-plugins.itch.io/)

Disclaimer: This article is for informational purposes only. The author is not affiliated with the creators of RPG Maker or the plugins discussed. All plugin names, trademarks, and links belong to their respective owners. The author may include links to external projects or repositories. Readers should review each project’s license and documentation before downloading or using any plugin.

---
layout: post
title: "How to Migrate MV Plugins to MZ: A Practical Guide"
date: 2026-11-02
description: "Learn how to migrate RPG Maker MV plugins to MZ: what breaks, how to check a plugin, convert commands and windows, test safely, and what to do when porting fails."
image: "https://media.babylovegrowth.ai/blog-images/organization-61610/1793472350048_Hand-drawn-plugin-migration-title-card.jpeg"
tags: ["migrate mv plugins to mz"]
source: babylovegrowth
---
# How to Migrate MV Plugins to MZ: A Practical Guide

![Hand-drawn plugin migration title card](https://media.babylovegrowth.ai/blog-images/organization-61610/1793472350048_Hand-drawn-plugin-migration-title-card.jpeg)

Most MV plugins will not work in MZ unchanged, but many can be migrated with a few targeted edits, a compatibility layer, or a swap for an MZ equivalent. The usual breakpoints are plugin commands, window creation and bitmap handling. Check those three first and you will know within minutes whether a plugin is worth porting.

This guide walks through the whole process: what changed between engines, how to triage your plugin list, how to convert commands and windows, how to test without risking your project, and what to do when a plugin refuses to move.

## TL;DR

- MV plugins are [not compatible with MZ by default most of the time](https://forums.rpgmakerweb.com/threads/mv-and-mz-plugin-compatibility.127075/), and plugins with plugin commands are at least partly broken.
- Plugins that add brand-new features often survive. Plugins that override core engine processes should be treated as incompatible until proven otherwise.
- The three big fixes: rewrite plugin commands with `@command` and `@arg`, give new windows a Rectangle, and re-check anything touching bitmaps or animations.
- Always test in a copy of your project, with the console open (F8 or F12 during playtest).
- If a plugin will not port, look for an MZ equivalent, or ask whether you still need the feature.

## Table of Contents

- [Do MV plugins work in MZ at all?](#do-mv-plugins-work-in-mz-at-all)
- [What actually changed between MV and MZ](#what-actually-changed-between-mv-and-mz)
- [Step 1: Triage your plugin list](#step-1-triage-your-plugin-list)
- [Step 2: Convert the project first, then the plugins](#step-2-convert-the-project-first-then-the-plugins)
- [Step 3: Convert plugin commands](#step-3-convert-plugin-commands)
- [Step 4: Fix windows](#step-4-fix-windows)
- [Step 5: The compatibility-layer shortcut](#step-5-the-compatibility-layer-shortcut)
- [Step 6: Test without risking your project](#step-6-test-without-risking-your-project)
- [What if a plugin will not migrate?](#what-if-a-plugin-will-not-migrate)
- [Licensing: check before you port](#licensing-check-before-you-port)
- [Skip the porting: start from MZ-ready modules](#skip-the-porting-start-from-mz-ready-modules)
- [A quick migration checklist](#a-quick-migration-checklist)
- [FAQ](#faq)
- [Sources](#sources)

## Do MV plugins work in MZ at all?

Sometimes. [Some MV plugins run as-is in MZ](https://forums.rpgmakerweb.com/threads/mv-to-mz-questions.137393/), while plugins built around custom windows or bitmaps can have major issues. There is no guarantee either way, so treat every plugin as a separate small project.

The pattern is consistent enough to plan around:

| Plugin type | Likelihood in MZ | What to expect |
|---|---|---|
| Adds a new, self-contained feature (a new item rule, a utility script) | Often works | Test it, then fix small errors |
| Uses plugin commands | Partly works at best | Commands must be rewritten in MZ format |
| Creates custom windows | Frequently breaks | Window constructors need a Rectangle |
| Overrides core engine methods | Assume it breaks | Needs a real port or a replacement |
| Handles bitmaps, animations, image preloading | High risk | Review line by line |

The split between "adds" and "overrides" is the most useful triage rule. A [personal write-up on using MV plugins in MZ](https://note.com/leveljustice_fan/n/n771730baa055?hl=en) suggests assuming plugins that override existing processes are incompatible, while plugins that add entirely new features may still work.

## What actually changed between MV and MZ

You do not need to know the whole engine. You need to know the handful of places where plugin code collides with the new one.

### Plugin commands

MZ changed [how plugin commands are added and edited](https://forums.rpgmakerweb.com/threads/mv-to-mz-questions.137393/). In MV, a plugin parsed a text string and a lot of `if` statements. In MZ, the plugin header declares each command, and the editor shows a proper dialog with named arguments. An MV plugin without those declarations will simply not offer its commands in MZ's event editor.

### Windows

MZ [requires a rectangle to initialize windows](https://forums.rpgmakerweb.com/threads/mv-to-mz-questions.137393/). MV windows were created with separate x, y, width and height values. Any plugin that builds a custom menu, HUD or message box will usually throw an error on the first call until this is fixed.

### Bitmaps and images

MZ [handles bitmaps and image preloading differently](https://forums.rpgmakerweb.com/threads/mv-to-mz-questions.137393/). Plugins that draw to bitmaps, preload pictures or build custom sprites need a careful review. Sprite and animation code is another hotspot: porting can mean updating [Sprite_Base methods that moved to Sprite, and replacing isAnimationPlaying() with _animationPlaying](https://forums.rpgmakerweb.com/threads/rpg-maker-mv-to-mz-plugin-conversion-is-easy.143521/).

![Four key MV to MZ plugin code changes](https://media.babylovegrowth.ai/blog-images/organization-61610/1793472397970_Four-key-MV-to-MZ-plugin-code-changes.jpeg)

## Step 1: Triage your plugin list

Before you touch code, sort every plugin into one of four buckets. Open your plugin manager and make a simple list.

1. **Probably fine.** Small utilities, pure data tweaks, anything with no commands and no windows.
2. **Needs command conversion.** Works in logic, but uses MV-style plugin commands.
3. **Needs a real port.** Custom windows, bitmaps, animation or battle system changes.
4. **Replace or drop.** Core overrides, abandoned plugins, or features you no longer need.

One community voice recommends [evaluating plugins one by one](https://guild.rpgmakerofficial.com/t/topic/2290) to find MZ replacements or plugins that are no longer necessary. That is good advice. Migration is a chance to cut dead weight, and every plugin you remove is one less thing to debug.

Next, read each plugin's header. Does it list a base plugin it depends on? Does it say it overrides core functions? MZ's own plugin manager [warns about possible incompatibility, missing base plugins and load-order requirements](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html), so the engine will tell you some of this. Listen to it.

## Step 2: Convert the project first, then the plugins

Migrating a plugin and converting a whole game are different jobs, and you should do them in order.

To bring over a whole MV project, the official guide says to create a new MZ project, copy the needed MV files (leaving out certain system images), and launch MZ to run the conversion. It also states that [plugin data is not guaranteed to work](https://rpgmakerofficial.com/product/mz/course/convert/convert.html). So the conversion handles your maps and database. Your plugins are still yours to sort out.

Practical advice:

- Never convert over your only copy. Keep the MV project untouched as a fallback.
- Convert with all MV plugins disabled in the plugin manager, and confirm the bare project boots.
- Re-enable plugins one at a time, in your triage order, and playtest after each.

If you are earlier in the decision, know that experiences vary. One developer's [documented migration](https://mauigamestudio.com/migrating-from-rpg-maker-mv-to-mz-thoughts-dev-log/) found that video-background plugins did not carry over and the affected presentation features had to be replaced. Budget for a few cases like that.

## Step 3: Convert plugin commands

This is the most common fix and the most mechanical. According to a [forum walkthrough of converting commands from MV to MZ](https://forums.rpgmakerweb.com/threads/how-to-convert-plugin-command-from-mv-to-mz.166821/), you add `@command` and `@arg` annotations to the plugin header and register the handler with `PluginManager.registerCommand`.

Here is the shape of the change, using a made-up command:

**MV style (parsed from text):**

```
var _alias = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _alias.call(this, command, args);
    if (command === 'ShowTravel') {
        showTravel(args[0]);
    }
};
```

**MZ style (declared and registered):**

```
/*:
 * @command ShowTravel
 * @text Show Travel Scene
 * @arg scene
 * @type string
 */
PluginManager.registerCommand('MyPlugin', 'ShowTravel', args => {
    showTravel(args.scene);
});
```

Three habits make this go smoothly:

- Keep the plugin file name and the first argument of `registerCommand` identical.
- Remember that MZ passes arguments as strings. Convert to numbers or booleans yourself.
- Update your events. Old plugin command lines in your maps will not magically become new commands, so re-enter them in MZ's plugin command dialog.

## Step 4: Fix windows

For anything that creates a new window, the fix is to build a Rectangle and pass it to the constructor. The same [forum guidance](https://forums.rpgmakerweb.com/threads/how-to-convert-plugin-command-from-mv-to-mz.166821/) notes that new-window code needs an MZ-specific Rectangle initializer.

A typical change:

```
// MV
this._myWindow = new Window_MyThing(0, 0, 400, 200);

// MZ
const rect = new Rectangle(0, 0, 400, 200);
this._myWindow = new Window_MyThing(rect);
```

Then, inside the window class, change `initialize(x, y, w, h)` to `initialize(rect)` and call `Window_Base.prototype.initialize.call(this, rect)`. If your plugin placed windows by calculating positions, check those numbers too, since MZ's default screen layout differs from MV's.

## Step 5: The compatibility-layer shortcut

If you have a lot of MV plugins and no appetite for rewriting them, a compatibility layer is worth knowing about. Project FOSSIL is a community-made MZ plugin that [translates common MV engine calls, such as window creation and old-style plugin commands](https://forums.rpgmakerweb.com/threads/project-fossil-v1-0-use-mv-plugins-in-mz-300-plugins-fossilized.135523/), so that many MV plugins can run in MZ without manual porting.

The idea is smart: porting is often a translation problem. Instead of rewriting each plugin, a layer converts old requests into the format the new engine expects. FOSSIL also uses a "Pre Fix" or "Post Fix" loading approach that lets community patches hook in and correct a plugin's behavior without the author rewriting anything.

When using a layer like this:

- Load it in the order its instructions specify.
- Check its supported-plugin list before assuming your plugin is covered.
- Do not expect the original plugin author to support the setup. Developers in that community advise against asking authors for help when an MV plugin is run in MZ, because the problems come from engine differences, not the plugin's logic.

A layer is a great way to get a project running fast. For plugins at the heart of your game, a proper port gives you cleaner long-term control.

## Step 6: Test without risking your project

A migration goes wrong when you change five things and cannot tell which one broke the game. Keep it boring.

1. **Work on a copy.** Duplicate the folder before every session.
2. **One plugin at a time.** Enable, playtest, then move on.
3. **Keep the console open.** Open it during playtest and read the first error, not the last.
4. **Save the stack trace.** When you ask for help, a console stack trace is what people want to see. The FOSSIL thread asks for exactly that when reporting problems.
5. **Test the unglamorous paths.** Load a save, open every menu, start and end a battle, change maps, and trigger each plugin command from an event.
6. **Check load order.** Base plugins go first, add-ons after.

A quick note on old saves: MZ and MV saves are not interchangeable in practice, so plan to start fresh test saves after migration.

## What if a plugin will not migrate?

You have three honest options.

**Find an MZ equivalent.** If a plugin cannot be reliably ported, the forum advice is to [consider an MZ equivalent or ask whether the functionality is still necessary](https://forums.rpgmakerweb.com/threads/compatibility-of-mv-and-mz-plug-ins.163551/). Plugins built natively for MZ already use the right command format and window setup, which saves you the debugging.

**Redesign the feature.** If a flashy effect was the problem, a simpler MZ-native approach often looks just as good and runs more reliably.

**Drop it.** After a few hundred hours of development, it is easy to forget which features players will actually notice. Cutting one is sometimes the fastest way to ship.

## Licensing: check before you port

![Licensing: check before you port](https://media.babylovegrowth.ai/blog-images/organization-61610/1793472379244_Licensing-check-before-you-port.jpeg)

Porting someone else's plugin is a licensing question as well as a technical one. For the official plugins that ship with the engines, RPG Maker's own guild states that [porting official plugins without their own license between MV and MZ is permitted if you own both engines](https://guild.rpgmakerofficial.com/t/topic/2049?tl=en), and distribution is only allowed bundled with a game. The same thread says [MIT-licensed plugins may be ported freely](https://guild.rpgmakerofficial.com/t/topic/2049?tl=en) as long as the copyright notice and full license text stay with the code.

For third-party plugins, read the terms in the header or on the download page. If they say nothing about modification, ask the author before you rework and redistribute it.

> ## What we think about migrating
>
> We build and maintain a large library of RPG Maker plugins for both MV and MZ, and the lesson from years of that work is simple: modularity makes migration painless. When each plugin does one job and plugs in without heavy coding, you can move or replace pieces one at a time instead of rebuilding your whole game around a single giant script.
>
> That is why we design our tools to integrate quickly and to stay compatible with MV and MZ. A developer who wants animated travel scenes, a minigame or a sound generator should be able to add it, test it and ship it, not spend a weekend rewriting window constructors.
>
> Our advice if you are mid-migration: port the plugins that define your game, replace the ones that are easy to swap, and lean on MZ-ready modules for everything else. You keep your creative energy for the game itself.
>
> *RPG_Maker_Plugins*

## Skip the porting: start from MZ-ready modules

If your triage list has a lot of "replace or drop" entries, you do not have to hunt through forum threads for substitutes. Our [MZ and MV plugin library](https://rpg-maker-plugins.itch.io/) has over 900 downloadable plugins, from minigames to sound generators, built for modular drop-in use. Add animated travel scenes, multiplayer features or educational minigames without writing a line of conversion code.

[![RPG_Maker_Market](https://media.babylovegrowth.ai/blog-images/organization-61610/1792828959492_rpg-maker-plugins.png)](https://rpg-maker-plugins.itch.io/)

Want everything we publish? The [Lifetime Supporter Pass](https://rpg-maker-plugins.itch.io/lifetime-supporter-pass/) is a one-off $79.99. Prefer to browse first? Open the [full catalog](https://rpg-maker-plugins.itch.io/) for plugins, background music generators, the MZ minigame collection, and tilesheet and sprite bundles.

## A quick migration checklist

- Back up the MV project and keep it untouched.
- Convert the project with all plugins off, then confirm it boots.
- Sort plugins into fine, commands, port and replace buckets.
- Convert commands with `@command`, `@arg` and `registerCommand`.
- Give every custom window a Rectangle.
- Re-test anything with bitmaps, animations or battle changes.
- Consider a compatibility layer for the long tail of small plugins.
- Replace or drop what you cannot port reliably.
- Check licenses before redistributing any modified plugin.

## FAQ

### Can I just copy my MV plugins into an MZ project?

You can copy them, but do not expect all of them to work. Some run fine, while plugins with commands, custom windows or bitmap code often fail. Enable them one at a time and read the console for errors.

### Do I need to know JavaScript to migrate a plugin?

For simple command conversions, light JavaScript is enough, since you mostly add header annotations and one registration call. For windows, bitmaps and animation, you will want to be comfortable reading engine code. If not, a compatibility layer or an MZ-native replacement is the faster path.

### Will my MV save files work in MZ?

Plan on starting new saves. The official conversion process moves your project data, but it does not promise plugin data will work, so old saves tied to plugin behavior are unreliable. Test with fresh saves after migrating.

### Is it legal to port a plugin I did not write?

It depends on the license. Official engine plugins without their own license may be ported between MV and MZ if you own both engines, and MIT-licensed plugins may be ported if you keep the license text. For anything else, follow the author's terms or ask.

### What if only one plugin keeps crashing my MZ project?

Disable it, confirm the rest of the game runs, then check its console error. If the cause is a window or command issue, apply the fixes above. If it overrides core engine code, look for an MZ-native equivalent or redesign the feature.

## Sources

- [MV to MZ questions, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/mv-to-mz-questions.137393/)
- [MV and MZ plugin compatibility, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/mv-and-mz-plugin-compatibility.127075/)
- [Project FOSSIL: Use MV plugins in MZ, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/project-fossil-v1-0-use-mv-plugins-in-mz-300-plugins-fossilized.135523/)
- [RPG Maker MV to MZ plugin conversion, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/rpg-maker-mv-to-mz-plugin-conversion-is-easy.143521/)
- [How to convert plugin command from MV to MZ, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/how-to-convert-plugin-command-from-mv-to-mz.166821/)
- [Compatibility of MV and MZ plug-ins, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/compatibility-of-mv-and-mz-plug-ins.163551/)
- [Installing plugins, RPG Maker MZ official](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)
- [Converting MV data, RPG Maker MZ official](https://rpgmakerofficial.com/product/mz/course/convert/convert.html)
- [Official plugins terms of use, RPG Maker Guild](https://guild.rpgmakerofficial.com/t/topic/2049?tl=en)
- [Just a Quick Questions, RPG Maker Guild](https://guild.rpgmakerofficial.com/t/topic/2290)
- [Using RPG Maker MV Plugins in MZ](https://note.com/leveljustice_fan/n/n771730baa055?hl=en)
- [Migrating from RPG Maker MV to MZ: Thoughts and Dev Log](https://mauigamestudio.com/migrating-from-rpg-maker-mv-to-mz-thoughts-dev-log/)

Disclaimer: This article is for informational purposes only. The author is not affiliated with the creators of RPG Maker or the plugins discussed. All plugin names, trademarks, and links belong to their respective owners. The author may include links to external projects or repositories. Readers should review each project’s license and documentation before downloading or using any plugin.

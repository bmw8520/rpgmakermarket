---
layout: post
title: "How to Optimize Plugins in RPG Maker MV and MZ"
date: 2026-11-21
description: "Find the plugin that causes lag in RPG Maker MV or MZ, then fix it. Covers FPS checks, isolation tests, load order, heavy plugin types and before/after testing."
image: "https://media.babylovegrowth.ai/blog-images/organization-61610/1795078948220_Hand-drawn-plugin-tools-frame-title-area.jpeg"
tags: ["optimize plugins in rpg maker"]
source: babylovegrowth
---
# How to Optimize Plugins in RPG Maker MV and MZ

![Hand-drawn plugin tools frame title area](https://media.babylovegrowth.ai/blog-images/organization-61610/1795078948220_Hand-drawn-plugin-tools-frame-title-area.jpeg)

To optimize plugins in RPG Maker, measure first, then isolate. Press F2 to see your frame rate. Switch plugins off and back on in batches to find the heavy one. Then cut what it does every frame, fix the load order, and test again. Most lag comes from one or two plugins doing too much work on every frame, not from the whole stack. Keeping your plugin set small and modular makes that hunt much shorter. That is how we build and organize the 900+ plugins in our [RPG Maker MV and MZ library](https://rpg-maker-plugins.itch.io/).

This guide is for indie developers, hobbyists, educators and small studios who want a game that runs smoothly and don't want to read engine source code to get there.

## TL;DR

- Press F2 in playtest to show the FPS widget, so you fix a measured drop and not a feeling.
- Turn all plugins off, save, test, then re-enable them in small groups until the lag returns.
- Plugin order in the Plugin Manager is load order, and it matters. Core plugins usually go above the plugins that depend on them.
- Lighting, targeting, resolution and scene-transition plugins are the usual heavy hitters. Lower their per-frame work first.
- Re-test the same scene the same way after every change, and keep only changes that show a gain.

## Table of Contents

- [Start by proving the plugin is the problem](#start-by-proving-the-plugin-is-the-problem)
- [Isolate the slow plugin](#isolate-the-slow-plugin)
- [Use the browser profiler when F2 is not enough](#use-the-browser-profiler-when-f2-is-not-enough)
- [What makes a plugin expensive](#what-makes-a-plugin-expensive)
- [Fix the heavy plugin types](#fix-the-heavy-plugin-types)
- [Set the load order right](#set-the-load-order-right)
- [Trim the stack](#trim-the-stack)
- [Clean up the rest of the project](#clean-up-the-rest-of-the-project)
- [Test after each change](#test-after-each-change)
- [Our perspective](#our-perspective)
- [Build with plugins made for MV and MZ](#build-with-plugins-made-for-mv-and-mz)
- [FAQ](#faq)
- [Sources](#sources)

## Start by proving the plugin is the problem

Plugins are small JavaScript files that change how the engine behaves. Each one can add work that runs on every frame, 60 times a second. A single slow plugin can drag down a game that is otherwise light. But lag has other causes too: parallel events, a high resolution, or a weak test machine can all drop frames. So prove it is a plugin before you touch anything.

**Step 1: Show the frame rate.** During playtest, press F2. The [RPG Maker MZ community discussion on game performance](https://steamcommunity.com/app/1096900/discussions/0/3878221560443686890/) notes that the FPS widget works in both MV and MZ. Walk through the scene that feels slow and watch the number. Note where it dips: when you enter the map, when a battle starts, or constantly.

**Step 2: Turn every plugin off.** Open the Plugin Manager, uncheck all plugins, save the project and test the same scene. The same discussion recommends this as the direct way to see whether plugins are involved. MZ puts a checkbox beside each plugin, so [switching them on and off is quick](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html).

If the frame rate is still low with no plugins, look elsewhere. Parallel process events, huge maps with many events, oversized images and a very high resolution are the next suspects. If it jumps back to 60, you have a plugin problem, and the rest of this guide applies.

**Step 3: Write down a baseline.** Record the scene, the lowest FPS you saw and how you triggered it. Without it you cannot tell later whether a change helped.

## Isolate the slow plugin

Now find which plugin is responsible. This is a search problem, so do it like one.

### The binary method

With 40 plugins, switching them on one at a time is slow. Instead:

1. Enable the first half of your list and test.
2. If the lag appears, the culprit is in that half. If not, it is in the other half.
3. Split the guilty half again and repeat.

In about five or six rounds you land on a single plugin or a pair. Remember that some plugins depend on others. A plugin that needs a core plugin will not run without it, so enable dependencies together.

### Check for conflicts, not just cost

Sometimes two plugins are each fine alone and slow, or broken, together. The [official RPG Maker MV guide](https://rpgmakerofficial.com/product/mv/guide/011_001.html) explains that conflicts happen when several plugins rewrite the same part of the engine's scripts. They are most likely between plugins that do similar jobs, such as two battle plugins. Its advice is to turn the suspects off one by one and confirm that each works alone but fails when both are on.

![Testing two RPG Maker plugins for conflicts](https://media.babylovegrowth.ai/blog-images/organization-61610/1795079030861_Testing-two-RPG-Maker-plugins-for-conflicts.jpeg)

If a pair conflicts, you have three options: keep one, reorder them, or choose a plugin that was designed to do both jobs.

### Look at the symptom's timing

When the drop happens tells you what kind of work is expensive:

- **A single stutter on entry**: loading images, audio or initializing sprites. This is a one-time cost and often acceptable, or fixable by preloading.
- **A steady drop while something is on screen**: per-frame work, such as lighting, particles or a custom HUD.
- **A drop only when many events are present**: a plugin that loops over every event on every frame.

For weather, a [community thread on weather effect slowdowns](https://steamcommunity.com/app/363890/discussions/1/1649917420731492626/) suggests checking whether the drop happens only when the weather first applies or continues while rain or snow falls. That one question separates a setup cost from an ongoing cost.

## Use the browser profiler when F2 is not enough

F2 tells you that something is slow. To learn which function is slow, profile. An MV project played in a browser can be recorded in Chrome's DevTools Performance panel. A [Japanese walkthrough on profiling MV](https://www.5ing-myway.com/rpgmaker-improve-performance/) shows the approach: record a play session, open the Bottom-Up view, and sort by time spent. The functions at the top point to the plugin file they live in. Its author then changed the code and compared the same measurements before and after.

You do not need to read the code to benefit. If the profiler names `Plugin_Name.js` at the top of the list, you know which plugin to configure, replace or remove. If you can read JavaScript, the function name tells you what it is doing every frame.

## What makes a plugin expensive

It helps to know what slow plugin code looks like, because plugin parameters often let you turn it down. The [DynRPG plugin developer guidelines](https://rpg-maker.cherrytree.at/dynrpg/guidelines.html) were written for an older RPG Maker engine, but the performance logic carries over to any code that runs every frame. They say per-frame work should never exceed one millisecond, and that most callback code runs at least 60 times per second. They also give an example of how fast the numbers add up: a visibility check called 900 times per second on a map with 150 events.

The same guidelines recommend these habits, all of which you can look for in a plugin's settings:

- Avoid repeated memory allocation, which creates garbage the engine must clean up.
- Cache text and images rather than redrawing them every frame.
- Update only every two or three frames where full-speed updates add nothing.
- Move complex calculations out of the main loop and reuse cached graphics.

As a user, translate that into questions about each plugin. Does it have an update interval? A quality setting? A radius or limit? Does it redraw something that never changes? Lowering the work per frame is the single most reliable optimization.

## Fix the heavy plugin types

Four kinds of plugin cause most complaints. Here is how to approach each one.

### Lighting

Real-time lighting recalculates light on every frame, and it gets worse with more light sources. Players in [a forum thread on fixing lighting slowdown](https://google.com/goto?url=CAESfAHEIkXXmZuJ4VaDwK2ZuAFYF0M1ikj-hwje8r0IlNPQGFNw3YGEFS7WZSnYRFXKTaF4IcHxp3BcMbkpZJYL6KjTpIE589u-kuNOWiTYQeGcQsJt5fitW2eMi6AJMBut-XdV0IvVZhjupfTnXpaZGOGT5xOj5GIEfyMQaqc) describe the trade-off. To cut cost:

- Use fewer light sources per map, and only where the player will notice them.
- Use static or baked lighting for areas that do not change.
- Disable lights that are off screen if the plugin offers that option.
- Test on your weakest target device, not your development PC.

### Targeting and battle plugins

Targeting plugins that let a skill hit one enemy or all enemies run checks during battle input. Slowdowns usually come from stacking several battle plugins that rewrite the same methods. Keep one plugin per job. If you run two battle systems, expect conflicts and test both alone first.

### Resolution and window resizing

A larger game screen means more pixels to draw on every frame. Raising the resolution costs frame rate everywhere, especially in browser builds. Pick the smallest resolution that suits your art, and test the resize plugin's behavior on the platform you will ship to.

### Scene transitions and screen effects

Transition, tint and weather effects are most expensive when they touch many pixels or create many sprites at once. Check whether the cost happens only at the start of the effect (setup) or throughout (per-frame). Reduce particle counts, shorten the effect or use a simpler one on low-end targets.

## Set the load order right

The order of plugins in the Plugin Manager is the order they load when the game starts. A [guide to installing and using plugins in RPG Maker](https://forum.rmplanet.com/threads/how-to-install-use-plugins-in-rpg-maker.591/) points out that order can matter, and that some authors ship a core plugin that must sit above their other plugins. It also suggests changing the order as a simple fix when two plugins conflict.

A practical order for most projects:

1. Core and library plugins first, along with anything a plugin's own help text says must be above it.
2. Engine-wide changes next: resolution, screen, input, save systems.
3. Gameplay systems after that: battle, menu, movement.
4. Visual effects and add-ons last: lighting, weather, transitions.
5. Small patches and fixes at the bottom, so they can override what is above them.

Always read the plugin's help section in the Plugin Manager. It will say if the plugin needs another one, and where it should sit. Also check that a plugin supports your engine version. A plugin written for MV may need changes to run in MZ, so use the version built for your engine.

## Trim the stack

Every plugin you install has a cost, even if it is small. Once you have fixed the worst offender, ask of each remaining plugin whether the game really needs it. Two plugins that overlap in function should become one. A plugin used in one cutscene should not run on every map if it can be turned off.

This is where modular plugins pay off. When each plugin does one thing, you add only the capability you need and can remove it without breaking something else. That is the idea behind our library of MV and MZ plugins, minigames and generators: you pick the specific feature, from animated travel scenes to multiplayer, without loading a large all-in-one system.

## Clean up the rest of the project

Plugins are only part of performance. While you are testing, check these too:

- **Parallel process events** run every frame. Add a switch to stop them when they are done, or use autorun events or common events triggered only when needed.
- **Events per map**: split very large maps and remove events that do nothing.
- **Image and audio file size**: oversized images take memory and load time. Export images at the size you use, and compress audio sensibly.
- **Target device**: test on the weakest hardware you expect players to have, including browsers and mobile if you ship there.

## Test after each change

Optimization without measurement is guesswork. Change one thing, then run exactly the same test as your baseline: same scene, same route, same device, same plugin settings. Compare the FPS and note whether the stutter moved.

![Test after each change](https://media.babylovegrowth.ai/blog-images/organization-61610/1795079011850_Test-after-each-change.jpeg)

The profiling walkthrough mentioned above reports measured times for two costly functions dropping from 7,854.3 ms to 1,564.0 ms and from 4,297.6 ms to 915.8 ms after optimization, with a better frame rate on an iPad. The numbers are specific to that project, but the method is what to copy: measure, change, measure again.

Then make sure the game still works. A quick regression pass:

1. Run through the scene you optimized and trigger every plugin command in it.
2. Save and load, in the scene and on the title screen.
3. Start a battle, open the menu, and open a message window.
4. Test the build you will ship, not just the editor playtest.
5. Keep a copy of the project before each round so you can go back.

## Our perspective

> We built our library around one belief: a game runs best when every feature in it is there on purpose. Our 900+ plugins for RPG Maker MV and MZ are modular, so you can add a single capability, such as animated travel scenes, a minigame or multiplayer, without taking on a whole framework.
>
> That matters for performance. When you can add and remove features one at a time, the isolation test in this guide takes minutes instead of hours. You know what each plugin is for, you can switch it off, and you can see exactly what it costs.
>
> It also matters for people who do not code. Hobbyists, educators and small studios should not need to read JavaScript to keep a project healthy. Plugin Manager checkboxes, a baseline from F2 and a methodical on-and-off test are enough to find most problems.
>
> We keep updating our plugins and we answer questions from developers, and our community gives feedback that shapes what we make. If you are building an RPG that you want to run smoothly, start with the features you need and add from there.
>
> *RPG_Maker_Plugins*

## Build with plugins made for MV and MZ

If you are choosing plugins for a new project, or replacing one that slowed you down, browse our [MZ/MV plugins, minigame collection, music generators and sprite assets](https://rpg-maker-plugins.itch.io/). Each is made for RPG Maker MV and MZ and designed to be added on its own.

[![RPG_Maker_Market](https://media.babylovegrowth.ai/blog-images/organization-61610/1792828959492_rpg-maker-plugins.png)](https://rpg-maker-plugins.itch.io/)

If you want everything in one purchase, the [Lifetime Supporter Pass](https://rpg-maker-plugins.itch.io/lifetime-supporter-pass/) is a one-off 79.99 USD.

## FAQ

### How do I check my FPS in RPG Maker MZ or MV?

Press F2 while playtesting to show the FPS widget. It works in both engines. Test the scene where you see the problem, and write down the lowest number you see so you have a baseline to compare against.

### How do I know which plugin is causing lag?

Turn all plugins off in the Plugin Manager, save, and test the scene. If the game runs well, switch plugins back on in halves until the lag returns, then split that half again. If you play an MV game in a browser, the Chrome DevTools Performance panel can also show which plugin file takes the most time.

### Does plugin order affect performance?

It can. Plugins load in the order they appear in the Plugin Manager, and some need a core plugin above them. A wrong order can cause conflicts or errors, which show up as slowdowns or broken features. Follow each plugin's help text, and try reordering when two plugins clash.

### Should I use fewer plugins to make my game faster?

Usually, yes: each active plugin can add per-frame work, so removing overlap helps. Keep one plugin per job, turn off features you do not use, and add capabilities one at a time so you can see what each costs.

## Sources

- [Question about games performance, RPG Maker MZ General Discussions](https://steamcommunity.com/app/1096900/discussions/0/3878221560443686890/)
- [Tint screen and weather effect issues, RPG Maker MV Tech Support](https://steamcommunity.com/app/363890/discussions/1/1649917420731492626/)
- [RPG Maker MV official guide: plugins](https://rpgmakerofficial.com/product/mv/guide/011_001.html)
- [RPG Maker MZ official guide: installing plugins](https://rpgmakerofficial.com/product/mz/plugin/start/dounyu.html)
- [Finding heavy processing in browser-played RPG Maker MV](https://www.5ing-myway.com/rpgmaker-improve-performance/)
- [DynRPG: Rules and guidelines for plugin developers](https://rpg-maker.cherrytree.at/dynrpg/guidelines.html)
- [How to install and use plugins in RPG Maker](https://forum.rmplanet.com/threads/how-to-install-use-plugins-in-rpg-maker.591/)
- [How to fix lighting plugin slowdown in RPG Maker?](https://google.com/goto?url=CAESfAHEIkXXmZuJ4VaDwK2ZuAFYF0M1ikj-hwje8r0IlNPQGFNw3YGEFS7WZSnYRFXKTaF4IcHxp3BcMbkpZJYL6KjTpIE589u-kuNOWiTYQeGcQsJt5fitW2eMi6AJMBut-XdV0IvVZhjupfTnXpaZGOGT5xOj5GIEfyMQaqc)

Disclaimer: This article is for informational purposes only. The author is not affiliated with the creators of RPG Maker or the plugins discussed. All plugin names, trademarks, and links belong to their respective owners. The author may include links to external projects or repositories. Readers should review each project’s license and documentation before downloading or using any plugin.

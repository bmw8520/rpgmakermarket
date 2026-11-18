---
layout: post
title: "How to Create RPG Maker Cutscenes: Step-by-Step Guide"
date: 2026-11-18
description: "Learn how to create RPG Maker cutscenes with Autorun events, move routes, screen effects and switches, plus fixes for the bugs that break them."
image: "https://media.babylovegrowth.ai/blog-images/organization-61610/1794859932283_RPG-Maker-cutscene-title-card-illustration.jpeg"
tags: ["create rpg maker cutscenes"]
source: babylovegrowth
---
# How to Create RPG Maker Cutscenes: Step-by-Step Guide

![RPG Maker cutscene title card illustration](https://media.babylovegrowth.ai/blog-images/organization-61610/1794859932283_RPG-Maker-cutscene-title-card-illustration.jpeg)

You create an RPG Maker cutscene with one event set to Autorun. It hides the player, moves puppet characters with Set Movement Route, shows text, and turns itself off with a Self Switch so it never replays. Event commands cover most scenes in MV and MZ. Plugins take over where you want animated travel scenes or effects that commands handle clumsily, and our MZ/MV plugin library is built for that.

This guide walks through the whole build, from the first fade-out to the last cleanup command, and shows where beginners get stuck.

## TL;DR

- A cutscene is one Autorun event with a switch in its conditions, so it plays only when you want it to.
- Hide the player, then use empty "puppet" events and Set Movement Route to act out the scene.
- Always end with a fade-out, switch cleanup, Through OFF, a fade-in and a Self Switch so the scene does not loop.
- Most freezes come from a blocked move route with Wait for Completion on. Turn on Skip If Cannot Move.
- For animated travel scenes and effects beyond the event list, modular plugins save you the scripting.

## Table of Contents

- [What an RPG Maker cutscene actually is](#what-an-rpg-maker-cutscene-actually-is)
- [Step 1: Plan the scene before you place anything](#step-1-plan-the-scene-before-you-place-anything)
- [Step 2: Create the controller event](#step-2-create-the-controller-event)
- [Step 3: Open with a fade-out and hide the player](#step-3-open-with-a-fade-out-and-hide-the-player)
- [Step 4: Build puppet characters and place them](#step-4-build-puppet-characters-and-place-them)
- [Step 5: Move characters with Set Movement Route](#step-5-move-characters-with-set-movement-route)
- [Step 6: Add dialogue, choices and pacing](#step-6-add-dialogue-choices-and-pacing)
- [Step 7: End the scene cleanly](#step-7-end-the-scene-cleanly)
- [Triggering the scene at the right moment](#triggering-the-scene-at-the-right-moment)
- [Cutscenes that span several maps](#cutscenes-that-span-several-maps)
- [Camera, screen and picture effects](#camera-screen-and-picture-effects)
- [Troubleshooting a cutscene that misbehaves](#troubleshooting-a-cutscene-that-misbehaves)
- [Test without replaying the whole game](#test-without-replaying-the-whole-game)
- [Does your RPG Maker version change the method?](#does-your-rpg-maker-version-change-the-method)
- [When plugins do what events cannot](#when-plugins-do-what-events-cannot)
- [Our perspective: build the story, not the plumbing](#our-perspective-build-the-story-not-the-plumbing)
- [Add animated scenes faster](#add-animated-scenes-faster)
- [FAQ](#faq)
- [Sources](#sources)

## What an RPG Maker cutscene actually is

RPG Maker has no dedicated cutscene editor. A cutscene is an ordinary map event that takes control of the game for a while. The official MV documentation says scenes that advance automatically are prepared with [events that have no image](https://rpgmakerofficial.com/product/MV_Help/page/01_09_01.html), and that an event can hold up to 20 pages. Each page can have different conditions based on switches, variables or items, and the highest-numbered page whose conditions match is the one that runs.

That page system is the heart of cutscene design. Page 1 is the scene. Page 2 is the empty "already happened" state. A switch decides which page is active.

The commands you will use come from the [official MZ Event Commands list](https://rpgmakerofficial.com/product/MZ_help-en/01_10.html):

- **Message:** Show Text, Show Choices, Show Scrolling Text.
- **Game Progression:** Control Switches, Control Variables, Control Self Switch, Control Timer.
- **Flow Control:** Conditional Branch, Loop, Common Events, Label and Jump to Label.
- **Timing:** Wait.
- **Screen:** Fadeout and Fadein Screen, Tint Screen, Flash, Shake Screen, Set Weather Effect.

## Step 1: Plan the scene before you place anything

Write the scene as a list of beats: who enters, who speaks, what moves, what changes on screen. A twenty-second scene can easily need forty commands, and it is much easier to fix a list than a half-built event.

Decide three things up front:

1. **Where it triggers.** A new map, a door, a story flag.
2. **Which characters appear.** Each one needs its own event on the map.
3. **How it ends.** The player needs control back, in the right place, with the scene locked from replaying.

If you are teaching with your game, as many educators do, the same planning applies. A history lesson or a STEM puzzle intro is a scene with a clear beginning and end, so list the beats before you build.

## Step 2: Create the controller event

The [official RPG Maker blog's Cutscene Basics tutorial](https://www.rpgmakerweb.com/blog/cutscene-basics) recommends one event for the whole scene, set to Autorun, rather than spreading it across parallel processes and many switches. The Autorun trigger [runs the event as soon as it appears](https://rpgmakerofficial.com/product/MZ_help-en/01_09_03.html) once its conditions are met. Parallel, by contrast, keeps repeating its contents while other events run, which is the wrong tool for a scene that must run once, in order.

To set it up:

1. Place a new event on the map, usually in a corner, with no image.
2. Set the trigger to **Autorun**.
3. Under Conditions, tick a Switch (for example, "Intro Scene Ready").

That condition matters. An Autorun with blank conditions plays the moment the player enters the map, which is fine for an intro and a bug for anything else. A [forum answer on timing a cutscene](https://rpgmakerchat.com/threads/how-to-make-a-cutscene-happen-only-at-a-certain-point.172292/) suggests turning the switch ON at the moment you want the scene unlocked, such as inside the event that adds a character to the party.

## Step 3: Open with a fade-out and hide the player

Start the event list with **Fadeout Screen**. It hides the setup that follows. Then use **Set Movement Route** on the Player with **Through ON** and **Transparent ON**, as the Cutscene Basics tutorial instructs. The player can now stand anywhere without blocking the scene, and cannot be seen.

This is also where many beginners trip. If you hide the player but forget to reverse it, the player walks around invisible and ghosting through walls after the scene. We cover the cleanup in Step 7.

## Step 4: Build puppet characters and place them

Puppets are extra events that look like characters but do nothing on their own. Give each a clear name such as "Reid - Cutscene" so you can find it in a busy map. The older [rpgmaker.net cutscene tutorial](https://www.rpgmaker.net/tutorials/200/) describes the same idea in three steps: build the background, add named character events, then add an auto-start event with no sprite that holds all the text, movement, tints and flashes.

To put a puppet where the player stood, use **Set Event Location**. Cutscene Basics does exactly this to move a sprite to the player's position before animating it. If your party has more members, you can reuse their graphics on puppets so the scene matches what the player has been seeing.

## Step 5: Move characters with Set Movement Route

Use **Set Movement Route** inside the controller event. This is a command that plays on cue, and it is different from the Autonomous Movement setting on an individual event. A [forum reply on conversation cutscenes](https://forums.rpgmakerweb.com/threads/conversation-cutscenes.151266/) points out that autonomous movement cannot reliably sequence a scene, while a move route inside the Autorun can.

The [MZ Movement Route Settings page](https://rpgmakerofficial.com/product/MZ_help-en/01_10_06_01.html) describes what a route can contain:

- Move Down, Left, Right and Up.
- Jump, with X and Y offsets from -100 to 100.
- Wait, from 1 to 999 frames, where one frame is 1/60 of a second.
- Turn and face commands.
- Switch ON and OFF.

Three options decide how the scene behaves:

| Option | What it does | When to use it |
|---|---|---|
| Wait for Completion | The scene pauses until the move finishes | Almost always, so lines of dialogue land after the walk |
| Skip If Cannot Move | The move is skipped when blocked | Whenever the path might be obstructed |
| Repeat Movements | The route loops | Rarely in a cutscene |

The Cutscene Basics example includes a nice detail. A dog's route runs at speed 5 and frequency 5, moves six tiles down and six right, and plays a bark sound effect three times in the route so the audio lines up with the movement. Put sound effects inside the route, not as separate commands, when timing matters.

When a character leaves the map, the same tutorial turns on Through ON and Transparent ON on the last tile before a transfer, so the sprite vanishes instead of getting stuck.

## Step 6: Add dialogue, choices and pacing

Show Text commands go between movement commands. Because a Wait for Completion route finishes before the next command runs, you get natural beats: walk, stop, speak, walk again.

For characters who must move at the same time, leave Wait for Completion off on the first route so the next route starts immediately. Then turn it on for the last route in the group so the scene waits for everyone. The forum thread above also notes that timing problems can be solved by spacing routes out or holding them with dialogue boxes.

A few pacing habits help:

- Insert a short **Wait** before a reveal. Ten frames feels like a pause. Sixty is a full second.
- Use **Tint Screen** or **Flash** to mark a change of mood. These are listed in the official command set, along with Shake Screen and weather effects.
- Keep lines short. A cutscene with one long text box per character reads like a wall, so split it up.

## Step 7: End the scene cleanly

The ending is where most replay bugs come from. The Cutscene Basics closing sequence is:

1. **Fadeout Screen.**
2. Turn off any switches used only for the scene.
3. Set Movement Route on the Player: **Through OFF** and **Transparent OFF**.
4. Optionally **Transfer Player** to where the scene should end.
5. **Fadein Screen.**
6. Turn on **Self Switch A** (or another switch or variable) so the Autorun does not fire again.

Then add a second event page conditioned on Self Switch A being ON, and leave it empty. The [beginner's guide on the forum archive](https://rpgmakerchat.com/threads/a-beginners-guide-to-cutscenes.15655/) describes this same pattern: flip a Self Switch at the end, add a second page conditioned on it, and the scene plays once.

If a scene has to be replayable, such as a recap in a classroom game, use a variable instead and reset it when needed.

## Triggering the scene at the right moment

The controller's switch is your trigger. Common patterns:

- **Story beat:** an earlier event turns the switch ON after a boss, a letter or a dialogue choice.
- **Item-based:** tick the Item condition so the scene starts once the player holds a key item.
- **Variable-based:** use a plot variable that rises as the story progresses.

The [official MZ lesson on simple intro cutscenes](https://rpgmakerofficial.com/product/MZ_help-en/01_09_03.html) is not needed here. The page-condition system already covers it: pick the condition, and the highest matching page runs.

## Cutscenes that span several maps

Events can only control other events on the same map. So if a scene crosses maps, you need a controller event on each one. The official blog's [multi-map cutscene guide](https://www.rpgmakerweb.com/blog/cutscenes-across-multiple-maps) shows a three-map scene. The first map's Autorun fades out, raises a plot variable by 1 and transfers the player. On Map 3, page 2 is conditioned on that variable being 3 or higher.

![Three-map cutscene controlled by a plot variable](https://media.babylovegrowth.ai/blog-images/organization-61610/1794859958370_Three-map-cutscene-controlled-by-a-plot-variable.jpeg)

The principle: each map checks the variable and runs only its part. Fade out before every transfer and fade in after it, so the player never sees an unfinished room.

## Camera, screen and picture effects

MV and MZ give you several tools beyond movement:

- **Tint Screen** for a color wash, such as a sunset or a cold blue night.
- **Flash** for lightning or magic.
- **Shake Screen** for impacts and earthquakes.
- **Set Weather Effect** for rain, snow or storms.
- **Show Picture**, which is how you build title cards, portraits and letterbox bars.

The [MZ Picture documentation](https://rpgmakerofficial.com/product/MZ_help-en/01_10_08.html) lists the numbers: pictures are numbered 1 to 100, X and Y positions run from -9999 to 9999, scale runs from -2000 to 2000 percent (negative values flip the image), and opacity goes from 0 to 255. Move Picture adds easing choices: Fixed Speed, Start slow, Stop slow, and Start slow and stop slow. Easing is what makes a slide-in look cinematic instead of mechanical.

Older versions had a dedicated Pan Screen command, as the [RM2K/3 tutorial](https://www.rpgmaker.net/tutorials/200/) notes. In MV and MZ, pictures and scroll-based tricks fill that gap.

## Troubleshooting a cutscene that misbehaves

**The game freezes mid-scene.** Check for a move route with Wait for Completion that cannot finish. The [MZ Movement help](https://rpgmakerofficial.com/product/MZ_help-en/01_10_06.html) explains that a character who hits an obstacle with Wait for Completion on stops at that point, so enable Skip If Cannot Move. Clear the path too, and watch for other events standing in the way.

**The scene loops forever.** An Autorun whose conditions never change repeats. Add the Self Switch and empty second page from Step 7.

**The scene never triggers.** Look at the controller's switch. Is it ON? Is the trigger set to Autorun and not Action? Does a higher-numbered page with different conditions override it?

**A character will not move.** One [solved forum thread](https://forums.rpgmakerweb.com/threads/character-in-cutscene-wont-move-solved.161726/) traced it to an odd placement bug. Copying the event, placing it one square down and adjusting its routes fixed it.

## Test without replaying the whole game

Restarting from the title screen each time wastes hours. The official guild's [thread on testing cutscenes](https://guild.rpgmakerofficial.com/t/topic/3071?tl=en) lists practical options:

- Move the player's starting position just before the scene.
- Keep a dedicated save file with the right switches set.
- Add a temporary event that sets switches and variables.
- Use a dev map.
- For a single-page scene, add a temporary Transfer command at the top, test with Ctrl+R, then delete it.

## Does your RPG Maker version change the method?

The logic of events, switches and routes carries across versions. What changes is scripting. [RPG Maker's 2025 comparison guide](https://store.rpgmakerofficial.com/blogs/news/beginner-s-guide-comprehensive-comparison-of-rpg-maker-series-2025-edition-en) notes that XP through VX Ace used Ruby-based RGSS, scripting moved to JavaScript from MV, and MZ (2020) added map layering, auto-save and 2D/3D particle animation, and can import MV data without its plugins. This guide's menu names follow MV and MZ.

## When plugins do what events cannot

Event commands are enough for talking heads, walks and fades. They get heavy when you want a travel sequence with a moving map, an animated overview or something that must be reused in dozens of scenes. Building that by hand means hundreds of commands per scene.

That is where modular plugins pay off. Our MZ/MV library has more than 900 downloadable plugins, including animated travel scenes you add without extensive coding. Because the plugins are modular, you add only the capability you need and keep your own event-based scenes exactly as built here.

## Our perspective: build the story, not the plumbing

> Every game we see started with a story, not a plugin list. The cutscene is where that story first reaches the player, so the build should be fast enough that you keep your energy for writing.
>
> That is why we focus on modularity. Our plugins for RPG Maker MV and MZ are made so you can add one feature, such as an animated travel scene, without rewriting the rest of your project. You still use the event system for the heart of your scenes. We take care of the repetitive heavy lifting around it.
>
> Hobbyists, educators and small studios all tell the same story: time is the scarce resource. Use the pattern in this guide for the scene logic, then let a ready-made module carry the parts you do not want to build twice.
>
> *RPG_Maker_Plugins*

## Add animated scenes faster

If your scenes call for travel sequences, minigame breaks or background music that fits, start with the [RPG Maker Plugins library](https://rpg-maker-plugins.itch.io/). It covers MZ and MV plugins, background music generators, an MZ minigame collection and tilesheet and sprite bundles.

[![RPG_Maker_Market](https://media.babylovegrowth.ai/blog-images/organization-61610/1792828959492_rpg-maker-plugins.png)](https://rpg-maker-plugins.itch.io/)

If you want everything in one purchase, the [Lifetime Supporter Pass](https://rpg-maker-plugins.itch.io/lifetime-supporter-pass/) is listed at a one-off $79.99.

## FAQ

### Can I make a cutscene without any plugins?

Yes. A single Autorun event with Set Movement Route, Show Text, screen commands and a Self Switch is a complete cutscene in MV or MZ. Plugins are for effects that would take far too many commands to build by hand.

### Why does my cutscene play as soon as I enter the map?

An Autorun event with no conditions runs as soon as it appears. Put a switch in its Conditions and turn that switch ON when the scene should unlock.

### How do I stop a cutscene from repeating?

End it by turning on a Self Switch, then add a second event page conditioned on that Self Switch with no commands. The highest-numbered page whose conditions match is the one that runs, so the empty page takes over.

### Why does my game freeze during a character move?

Usually a move route with Wait for Completion is blocked by terrain or another event. Turn on Skip If Cannot Move and clear the path.

## Sources

- [Cutscene Basics, The Official RPG Maker Blog](https://www.rpgmakerweb.com/blog/cutscene-basics)
- [Cutscenes Across Multiple Maps, The Official RPG Maker Blog](https://www.rpgmakerweb.com/blog/cutscenes-across-multiple-maps)
- [Event Commands, RPG Maker MZ Help](https://rpgmakerofficial.com/product/MZ_help-en/01_10.html)
- [Map Event System, RPG Maker MV Help](https://rpgmakerofficial.com/product/MV_Help/page/01_09_01.html)
- [Map Event Settings, RPG Maker MZ Help](https://rpgmakerofficial.com/product/MZ_help-en/01_09_03.html)
- [Movement Route Settings, RPG Maker MZ Help](https://rpgmakerofficial.com/product/MZ_help-en/01_10_06_01.html)
- [Movement, RPG Maker MZ Help](https://rpgmakerofficial.com/product/MZ_help-en/01_10_06.html)
- [Picture, RPG Maker MZ Help](https://rpgmakerofficial.com/product/MZ_help-en/01_10_08.html)
- [The BASICS of making a cutscene, rpgmaker.net](https://www.rpgmaker.net/tutorials/200/)
- [How to make a cutscene happen only at a certain point, RPG Maker Forum Archive](https://rpgmakerchat.com/threads/how-to-make-a-cutscene-happen-only-at-a-certain-point.172292/)
- [A Beginner's Guide To Cutscenes, RPG Maker Forum Archive](https://rpgmakerchat.com/threads/a-beginners-guide-to-cutscenes.15655/)
- [Conversation Cutscenes, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/conversation-cutscenes.151266/)
- [Character in cutscene won't move, RPG Maker Forums](https://forums.rpgmakerweb.com/threads/character-in-cutscene-wont-move-solved.161726/)
- [About testing cutscenes and quests, RPG Maker Guild](https://guild.rpgmakerofficial.com/t/topic/3071?tl=en)
- [Beginner's Guide: Comprehensive Comparison of RPG Maker, 2025 Edition](https://store.rpgmakerofficial.com/blogs/news/beginner-s-guide-comprehensive-comparison-of-rpg-maker-series-2025-edition-en)

Disclaimer: This article is for informational purposes only. The author is not affiliated with the creators of RPG Maker or the plugins discussed. All plugin names, trademarks, and links belong to their respective owners. The author may include links to external projects or repositories. Readers should review each project’s license and documentation before downloading or using any plugin.

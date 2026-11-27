---
layout: post
title: "RPG Maker MZ Tilesets: Where to Get Them and How to Use Them"
date: 2026-11-27
description: "Compare your RPG Maker MZ tileset options: build your own with Tileforge, use free community sets, or buy packs. Includes sheet slots, animations and licensing."
image: "https://media.ai-fast-cdn.com/blog-images/organization-61610/1795594343263_Hand-drawn-pixel-tile-motifs-frame-a-clear-center.jpeg"
tags: ["rpg maker mz tileset"]
source: babylovegrowth
---
# RPG Maker MZ Tilesets: Where to Get Them and How to Use Them

![Hand-drawn pixel tile motifs frame a clear center](https://media.ai-fast-cdn.com/blog-images/organization-61610/1795594343263_Hand-drawn-pixel-tile-motifs-frame-a-clear-center.jpeg)

The fastest way to a map that doesn't look like every other RPG Maker game is to build your own tilesets instead of hunting for packs that almost fit. That's why [Tileforge, our tileset builder](https://rpg-maker-plugins.itch.io/tileforge/), comes first below. It was made by a developer who got tired of buying asset packs. This guide covers every route to a tileset in RPG Maker MZ: building, free community sets, bought packs and hand-drawn art. It also covers how sheets fit the engine, what to know about licenses, and how tile animation works in MZ and MV.

## TL;DR

- MZ and MV share one tileset standard: 48x48 tiles and a fixed set of sheet slots (A1 to A5, B to E). A sheet only works in the slot it was made for.
- Building tilesets with [Tileforge](https://rpg-maker-plugins.itch.io/tileforge/) keeps your maps consistent and spares you from stitching mismatched packs together.
- Free community tilesets exist, but each comes with its own terms: credit, no reposting edits, sometimes proof you own a specific RPG Maker version.
- Animated water, fire and other moving tiles live in the A1 slot, and [Tile Animation Forge](https://rpg-maker-plugins.itch.io/tile-animation-forge/) is our MZ/MV plugin for tile animation.
- Battle animations are a separate system: MZ uses Effekseer, MV uses its own sprite-sheet animations.

## Table of Contents

- [How MZ tilesets actually work](#how-mz-tilesets-actually-work)
- [Your options, compared](#your-options-compared)
- [Importing a tileset into MZ](#importing-a-tileset-into-mz)
- [Customizing your tileset](#customizing-your-tileset)
- [Animated tiles and battle animations](#animated-tiles-and-battle-animations)
- [Licensing: what you need to check](#licensing-what-you-need-to-check)
- [Why build instead of collecting](#why-build-instead-of-collecting)
- [Get started with our tools](#get-started-with-our-tools)
- [FAQ](#faq)
- [Sources](#sources)

## How MZ tilesets actually work

Before you compare sources, know what the engine expects. A tileset in RPG Maker is a set of image sheets assigned to slots in the database. Each slot has a job.

Per [the community's summary of the MV/MZ standard](https://forums.rpgmakerweb.com/threads/anyone-have-an-mz-tileset-template.126852/), both engines use 48x48 tiles and share the same tileset format:

| Slot | What it holds |
|---|---|
| A1 | Animated tiles such as water |
| A2 | Ground tiles (grass, dirt, sand) |
| A3 | Building roofs, walls and floors |
| A4 | Dungeon roofs and walls |
| A5 | Plain tiles without autotile behavior |
| B to E | Decoration and object tiles you place on top |

The same thread makes a point that trips up many beginners: each template fits only one slot. Put an A5 sheet into the A1 slot and the engine scrambles the tiles. So "a tileset" is never one file. It's up to nine sheets that must each follow their slot's layout.

That is the real cost of mixing sources. Pack one gives you A2 ground in one art style. Pack two gives you B objects in another. Neither has the A4 walls you need. You end up redrawing, resizing and rearranging, and the map still looks patched together.

A quick rule on scaling: if you open an imported sheet in an art program and change its resolution, [community advice](https://google.com/goto?url=CAESkAEBxCJF1570eqHWA9YSlIGhH6ojWEUv6zA69ZBTW3E5fSnIPvkj6rlHRTo8X_ISz1pf6u3ZCZsyGGzpJxMdpsJm7J4841FISi5WiyKtKRui1T-RjIliX2RZvhWytOEwbiOAmuzpP19tLmC3Xg_IWMQeffk7TBY_J3TVcBfvJIBVHTzr2fJ3R454m51J-p4bzqQ&gsessionid=0A7KBG_RY-EYLHBKwMAzcZ05nzTcuD_Zlf6NjobUtDGD7UrB4GufzA) is to use nearest-neighbor resizing, so pixel edges stay crisp instead of blurring.

## Your options, compared

There are four realistic routes. Here is how they compare on what matters for a small project.

| Option | Style consistency | Customization | Cost model | Best for |
|---|---|---|---|---|
| Tileforge (tileset builder) | One look across your sheets | You build the tiles you need | One-time purchase from our itch.io store | Indie devs and small studios who want a matching, original look |
| Free community tilesets | Varies by creator | Often limited by the terms | Free, with credit rules | Prototypes and jam games |
| Commercial asset packs | Consistent inside a pack | Limited to what the pack contains | Per pack | A single themed area |
| Drawing your own in a pixel editor | Fully yours | Unlimited | Your time | Artists with spare hours |

Our pick is Tileforge for most readers, and the reasons follow.

### Tileforge: build the set you need

[Tileforge](https://rpg-maker-plugins.itch.io/tileforge/) is our tileset builder for RPG Maker. Its listing title says why it exists: "I got tired of buying Asset Packs." It comes from the same store as our library of over 900 downloadable plugins for MV and MZ, so it sits beside the tools you already use.

The argument for building is simple. You are making a game, not a collection. When every sheet comes from the same builder, your grass, walls and props agree with each other. You also stop paying for a 400-tile pack to use 30 tiles from it.

This matters most for three kinds of reader:

- **Solo indie developers** who need a distinct look without hiring an artist.
- **Hobbyists** who want a quick result and don't want to learn the A1-to-E slot rules the hard way.
- **Educators** building a themed map, such as a historical town for a classroom game, who need the tiles to match the lesson and not whatever a pack happens to offer.

Our modular approach is the same across the store: add the capability you need without writing code. Tileforge follows that idea for map art.

### Free community tilesets

Free sets are a good way to start a prototype. The best-known examples come from the RPG Maker forums, where creators post resources for others. The terms are the catch, and they differ by creator.

Take Avery's resource thread. According to [the thread](https://forums.rpgmakerweb.com/threads/avys-mv-stuff.53317/), the terms allow commercial and non-commercial use if the creator receives a free copy of the game. Editing is allowed for personal use, reposting edits needs permission, credit goes to Avery, and you must own RPG Maker MV. The thread was last edited on March 16, 2020, so check the page itself for the current wording.

Avery's later thread on converting VX Ace tiles to MV and MZ [says the conversions were reworked by hand](https://forums.rpgmakerweb.com/threads/100-avys-tile-conversions-vx-ace-to-mv-mz.165302/) rather than automatically upscaled, with tiles arranged to match their Ace counterparts. It was opened January 31, 2024. Its terms again require credit, ownership of RPG Maker VX Ace, and no reposting of edits without permission.

Three practical points follow from this:

1. **Read the terms before you build maps around a set.** Ripping out a tileset late in a project means redoing every map.
2. **Keep a credits file from day one.** Most free sets require credit, and tracking it later is tedious.
3. **Mixed sources mean mixed styles.** A free set that covers outdoor ground rarely covers interiors, and you'll want one look across the game.

If you want assets under standard open licenses, itch.io lets you browse by license. For example, here are [assets under Creative Commons Attribution-ShareAlike 4.0](https://www.itch.io/games/assets-cc4-by-sa/) and [assets under the NonCommercial variant](https://www.itch.io/games/assets-cc4-by-nc/). The NonCommercial ones are not suitable if you plan to sell your game. Check each asset's page for what it covers and whether it fits RPG Maker's sheet layout.

### Commercial asset packs

Paid packs from tileset artists are polished and consistent inside the pack. They're a fit when your whole game matches one pack's theme. Problems start when your project needs something the pack lacks: a desert interior, a sci-fi door, a seasonal variant. At that point you're buying a second pack in a different style or drawing the missing tiles yourself.

The official RPG Maker blog regularly [lists new tilesets from third-party creators](https://google.com/goto?url=CAESegHEIkXXUxB3A4L4BC-_Sknro05kPk2z_6HgLbW6oXDERm_FLlb7cl6yBZwLIWbdwmC7QTS1j0mTeafJu9RMC8O6I9zPbPgSsw_QhGa7m3CSBFM-ftaCSykaU1h49OW6JZ_DSw7gkAy8l06JAZmUyaEQX4xhkC_2Tp-w&gsessionid=0A7KBG_RY-EYLHBKwMAzcZ05nzTcuD_Zlf6NjobUtDGD7UrB4GufzA), including expansions of existing series. Prices vary by pack and change often, so read the store page on the day you buy.

### Drawing your own

Many developers draw tiles in Aseprite, LibreSprite or Krita, as discussed in [this community thread](https://google.com/goto?url=CAESoQEBxCJF13Ui-WafFTNheXHcx29OUP7nzWlMxpcgnrzyXrw37tlMT2xr9yEhcnkvKYQ7xZBEaCsdpskHDBhluMJB0fvSKo_eXWCS7QrVIyTTyf8xhdgZUdkJlnkfVczLhbhCzhzET-bYV_kNxLhrDC15lGVw28Xo7jSZtP_dMQmbF3VjH0GWTXgJC9t7p7YZxjFsUynvlA-x9mFkwWOuiEhKLA&gsessionid=0A7KBG_RY-EYLHBKwMAzcZ05nzTcuD_Zlf6NjobUtDGD7UrB4GufzA). It gives total control, and it's also the slowest path. You have to learn the slot layouts, keep autotile edges seamless and finish nine sheets. If speed matters, a builder like Tileforge takes the layout work off your plate.

## Importing a tileset into MZ

Whichever source you pick, the import routine is the same.

1. **Put the sheets in the project.** Copy your images into the project's tileset image folder. Keep file names clear: the slot letter in the name saves confusion later.
2. **Create or open a tileset in the database.** In the Tilesets tab, make a new tileset entry and name it for the area it serves (Forest, Castle Interior).
3. **Assign each sheet to its slot.** A1 to A5, then B to E. Remember that a sheet made for A2 will break if you assign it to A1.
4. **Set passability and other flags.** Mark which tiles can be walked on, which block movement and which draw above characters. This step takes the longest and the most care.
5. **Apply the tileset to a map.** Open the map's properties and select the tileset. Place a few tiles and walk through the map to test edges and collisions.

Two things go wrong most often. A sheet in the wrong slot looks scrambled. And a sheet resized without nearest-neighbor scaling looks blurry. Both are easier to avoid when your tiles come from one tool that outputs to the layout the engine expects.

### Moving a project from MV to MZ

If you started in MV, tilesets carry across. The [MV data conversion notes](https://rmmz.neocities.org/01_01_01_02) say to back up the MV project, create a new MZ project, and copy the relevant data and image folders. Tileset images and Tilesets.json are among the files copied, and conversion happens when you launch MZ with that data. The notes also warn that MZ has no animations folder by default, so you must copy MV's animations folder yourself.

![Steps for moving an MV project into MZ](https://media.ai-fast-cdn.com/blog-images/organization-61610/1795594370182_Steps-for-moving-an-MV-project-into-MZ.jpeg)

## Customizing your tileset

The question "what can I change?" has a different answer for each route.

- With a free set, you can usually edit for personal use but not repost the edit. That limits what you can share with teammates or ship in a template.
- With a bought pack, the license is the limit, and you often can't redistribute the art.
- With tiles you build yourself, you decide the palette, the theme and the variations, and you can adjust them as the game grows.

For small studios, that last point is practical. A late design change, such as a new region or a recolor for a night version of a town, is a small edit instead of a new purchase. Tileforge was built for that way of working.

## Animated tiles and battle animations

Searchers asking about MZ and MV animations usually mean one of two things, and they work differently.

### Animated map tiles

Water ripples, lava and waterfalls are animated tiles in the A1 slot. If you want more motion on your map than the standard set provides, [Tile Animation Forge](https://rpg-maker-plugins.itch.io/tile-animation-forge/) is our plugin for MZ and MV tile animation. Because it supports both engines, a project that moves from MV to MZ doesn't need a new tool.

[![Tile Animation Forge (MZ/MV)](https://media.ai-fast-cdn.com/blog-images/organization-61610/1795594291863_tile-animation-forge-mzmv.png)](https://rpg-maker-plugins.itch.io/tile-animation-forge/)

### Battle and skill animations

These are a different system. MV animations are made in the editor's animation tab from sprite sheets. MZ switched to Effekseer, a separate effects tool. One forum discussion on [making pixel-style animations in MZ](https://forums.rpgmakerweb.com/threads/effekseer-or-mv-to-create-pixel-style-animations-in-mz-most-efficiently.131772/) says Effekseer can match MV for speed but has a learning curve, and that you can build a sprite sheet in MV and bring it into Effekseer for MZ. The takeaway for a small team: decide early which animation workflow you'll use, because moving them across later means rework, and MZ's missing animations folder is the first thing to check.

## Licensing: what you need to check

Whether you're selling your game or using it in a classroom, the same four checks apply to every tileset:

- **Commercial use:** is it allowed, and under what condition?
- **Credit:** what exact text is required, and where?
- **Editing and redistribution:** may you edit, and may you share edits?
- **Engine ownership:** some sets require you to own a particular RPG Maker version, as the Avery terms above do.

Educators have a particular reason to care. A classroom game shared with students and other teachers is a form of distribution, so a set that bans reposting edits can cause trouble. Our store also offers whitelabel-ready resources for commercial use or resale, so you can see the licensing path before you build around anything.

## Why build instead of collecting

We made Tileforge because collecting packs is slow and expensive for what it delivers. Packs come in a style, and your game needs its own. When you build the set, you decide the palette, the sheets match the slots from the start, and the whole game reads as one world.

> We build tools so you can spend your time on your game, not on stitching assets together. Our store has over 900 downloadable plugins for RPG Maker MV and MZ, and our modular approach means you add only the capability you need, without extensive coding. Tileforge started because we were tired of buying asset packs that almost fit. A tileset you build matches your slots, your palette and your game. Tile Animation Forge adds motion to those maps, and both work in the same workflow as the rest of our plugins.
>
> Our advice to a new developer: pick your tile size and look first, build one complete tileset for your starting area, then expand. A single consistent set beats five half-matching packs every time.
>
> *RPG_Maker_Plugins*

## Get started with our tools

Our store covers MZ and MV plugins, background music generators, an MZ minigame collection, and tilesheets, sprite assets and bundles. For tilesets, start with [Tileforge](https://rpg-maker-plugins.itch.io/tileforge/), then add [Tile Animation Forge](https://rpg-maker-plugins.itch.io/tile-animation-forge/) when you want your maps to move.

[![Tile Animation Forge (MZ/MV)](https://media.ai-fast-cdn.com/blog-images/organization-61610/1795594458532_Tile-Animation-Forge-MZ-MV-and-2-more-products.jpeg)](https://rpg-maker-plugins.itch.io/tile-animation-forge/)

If you plan to use many tools over time, the [Lifetime Supporter Pass](https://rpg-maker-plugins.itch.io/lifetime-supporter-pass/) is a 79.99 USD one-off purchase. You can browse everything on the [RPG Maker Plugins store](https://rpg-maker-plugins.itch.io/).

## FAQ

### Are RPG Maker MV tilesets compatible with MZ?

Yes. Both engines use 48x48 tiles and the same slot layout, so MV tileset sheets work in MZ. When you convert a whole project, the [conversion notes](https://rmmz.neocities.org/01_01_01_02) list tileset images and Tilesets.json among the data to copy. Remember to copy the animations folder too.

### Can I use free tilesets in a commercial game?

It depends on each creator's terms. Avery's posted terms, for example, allow commercial use if the creator receives a free copy of the game, with credit required. Read the license on every set you use and keep a credits list.

### Why do my tiles look scrambled in the editor?

The most common cause is a sheet in the wrong slot. Each template works for only one slot, so an A5 sheet placed in A1 will break. Check the slot, then check the sheet's size and layout.

### Do MV animations work in MZ?

Not automatically. MZ uses Effekseer for animations, and MV's animations folder has to be copied over manually when you convert a project. Plan your animation workflow before you build a large library of effects.

### What's the quickest way to get a matching tileset?

Building the sheets with one tool. Tileforge is our tileset builder for RPG Maker, made so you don't have to piece together packs in different styles.

## Sources

- [Anyone have an MZ Tileset Template? | RPG Maker Forums](https://forums.rpgmakerweb.com/threads/anyone-have-an-mz-tileset-template.126852/)
- [Tileset problemi in RPG Maker MZ | r/RPGMaker](https://google.com/goto?url=CAESkAEBxCJF1570eqHWA9YSlIGhH6ojWEUv6zA69ZBTW3E5fSnIPvkj6rlHRTo8X_ISz1pf6u3ZCZsyGGzpJxMdpsJm7J4841FISi5WiyKtKRui1T-RjIliX2RZvhWytOEwbiOAmuzpP19tLmC3Xg_IWMQeffk7TBY_J3TVcBfvJIBVHTzr2fJ3R454m51J-p4bzqQ&gsessionid=0A7KBG_RY-EYLHBKwMAzcZ05nzTcuD_Zlf6NjobUtDGD7UrB4GufzA)
- [Avy's MV Stuff | RPG Maker Forums](https://forums.rpgmakerweb.com/threads/avys-mv-stuff.53317/)
- [Avy's Tile conversions, (VX/)Ace to (MV/)MZ | RPG Maker Forums](https://forums.rpgmakerweb.com/threads/100-avys-tile-conversions-vx-ace-to-mv-mz.165302/)
- [Resources | The Official RPG Maker Blog](https://google.com/goto?url=CAESegHEIkXXUxB3A4L4BC-_Sknro05kPk2z_6HgLbW6oXDERm_FLlb7cl6yBZwLIWbdwmC7QTS1j0mTeafJu9RMC8O6I9zPbPgSsw_QhGa7m3CSBFM-ftaCSykaU1h49OW6JZ_DSw7gkAy8l06JAZmUyaEQX4xhkC_2Tp-w&gsessionid=0A7KBG_RY-EYLHBKwMAzcZ05nzTcuD_Zlf6NjobUtDGD7UrB4GufzA)
- [Planning to create my own tilesets for MV/MZ | RPG Maker Forums](https://google.com/goto?url=CAESoQEBxCJF13Ui-WafFTNheXHcx29OUP7nzWlMxpcgnrzyXrw37tlMT2xr9yEhcnkvKYQ7xZBEaCsdpskHDBhluMJB0fvSKo_eXWCS7QrVIyTTyf8xhdgZUdkJlnkfVczLhbhCzhzET-bYV_kNxLhrDC15lGVw28Xo7jSZtP_dMQmbF3VjH0GWTXgJC9t7p7YZxjFsUynvlA-x9mFkwWOuiEhKLA&gsessionid=0A7KBG_RY-EYLHBKwMAzcZ05nzTcuD_Zlf6NjobUtDGD7UrB4GufzA)
- [MV Data Conversion | RPG Maker MZ documentation](https://rmmz.neocities.org/01_01_01_02)
- [Effekseer or MV to create pixel-style animations in MZ | RPG Maker Forums](https://forums.rpgmakerweb.com/threads/effekseer-or-mv-to-create-pixel-style-animations-in-mz-most-efficiently.131772/)

Disclaimer: This article is for informational purposes only. The author is not affiliated with the creators of RPG Maker or the plugins discussed. All plugin names, trademarks, and links belong to their respective owners. The author may include links to external projects or repositories. Readers should review each project’s license and documentation before downloading or using any plugin.

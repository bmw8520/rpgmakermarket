---
layout: post
title: "RPG Maker Color Codes: The \\C[n] Guide for MV and MZ"
date: 2026-11-07
description: "Learn how RPG Maker color codes work: \\C[n] syntax, the 0–31 palette in Window.png, how to reset color, and how to add custom colors in MV and MZ."
image: "https://media.babylovegrowth.ai/blog-images/organization-61610/1793919895913_Hand-drawn-RPG-Maker-color-palette-title-card.jpeg"
tags: ["rpg maker color codes"]
source: babylovegrowth
---
# RPG Maker Color Codes: The \C[n] Guide for MV and MZ

![Hand-drawn RPG Maker color palette title card](https://media.babylovegrowth.ai/blog-images/organization-61610/1793919895913_Hand-drawn-RPG-Maker-color-palette-title-card.jpeg)

RPG Maker text color codes are control characters you type into a message. The one you want is **\C[n]**, where n is a color number from 0 to 31. Type `\C[2]` and everything after it draws in color 2. Type `\C[0]` and you're back to the default. Those numbers are not hex values. They point to little colored squares in your project's windowskin image, so you can change what "color 2" means by editing one file.

This guide shows the syntax, where the colors live, how to reset them, what changes between MV and MZ, and what to do when 32 colors aren't enough.

## TL;DR

- Use `\C[n]` before the words you want colored, and `\C[0]` after them to restore the default.
- The numbers 0 to 31 map to 32 squares in the bottom-right of `img/system/Window.png`. Edit the squares and every use of that number changes.
- Indexes 16 to 31 are largely used by menus and gauges (HP, MP, TP), so change colors at 15 or below if you only want to restyle message text.
- `FF0000` is an HTML/CSS hex color, not an RPG Maker code. RPG Maker's built-in codes take a palette number, not a hex value.
- Need more than 32 colors, or hex values in messages? A plugin can extend the palette.

## Table of Contents

- [What an RPG Maker color code actually is](#what-an-rpg-maker-color-code-actually-is)
- [The syntax, with examples](#the-syntax-with-examples)
- [Where the colors live: the windowskin](#where-the-colors-live-the-windowskin)
- [Picking a color the easy way in MZ](#picking-a-color-the-easy-way-in-mz)
- [MV vs. MZ: same codes, a few extras](#mv-vs-mz-same-codes-a-few-extras)
- [Color coding that helps players](#color-coding-that-helps-players)
- [Is FF0000 an RPG Maker color code?](#is-ff0000-an-rpg-maker-color-code)
- [When 32 colors aren't enough](#when-32-colors-arent-enough)
- [Perspective: why we build around modular text tools](#perspective-why-we-build-around-modular-text-tools)
- [Build your game faster with RPG_Maker_Plugins](#build-your-game-faster-with-rpgmakerplugins)
- [Quick troubleshooting](#quick-troubleshooting)
- [FAQ](#faq)
- [Sources](#sources)

## What an RPG Maker color code actually is

In the Show Text event command, you can mix plain words with control characters. According to the [official MV help page on Messages](https://rpgmakerofficial.com/product/MV_Help/page/01_10_01.html), `\C[n]` draws subsequent text in the nth color, and that color conforms to the contents of the Window.png system image.

So a color code is really a palette lookup:

1. You write `\C[n]` in a message.
2. The engine looks up square number n in the windowskin.
3. Text drawn after the code uses that square's color.

That's why the same code can look different from game to game. A project with a custom windowskin can show a gold `\C[14]` where another project shows pale yellow. The code never changes. The palette does.

## The syntax, with examples

The pattern is simple: open the color, type your words, close the color.

```
You found the \C[2]Flame Sword\C[0] in the chest!
```

In this line, "Flame Sword" draws in color 2 and the rest uses the default. The `\C[0]` at the end is the reset. Without it, the color carries on through the rest of the message.

A few rules of thumb:

- **Case doesn't matter for the letter C in most setups**, but stick with capital `\C` so your messages match the official documentation.
- **Always reset.** If you leave a color open, the next line in the same message stays colored.
- **Use the number, not a name.** Vanilla RPG Maker has no `\C[red]`. A plugin has to add names.
- **Keep the backslash.** A forward slash won't trigger the code, and you'll see it printed as text.

Older engines follow the same idea. The Steam Solo [miniguide for VX Ace](https://steamsolo.com/guide/miniguide-adding-color-and-icons-to-text-rpg-maker-vx-ace/) shows the pattern of coloring one word and then returning to the default with `\C[0]`, for example `\C[3]GREEN\C[0]`. The same open-and-close habit carries into MV and MZ.

### Resetting to the default color

The reliable reset is `\C[0]`. Index 0 is the color used for normal window text, so it puts the message back to how it started. In MZ, the ColorManager's `normalColor` method [returns color index 0](https://github.com/tonbijp/RPGMakerMZ/blob/master/Reference/ColorManager.md), which confirms that 0 is the baseline.

If you recolor index 0 in your windowskin, the default text color for the whole game changes. Do that on purpose, not by accident.

## Where the colors live: the windowskin

Open your project folder and find `img/system/Window.png`. In the bottom-right area you'll see a block of small squares. The Official RPG Maker Blog explains that the lower-right text colors are [32 squares of 12x12 pixels](https://www.rpgmakerweb.com/blog/what-makes-up-a-windowskin), each one a possible text color for message boxes. They also affect HP, MP and system colors in menus.

![Thirty-two indexed windowskin text color squares](https://media.babylovegrowth.ai/blog-images/organization-61610/1793919925700_Thirty-two-indexed-windowskin-text-color-squares.jpeg)

Number them from the first square as 0 and you get the palette that `\C[n]` reads. MZ's ColorManager [`textColor(n)` method](https://github.com/tonbijp/RPGMakerMZ/blob/master/Reference/ColorManager.md) returns the color for a number from 0 to 31 using the colors in that image.

For MV and MZ, the windowskin image is [1.5 times bigger in both directions](https://rpgmaker.net/articles/2751/) than the VX and VX Ace version, but it otherwise works the same way.

### Which indexes are safe to change

Not all 32 squares are free. The rpgmaker.net article on windowskins says the [first 16 can be used fairly freely](https://rpgmaker.net/articles/2751/), while some of the second 16 are reserved for system interface elements. A Japanese MV color reference makes the same recommendation: to change available text colors [without touching item names or gauge colors](https://www.5ing-myway.com/rpgmaker-mv-system-color-index/), edit index 15 or below, because 16 and above are commonly assigned to equipment, gauges and system colors.

Here's a practical way to think about it:

| Index range | Typical role | Should you edit it? |
|---|---|---|
| 0 | Default window text | Only if you want every default text to change |
| 1 to 15 | Free message colors | Yes, this is your palette for dialogue |
| 16 to 31 | System, equipment, gauge colors | Carefully, and expect menu changes |

Gauges are drawn as a gradient between two colors, per the same rpgmaker.net piece. When both colors are the same, you get a solid bar. So if your HP bar suddenly changes, you probably edited one of the gauge squares.

### Finding which color the menus use

If you want to know exactly which index a menu element uses, the Official RPG Maker Blog suggests searching the `rmmz_managers` file in your project's `js` folder for [`ColorManager.textColor`](https://www.rpgmakerweb.com/blog/what-makes-up-a-windowskin). Each hit shows which color is tied to which part of the interface. It's a ten-minute job that saves hours of guessing.

## Picking a color the easy way in MZ

You don't have to memorize the squares. In MZ, the Official RPG Maker Blog says you can right-click in a message and choose [Insert Color Index](https://www.rpgmakerweb.com/blog/what-makes-up-a-windowskin), which opens a window showing each color. Click one and the `\C[n]` code is inserted for you.

For MV, open `Window.png` in an image editor, count squares from the first, and write down the numbers. A quick reference chart in your project notes pays for itself fast.

## MV vs. MZ: same codes, a few extras

Good news: `\C[n]` works the same way in both. The official MZ guide (in Japanese) lists [`\C[n]` as the code that changes the following text to color number n](https://rpgmakerofficial.com/product/mz/guide/event/kihon.html), and notes that MZ adds three new control characters compared with MV.

The MZ help page also says the control characters, including `\C`, can be used beyond the Show Text command. They also work in [Show Choices, Actor Profile, skill and state messages, item, weapon and armor descriptions, save/load messages and battle messages](https://rpgmakerofficial.com/product/MZ_help-en/01_10_01.html). That means you can:

- Color a rare item's name inside its description.
- Highlight a status effect in a battle message.
- Tint a choice in a dialogue menu.

One consistent color scheme across all of these makes a game feel designed.

## Color coding that helps players

A color code is a design decision. A few ideas that work well in RPGs:

- **Item rarity.** Common items stay default, rare items get one accent, legendary items another.
- **Quest keywords.** Color place names and NPC names the same way every time so players learn to scan for them.
- **Damage types.** Fire, ice and poison messages each get a signature color.
- **Warnings.** Reserve one strong color for danger and use it sparingly.

Keep color from being the only signal. Players with color-vision differences may miss it, so pair color with an icon, a word or a symbol. If you want to see how other developers handle this, itch.io lists [games with color-blind support](https://www.itch.io/games/accessibility-colorblind/) and [games with high contrast options](https://www.itch.io/games/accessibility-highcontrast/).

Also keep contrast high. Dark blue on a dark window is unreadable, and no one will thank you for a clever palette they can't see.

## Is FF0000 an RPG Maker color code?

No. `FF0000` is a web hex color. In CSS, [#FF0000 is pure red](https://www.rapidtables.com/web/css/css-color.html), written as rgb(255, 0, 0), and hex colors use the #rrggbb format. People searching for "color codes" often mean this system.

RPG Maker's `\C[n]` doesn't use it. You pass a palette number, and the number resolves to whatever color is in the windowskin square. The two systems meet in one place: when you paint a square in `Window.png`, you can pick its color with a hex value in your image editor. After that, you refer to it by its number.

| | RPG Maker `\C[n]` | Web hex color |
|---|---|---|
| Format | `\C[` + number 0 to 31 + `]` | `#rrggbb` |
| Where the color is defined | Windowskin image | In the code itself |
| Change it by | Editing a square in Window.png | Typing a different value |
| Works in messages out of the box | Yes | No, needs a plugin |

## When 32 colors aren't enough

The built-in palette is limited by design: 32 squares, some reserved. If you want dozens of rarity tiers, per-faction name colors or exact hex values in dialogue, you have three options.

1. **Recolor the squares.** Cheapest and safest. Swap the free indexes (1 to 15) for the colors your game needs.
2. **Make a second windowskin.** Different windows can use different skins, so a menu can have a different palette than a dialogue box.
3. **Use a plugin.** Color plugins extend the code system so you can use numbers past 31, hex values or gradient text. Some add named codes that auto-color words, so you type a character's name and it colors itself.

A plugin saves time when your game has lots of text. Instead of typing `\C[5]Aria\C[0]` hundreds of times, the plugin does it for you and you can't forget a reset.

Whichever route you pick, test in both a dialogue box and a menu. Colors you add for text can collide with gauge colors if you stray into indexes 16 and up.

## Perspective: why we build around modular text tools

> We've spent a long time making plugins for RPG Maker MV and MZ, and color codes are a perfect example of why modularity matters. The base engine gives you a clean, simple system: 32 colors, one code, easy to learn. That's a strength. It gets you from zero to colored text in a minute.
>
> The trouble shows up as your game grows. A story-heavy RPG might want rarity tiers, faction colors and consistent keyword highlighting across hundreds of messages. You shouldn't need to write engine code for that.
>
> That's the idea behind our library of 900+ downloadable plugins. Each one adds a specific capability you can drop in without extensive coding, so you build the game you imagined instead of fighting the menu. Color is a small thing that makes a big difference in how polished a game feels. We think every creator should have the tools to get it right quickly.
>
> *RPG_Maker_Plugins*

## Build your game faster with RPG_Maker_Plugins

Color codes are one small piece of a finished game. If you're building in MV or MZ and want to add features without writing them from scratch, our [MZ/MV plugin library](https://rpg-maker-plugins.itch.io/) has more than 900 downloadable plugins, from minigames to sound generators, plus tilesheets, sprite assets and background music generators.

[![RPG_Maker_Market](https://media.babylovegrowth.ai/blog-images/organization-61610/1792828959492_rpg-maker-plugins.png)](https://rpg-maker-plugins.itch.io/)

Want everything in one go? The [Lifetime Supporter Pass](https://rpg-maker-plugins.itch.io/lifetime-supporter-pass/) is $79.99, one-off. Browse the shop, pick what fits your project, and get back to building.

## Quick troubleshooting

- **The code prints as text.** Check that you used a backslash and that the brackets are square, not round.
- **Everything after the colored word stays colored.** Add `\C[0]` after it.
- **A color looks wrong in menus too.** You edited an index that the interface uses. Move the change to a lower index or use a different skin for that window.
- **The color number does nothing.** Numbers outside the 0 to 31 range fall back to the default in the VX Ace [miniguide](https://steamsolo.com/guide/miniguide-adding-color-and-icons-to-text-rpg-maker-vx-ace/), so check your number.
- **You can't tell which square is which.** In MZ, use Insert Color Index. In MV, count squares from the first, starting at 0.

## FAQ

### What is the color code for RPG Maker text?

The code is `\C[n]`, where n is a number from 0 to 31. It draws the text that follows in the nth color of your windowskin palette. Use `\C[0]` to return to the default color.

### Do RPG Maker MV and MZ use the same color codes?

Yes, `\C[n]` works the same way in both. MZ adds three other control characters compared with MV, but the color code is unchanged. You can also use it outside plain messages, such as in item descriptions and battle messages.

### Where do I change what each color number looks like?

Open `img/system/Window.png` in your project and edit the 12x12 squares in the bottom-right corner. Square 0 is the first. Change squares 1 to 15 if you only want to restyle message text, since higher indexes are commonly tied to gauges and system colors.

### Can I use hex codes like FF0000 in messages?

Not with the built-in codes. They take a palette number, and hex is a web format. To use hex in messages you'll want a plugin that extends the text color system, or you can paint your chosen hex color into a windowskin square and call it by number.

### How do I get more than 32 text colors?

A plugin is the simplest route. Color plugins can add extra indexes, gradients or named codes. Until then, you can swap colors in free indexes or use a different windowskin for different windows.

## Sources

- [Messages, RPG Maker MV official help](https://rpgmakerofficial.com/product/MV_Help/page/01_10_01.html)
- [Messages, RPG Maker MZ official help](https://rpgmakerofficial.com/product/MZ_help-en/01_10_01.html)
- [What Makes up a Windowskin? The Official RPG Maker Blog](https://www.rpgmakerweb.com/blog/what-makes-up-a-windowskin)
- [RPG Maker MZ official beginner guide to events](https://rpgmakerofficial.com/product/mz/guide/event/kihon.html)
- [ColorManager reference, RPGMakerMZ on GitHub](https://github.com/tonbijp/RPGMakerMZ/blob/master/Reference/ColorManager.md)
- [Window Skins Dissected, rpgmaker.net](https://rpgmaker.net/articles/2751/)
- [RPG Maker MV system color list, 5ing-myway](https://www.5ing-myway.com/rpgmaker-mv-system-color-index/)
- [Miniguide: Adding color and icons to text, Steam Solo](https://steamsolo.com/guide/miniguide-adding-color-and-icons-to-text-rpg-maker-vx-ace/)
- [CSS color codes and names, RapidTables](https://www.rapidtables.com/web/css/css-color.html)

Disclaimer: This article is for informational purposes only. The author is not affiliated with the creators of RPG Maker or the plugins discussed. All plugin names, trademarks, and links belong to their respective owners. The author may include links to external projects or repositories. Readers should review each project’s license and documentation before downloading or using any plugin.

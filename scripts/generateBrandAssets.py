#!/usr/bin/env python3
"""Regenerate Expo app icon, splash, and native iOS asset catalog images."""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRANDING = ROOT / "assets" / "branding"
IMAGES = ROOT / "assets" / "images"
IOS_ICON = ROOT / "ios" / "kinshipSync" / "Images.xcassets" / "AppIcon.appiconset"
CREAM = (245, 239, 232, 255)


class BrandAssetGenerator:
    def __init__(self) -> None:
        self.icon_mark = BRANDING / "icon-mark.png"
        self.wordmark = BRANDING / "rusty-brown-logo.png"

    def run(self) -> None:
        self._generate_app_icon()
        self._generate_splash_icon()
        self._generate_favicon()
        self._sync_ios_assets()

    def _generate_app_icon(self) -> None:
        mark = Image.open(self.icon_mark).convert("RGBA")
        size = 1024
        canvas = Image.new("RGBA", (size, size), CREAM)
        mark_size = int(size * 0.58)
        mark = self._fit_within(mark, mark_size, mark_size)
        offset = ((size - mark.width) // 2, (size - mark.height) // 2)
        canvas.paste(mark, offset, mark)
        icon = canvas.convert("RGB")
        icon.save(IMAGES / "icon.png", format="PNG", optimize=True)
        icon.save(IMAGES / "adaptive-icon.png", format="PNG", optimize=True)

    def _generate_splash_icon(self) -> None:
        mark = Image.open(self.icon_mark).convert("RGBA")
        target_width = 280
        mark = self._fit_within(mark, target_width, target_width)
        splash = Image.new("RGBA", (target_width, target_width), (0, 0, 0, 0))
        offset = ((target_width - mark.width) // 2, (target_width - mark.height) // 2)
        splash.paste(mark, offset, mark)
        splash.save(IMAGES / "splash-icon.png", format="PNG", optimize=True)

    def _generate_favicon(self) -> None:
        mark = Image.open(self.icon_mark).convert("RGBA")
        size = 48
        canvas = Image.new("RGBA", (size, size), CREAM)
        mark = self._fit_within(mark, int(size * 0.72), int(size * 0.72))
        offset = ((size - mark.width) // 2, (size - mark.height) // 2)
        canvas.paste(mark, offset, mark)
        canvas.convert("RGB").save(IMAGES / "favicon.png", format="PNG", optimize=True)

    def _sync_ios_assets(self) -> None:
        app_icon_path = IOS_ICON / "App-Icon-1024x1024@1x.png"
        if app_icon_path.parent.exists():
            Image.open(IMAGES / "icon.png").save(app_icon_path, format="PNG", optimize=True)

        splash_set = ROOT / "ios" / "kinshipSync" / "Images.xcassets" / "SplashScreenLogo.imageset"
        if not splash_set.exists():
            return

        mark = Image.open(self.icon_mark).convert("RGBA")
        for scale, filename in [(1, "image.png"), (2, "image@2x.png"), (3, "image@3x.png")]:
            box = 220 * scale
            resized = self._fit_within(mark, box, box)
            splash = Image.new("RGBA", (box, box), (0, 0, 0, 0))
            offset = ((box - resized.width) // 2, (box - resized.height) // 2)
            splash.paste(resized, offset, resized)
            splash.save(splash_set / filename, format="PNG", optimize=True)

    @staticmethod
    def _fit_within(image: Image.Image, max_width: int, max_height: int) -> Image.Image:
        ratio = min(max_width / image.width, max_height / image.height)
        new_size = (max(1, int(image.width * ratio)), max(1, int(image.height * ratio)))
        return image.resize(new_size, Image.Resampling.LANCZOS)


if __name__ == "__main__":
    BrandAssetGenerator().run()
    print("Brand assets generated and iOS catalog synced.")

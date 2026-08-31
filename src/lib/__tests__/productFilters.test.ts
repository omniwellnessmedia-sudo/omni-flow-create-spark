import { describe, it, expect } from "vitest";
import { filterQualityProducts } from "@/lib/productFilters";

/**
 * Regression tests built from a live audit of the store collection page on
 * 28 August 2026. Every rejected case below was actually visible to shoppers
 * on a wellness storefront at the time.
 *
 * The root cause was that filterQualityProducts used OR logic which included
 * "has an image URL", so any listing carrying a picture passed regardless of
 * what it was. Relevance is now required on its own terms, and the product
 * classes that matched wellness keywords by coincidence are hard rejected.
 *
 * No em dashes in this file.
 */

const img = "https://images.example.com/a-long-enough-image-url.jpg";
const make = (name: string, category: string) => ({
  name,
  category,
  image_url: img,
  price_zar: 300,
});

const keptNames = (products: ReturnType<typeof make>[]) =>
  new Set(filterQualityProducts(products).map((p) => p.name));

describe("intimate apparel is excluded", () => {
  it("rejects listings whose imagery cannot be vetted, even when the name reads as wellness", () => {
    const items = [
      make("Panties Bliss Natural Natural", "General Wellness"),
      make("Bermuda Comfort Natural Natural", "General Wellness"),
    ];
    expect(keptNames(items).size).toBe(0);
  });
});

describe("coincidental wellness keyword matches are excluded", () => {
  it("rejects a laptop battery that matched on the word yoga", () => {
    expect(keptNames([make("Lenovo Yoga Laptop Battery L17C4PB0", "Electronics")]).size).toBe(0);
  });

  it("rejects a textbook that matched on the word organic", () => {
    expect(keptNames([make("Organic Chemistry Textbook 8th Edition", "Books")]).size).toBe(0);
  });

  it("rejects a record album that matched on the word natural", () => {
    expect(keptNames([make("Natural Gas 1976 Rock Album Vinyl", "Music")]).size).toBe(0);
  });

  it("rejects pantry, hardware and household staples", () => {
    const items = [
      make("Jute Twine Roll 100m", "Garden"),
      make("Dijon Mustard 200g", "Groceries"),
      make("Cotton Pillowcase Standard", "Home"),
    ];
    expect(keptNames(items).size).toBe(0);
  });
});

describe("genuine wellness products still pass", () => {
  it("keeps products that are actually relevant", () => {
    const items = [
      make("Yoga Mat Premium Non-Slip", "Yoga Equipment"),
      make("Organic Ashwagandha Supplement", "Nutrition and Supplements"),
      make("Lavender Essential Oil 30ml", "Aromatherapy"),
    ];
    expect(keptNames(items).size).toBe(3);
  });
});

describe("an image is no longer evidence of relevance", () => {
  it("rejects an irrelevant product that carries a perfectly good image", () => {
    // This is the exact defect that let the catalogue through: the old filter
    // passed anything with an image URL longer than ten characters.
    expect(keptNames([make("Stainless Steel Door Hinge 100mm", "Hardware")]).size).toBe(0);
  });
});

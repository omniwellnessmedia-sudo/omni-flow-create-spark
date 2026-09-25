# The Muizenberg hero photograph

Drop one image in this folder and push. The hero on
https://omniwellnessmedia.co.za/muizenberg picks it up on the next build.
No code change, no developer.

- One image only. If there is more than one, the first by filename wins.
- jpg, jpeg, png, webp or avif.
- Export it at about 1400px on the long edge. Straight off the camera these
  files are six or seven megabytes, which is a slow hero on a phone.
- It is shown in a 4:5 portrait crop, centred. Check the faces survive that
  crop before you push.

If this folder is empty, the hero centres its text and reads as a
deliberate piece of typography. Nothing breaks.

## Also change the words

`HERO_ALT` in `src/pages/Muizenberg.tsx` currently says only that Omni took
the photograph, because it was written before anyone here had seen the
picture. Replace it with a description of what is actually in the frame,
for people using a screen reader.

Two rules that apply to every photograph on this page: nobody in a picture
is named, and no caption describes a person as a client or as happy. We
publish these as examples of our own work.

# Landing Page Prototype v3 Feedback 

## Summary 

  1. Some header nav issues 
  2. A few design feedback fixes
  3. Big important animation scrollable experience 

## Issues 

### Header Nav Width 

The header nav is wider than the rest of the elements. Looks like the nav is 446px wide and seems like 430ps wide was what most other objects were at. 

`assets/docs/archive/v2/IMG/v3-review-mobile-1.jpg`

### Header Nav Scroll Hide Hidden

Then as you scroll down, the nav button is now hiding — also we didn't change the icon like the v2 feedback described. 

`assets/docs/archive/v2/IMG/v3-review-mobile-2.jpg` 

## Feedback 

### Hero Stat "Tiles" Don't Need To Be Tiles

Instead of the bg squares for the hero stat tiles, what about a circle that doesn't extend large enough to contain the entire bit of content? So that it is emphasized more than the image where I turned it off, but we don't have so many containers on everything. Artsy-like if the diameter of the circle was as wide or a little less wide than just the number — but I'm just using that as a reference, we don't want the circles to literally be that size for each because we still want them to be the same kind of button element emphasize the way the square is, but just in a more fresh way. 

`assets/docs/archive/v2/IMG/v3-review-mobile-3.jpg` 

### Slow Speed Of Image Movement

For the hero drift, change it from 30s to 60s to slow it down a bunch. 

### Subtitle Becomes Headline, Name Byline 

The hero subtitle items are still changing into each other in a strange way. The animation isn't right and honestly, this text is more of a hook than my name so I still am feeling like it could be the emphasized part of the hero. The animation should be completely redone because the way it is set up now, when the line "dips" down (barely could call it a dip but) you can see the bottom of the line above it peek out. When really I think the whole thing should just be reimagined. I still keep picturing an old analog "digital" clock where the numbers literally folded in half to change to the next number. Is there any way to do something along those lines? Preferably in multiple parts if no by character or by word, which would make it a nice, sequential dominos falling feeling. And then my name should be more of a by-line. 

### Experience Cleanup

In the experience section — I think we just want the padding on L and R to be about 3x normal for those four job positions. And then the tag can all maintain their single line, they don't need to break/wrap inside their cred-tag container. 

`assets/docs/archive/v2/IMG/v3-review-mobile-4.jpg` 

### Process UI Mental Nudge

For the process, we need something long and horizontal below the three items making it clear that the user should be able to scroll left and right here. We should use the same 3 colored lines, but this time the longest reaches all the way to the left, then the next to are sequentially a bit shorter, so that 75% across the width of the screen all three lines are together and then the rest of the horizontal scroll they are all together to the end. 

`assets/docs/archive/v2/IMG/v3-review-mobile-5.jpg` 

## Animation Wow-Factor

### Hero Scrollable Experience 

We still don't have any kind of interesting scrollable UX. In the mobile best design practices under the heading "Example of vertical scrollable experience" is what I was wanting to try. I do think the visual is a lot more powerful now, so the concept could work around that element. Something like this: Initially the hero images don't quite extend all the way down behind the headline/name/cta buttons to the bottom of the viewport where those elements sit. As the viewer scrolls, before moving down the image is going to take over like this — as the viewer starts to scroll down, instead of the page moving, first the image portion of the hero extends vertically, taking over where the hero stats were as they scroll off the top of the screen. Then as the user continues scrolling down the image extends vertically even more, this time allowing more image to really take over the screen, with the headline/name/cta buttons staying at the bottom of the view port the whole time, but now the image is all the way to the bottom of the viewport behind all of those elements as well, making it so that now the images take up 100vw 100vh. Just after it reaches that full expansion, as the viewer continues scrolling, first the image falls away — but now it isn't scrolling off the top of the screen like normal, rather the image background is being hidden from the bottom and moving up with the user's scroll. When the image reaches about halfway hidden, the headline/name/cta buttons finally start to follow with them, but they do it in a very flowing way because the vertical space between the elements first expands with the scroll, and then condenses back to normal at the same time it is finally moving up the screen. Still, we don't see any other content show yet — instead the 3-color-bar stack comes in one bar at a time with the first top bar the longest, then following before the top bar has reached final position, the middle, and then the final — mirroring the same kind of expanded vertical spacing between each line that then shrinks to normal final position spacing (throwback to how the text moved off the page). When they reach this 'final position' spacing, it is 3/4 way up the screen and as it reaches the top of the screen, the "Web Development" section appears and then closes the spacing catching up so that by the time the lines start to go off the screen, the content below them have reached final normal spacing below them. The whole time the elements are all moving in unison, at their own speeds, so that they meet and things feel orchestrated. Like a chef cooking a meal of a million things and they all finish at the same time. Or like a gridlocked 8-lane Los Angeles 405 but it is the future and all the cars are driven by AI so they are moving in beautiful orchestration, all doing their own thing, but all clearly aware of how the others are moving. 

### Final Scrollable Mini-Experience 

Then let's also animate extra this last stack of three bars so that they come into the page all spaced out and in sequence and then come closer together and into position as you scroll, until at a certain point the final CTA starts to appear, still spaced further then final, and then moves up faster to reach final position spacing by the time the bars are nearing the top of the page. 

`assets/docs/archive/v2/IMG/v3-review-mobile-6.jpg`

---
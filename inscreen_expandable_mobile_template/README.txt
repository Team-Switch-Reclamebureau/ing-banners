LJP Creative Templates v1.6.4

* GENERAL *

Only edit the HTML between 'START OF CUSTOM HTML' and 'END OF CUSTOM HTML'. Only edit the 'main.js' Javascript file between 'START OF CUSTOM JS' and 'END OF CUSTOM JS'.

Placeholder assets are inside folder 'assets-template'. Add real assets inside the 'assets' folder and erase 'assets-template' when ready.

Each panel must have a div.jpt-wrapper containing all html display content. You should be able to add, swap, duplicate and remove divs with class 'jpt-section' without breaking the layout. If adding a custom section, use an empty .jpt-section div and code from scratch.

You can look through the template CSS to find what classes you may want to override/edit. Feel free to add your own extra classes to elements for custom layouts and animations in the 'CUSTOM' section. But be sure not to use the 'jpt-' prefix for these classes.

The templates allow for 2 fonts, FontA and FontB. Just update the font-face declaration paths, not the font-family value.

There are 4 live text classes .jpt-h1, .jpt-h2, .jpt-p and .jpt-ul. 

There are labelled blocks of pre-defined HTML. Just comment/uncomment/remove/duplicate as required.


* ENTRANCE ANIMATIONS *

See: https://docs.partners.gumgum.com/premiumjs/animation


* CTAs *

For the CTAs, the template allows for both real text/HTML and image types. Real text buttons are preferred and the default. 

For image buttons, add class jpt-cta-image to the button.jpt-cta. 

See: https://docs.partners.gumgum.com/premiumjs/cta


* SKIN *

Add/remove 'showfullscreen' to the div[jp-controls] to enable/disable full screen functionality. The expanded.html file and other code is already there.

* For the top panel *

Inside the div.jpt-wrapper there must be:
- 1 div.jpt-section.jpt-section-copy
And/or -
- 1 div.jpt-section.jpt-section-video
These divs can be in either order. If there is only one, this will appear in the centre.

* For the side panels *

Inside the div.jpt-wrapper add/remove as many div.jpt-section sections as you need. Adjust the div.jpt-header and div.jpt-footer heights to allow for more/less elements. 

div.jpt-h2 and div.jpt-h2-image-container with class jpt-show-when-scrolled will slide into video only when the page is scrolled

For a simple side panel video switch at bottom left, uncomment the div.jpt-video-container at the bottom of left.html (and removed the 'Image and switched video' block)


* MOBILE SCROLLER, MOBILE SKIN and INSCREEN EXPANDABLE MOBILE *

Inside the div.jpt-wrapper add/remove as many div.jpt-section sections as you need. For the Scroller and main panel in the Skin, adjust the div.jpt-header and div.jpt-footer heights to allow for more/less elements. Simply removing the expand button is enough to disable the overlay expandable feature. Changing the flex direction of the div.jpt-section elements and making some sections position:absolute may be required.

For syncing videos with audio across multiple panels, there must be 2 versions of the same video; one exported without audio. The video with audio must be in the panel shown on load, while all other panels must have the video without audio.

There are 2 functions called in main.js to help prevent the CTA and the logo from getting too big. They can be omitted if not required:

- Premium.template.constrainCta(element, maxWidth, maxHeight);
- Premium.template.constrainLogo(element, maxWidth, maxHeight);

    element     logo or cta element
    maxWidth    decimal percentage of width of parent element
    maxHeight   decimal percentage of height of parent element


* FOOTER AD *

Inside the div.jpt-wrapper add/remove as many div.jpt-section sections as you need. Adjust div.jpt-section:nth-child(1) as required (default width:100px). Videos and carousels should sync automatically. If present, div.jpt-popout (outside of div.jpt-main-content) will maintain its width and will force div.jpt-main-content to make room for it. For pop-out content, uncomment Premium.jpxApi.setCollapsedHeight(...); Premium.jpxApi.addSheet(...); and set config.json height as required.

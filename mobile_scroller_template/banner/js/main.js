/*
 gumgum-ljp_creative_template v1.6.4 2023-06-01 
 */

"use strict";
var Premium = Premium || {};

Premium.creative = {
    init: function() {
        Premium.product.initOrientationMessage();
        /* START OF CUSTOM JS */

        /* Premium.utils.blockScroll --------------------------------------------------- */
        Premium.utils.blockScroll = new function() {
            var yOffset;
            var blockScrollHandler = function(e) {
                window.top.scrollTo(0, yOffset)
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            };
            var block = this.block = function(block) {
                yOffset = window.top.pageYOffset;
                try {
                    if (block) {
                        window.top.addEventListener("scroll", blockScrollHandler, { passive: false });
                        window.addEventListener("scroll", blockScrollHandler, { passive: false });
                        window.top.addEventListener("wheel", blockScrollHandler, { passive: false });
                        window.addEventListener("wheel", blockScrollHandler, { passive: false });
                    } else {
                        window.top.removeEventListener("scroll", blockScrollHandler, { passive: false });
                        window.removeEventListener("scroll", blockScrollHandler, { passive: false });
                        window.top.removeEventListener("wheel", blockScrollHandler, { passive: false });
                        window.removeEventListener("wheel", blockScrollHandler, { passive: false });
                    }
                } catch (e) {}
            }
            window.addEventListener("unload", function() {
                block(false);
            })
        }
        /* Premium.utils.blockScroll END ----------------------------------------------- */

        Premium.creative.createVideoPlayerAppended = function(video) {
            if (document.body.id === "body_expanded") {
                if (video.readyState > 2) {
                    document.body.style.opacity = 1;
                } else {
                    video.addEventListener("playing", function() {
                        document.body.style.opacity = 1;
                    })
                }
            }
            Premium.video.pauseWhenOutOfView();
        }

        if (document.body.id === "body_expanded") {
            // Expanded panel --------------------------------------------------------
            Premium.utils.blockScroll.block(true);
        } else {
            // Main panel ------------------------------------------------------------
            var entranceAnimation = Premium.animation.getEntranceAnimation();
            var ctaEffects = Premium.cta.getEffects();
            var buttonExpandableEl = document.querySelector(".jpt-button-expandable")
            var buttonSmallPrintEl = document.querySelector(".jpt-button-legals");
            var smallPrintEl = document.querySelector(".jpt-legals");
            var carouselEl = document.querySelector("[jp-carousel]");
            var sectionCountdownEl = document.querySelector(".jpt-section-countdown");
            var hasPlayedAnimation;
            var isSmallPrintOpen = false;

            gsap.set(".jpt-kv-image", { xPercent: -50, yPercent: -50 });

            if (buttonExpandableEl) {
                buttonExpandableEl.addEventListener("click", function() {
                    Premium.expand.expand("expanded.html", "width:100%;height:100%;background:black");
                    Premium.utils.blockScroll.block(true);
                })
                Premium.expand.callOnClosed(function() {
                    Premium.utils.blockScroll.block(false);
                }, "myid")
            }

            if (buttonSmallPrintEl) {
                buttonSmallPrintEl.addEventListener("click", function() {
                    toggleOpenSmallPrint();
                })
                function toggleOpenSmallPrint() {
                    isSmallPrintOpen = !isSmallPrintOpen;
                    if (isSmallPrintOpen) {
                        gsap.set(buttonSmallPrintEl.querySelector("IMG"), { rotation: 180 });
                        smallPrintEl.classList.add("hidden");
                    } else {
                        gsap.set(buttonSmallPrintEl.querySelector("IMG"), { rotation: 0 });
                        smallPrintEl.classList.remove("hidden");
                    }
                    resizeHandler();
                }
            }


            if (carouselEl) {
                var carousel = JPCarousel.getObject("[jp-carousel]");
                var carouselLabels = ["Label 1", "Label 2", "Label Three", "Label Four"];
                var carouselEl = document.querySelector("[jp-carousel]");
                var carouselStopRef;
                carouselEl.addEventListener("click", function(e) {
                    clearTimeout(carouselStopRef)
                })
                JPCarousel.callOnReady(carouselEl, function() {
                    var carousel = JPCarousel.getObject("[jp-carousel]");
                    Premium.template.fixjpUrls(carousel);
                    carousel.setCallOnShowItem(function(index) {
                        gsap.timeline()
                            .to(".jp-carousel ~ .jpt-p", .2, { opacity: 0 })
                            .add(function() {
                                document.querySelector(".jp-carousel ~ .jpt-p").innerText = carouselLabels[index];
                            })
                            .to(".jp-carousel ~ .jpt-p", .4, { opacity: 1 })
                    })
                })
            }

            if (sectionCountdownEl) {
                var endDate = new Date("December 20 2022 09:00:00");
                Premium.template.setCountdownLanguage("en");
                var jpCountdown = new JPCountdown(".jpt-countdown", endDate);
                jpCountdown.on("update", function(timeInfo, totalSecondsLeft) {
                    timeInfo = Premium.template.convertCountdownTime(totalSecondsLeft);
                    if (timeInfo.wholeDays > 0) {
                        sectionCountdownEl.querySelector(".jpt-countdown").classList.add("narrow");
                    } else {
                        sectionCountdownEl.querySelector(".jpt-countdown").classList.remove("narrow");
                    }
                    sectionCountdownEl.querySelector(".jpt-countdown-days-container").style.display = timeInfo.wholeDays > 0 ? "flex" : "none";
                    sectionCountdownEl.querySelector(".jp-countdown-days").innerHTML = timeInfo.wholeDays;
                    sectionCountdownEl.querySelector(".jp-countdown-hours").innerHTML = timeInfo.wholeHours;
                })
                jpCountdown.start();
            }

            var bgVideo = document.querySelector(".jpt-bg video");
            if (bgVideo) {
                Premium.template.bgVideoLoop(bgVideo);
            }

            function resizeHandler() {
                if (buttonSmallPrintEl) {
                    if (isSmallPrintOpen) {
                        requestAnimationFrame(function() {
                            gsap.to(smallPrintEl, .3, { height: smallPrintEl.scrollHeight });
                        })
                    } else {
                        gsap.to(smallPrintEl, .3, { height: "35%" });
                    }
                    if (smallPrintEl.querySelector("p").clientHeight < smallPrintEl.offsetParent.clientHeight * .35 * .93){
                        smallPrintEl.classList.remove("jpt-legals-overflow");
                        buttonSmallPrintEl.style.display = "none";
                    } else {
                        smallPrintEl.classList.add("jpt-legals-overflow");
                        buttonSmallPrintEl.style.display = "inline-block";
                    }
                }
                Premium.template.constrainCta(document.querySelector(".jpt-cta"), .9, .47);
                Premium.template.constrainLogo(document.querySelector(".jpt-logo"), .9, .85, undefined, true);
            }

            function scrollHandler() {
                if (!hasPlayedAnimation && Premium.jpxApi.getPercentageVisibility() > 80) {
                    hasPlayedAnimation = true;
                    entranceAnimation.play();
                    if (carousel) {
                        if (!carousel._autoShowTime) {
                            carousel.autoShowTimer(4000);
                            carouselStopRef = setTimeout(function() {
                                carousel.autoShowTimer(undefined);
                            }, Premium.template.CarouselStopTime)
                        }
                    }
                    ctaEffects.play();
                    resizeHandler();
                }
            }

            window.addEventListener("resize", resizeHandler);
            window.addEventListener("load", scrollHandler);
            Premium.product.scopeWindow.addEventListener("scroll", scrollHandler);

            /* END OF CUSTOM JS */
        }
    },
    loaded:function(){
        document.body.style.opacity = 1;
    }
};
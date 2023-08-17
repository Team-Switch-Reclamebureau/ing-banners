/*
 gumgum-ljp_creative_template v1.6.4 2023-06-01 
 */

"use strict";
var Premium = Premium || {};

Premium.creative = {
    init: function() {

        /*********************************************************************
         * Premium.addon.mobileexpandable.init(height, expandedHeight, swipeHeight, expandedSwipeHeight);
         * @desc Converts mobile footer to mobile expandable
         * @param {string} [height="25%"] - height of default panel
         * @param {string} [expandedHeight="100%"] - height of expanded panel
         * @param {number} [swipeHeight=1] - height of swipe area on default panel
         * @param {number} [expandedSwipeHeight=1] - height of swipe area on expanded panel
         *********************************************************************/
        Premium.addon.mobileexpandable.init("25%", "58%", 1, 1);

        Premium.product.initOrientationMessage();

        /* START OF CUSTOM JS */

        var smallPrintEl = document.querySelector(".jpt-legals");
        var videoContainerEl = document.querySelector(".jpt-video-container");
        var videoEl;
        var carouselEl = document.querySelector("[jp-carousel]");
        var pauseRef;
        var canConstrain = false;
        Premium.animation.delay = document.body.id === "body_expanded" ? 1 : .5;

        gsap.set(".jpt-kv-image", { xPercent: -50, yPercent: -50 });

        if (smallPrintEl) {
            var isSmallPrintShowing = false;
            var smallPrintButtonEl = document.querySelector(".jpt-button-legals");
            if (smallPrintButtonEl) {
                var toggleShowSmallPrint = function() {
                    isSmallPrintShowing = !isSmallPrintShowing;
                    if (isSmallPrintShowing) {
                        gsap.to(".jpt-legals-content, .jpt-legals-edge", .5, { autoAlpha: 1 });
                        gsap.to(".jpt-legals", .5, { background: "rgba(0,0,0,.8)" });
                        smallPrintButtonEl.innerText = "<";
                    } else {
                        gsap.to(".jpt-legals-content, .jpt-legals-edge", .5, { autoAlpha: 0 });
                        gsap.to(".jpt-legals", .5, { background: "rgba(0,0,0,0)" });
                        smallPrintButtonEl.innerText = "More >";
                    }

                }
                smallPrintButtonEl.addEventListener("click", function(e) {
                    toggleShowSmallPrint();
                })
            }
        }

        if (carouselEl) {
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
                });
                if (!carousel._autoShowTime) {
                    carousel.autoShowTimer(4000);
                    carouselStopRef = setTimeout(function() {
                        carousel.autoShowTimer(undefined);
                    }, Premium.template.CarouselStopTime)
                }
            })
        }

        var bgVideo = document.querySelector(".jpt-bg video");
        if (bgVideo) {
            Premium.template.bgVideoLoop(bgVideo);
        }

        var constrainConfig = {
            "body_main": {
                cta: {
                    maxWidth: .9,
                    maxHeight: .36
                },
                logo: {
                    maxWidth: .9,
                    maxHeight: .38
                },
                relativeParent: document.querySelector(".jpt-section-right")
            },
            "body_expanded": {
                cta: {
                    maxWidth: .47,
                    maxHeight: .9
                },
                logo: {
                    maxWidth: .4,
                    maxHeight: .92
                },
                relativeParent: document.querySelector(".jpt-section-footer")
            }
        }

        var resizeHandler = function() {
            if (document.querySelector(".jpt-adjust-width")) {
                if (Premium.product.scopeWindow.innerWidth / Premium.product.scopeWindow.innerHeight > 35 / 59) {
                    gsap.set(".jpt-adjust-width", { width: "72%" });
                } else if (Premium.product.scopeWindow.innerWidth / Premium.product.scopeWindow.innerHeight > 32 / 59) {
                    gsap.set(".jpt-adjust-width", { width: "80%" });
                } else {
                    gsap.set(".jpt-adjust-width", { width: "100%" });
                }
            }
            if (document.body.id === "body_main" && videoContainerEl && videoEl) {
                if (videoContainerEl.clientWidth / videoContainerEl.clientHeight > 16 / 9) {
                    videoEl.style.width = "100%";
                    videoEl.style.height = "auto";
                } else {
                    videoEl.style.width = "auto";
                    videoEl.style.height = "100%";
                }
                PremiumJpControls.resizeAll();

            }

            if (canConstrain) {
                Premium.template.constrainCta(
                    document.querySelector(".jpt-cta"),
                    constrainConfig[document.body.id].cta.maxWidth,
                    constrainConfig[document.body.id].cta.maxHeight,
                    constrainConfig[document.body.id].relativeParent
                );
                Premium.template.constrainLogo(
                    document.querySelector(".jpt-logo"),
                    constrainConfig[document.body.id].logo.maxWidth,
                    constrainConfig[document.body.id].logo.maxHeight,
                    constrainConfig[document.body.id].relativeParent,
                    true
                );
            }

        }

        var videoTempPause = function() {
            if (!videoEl) return;
            videoEl.pause();
            clearTimeout(pauseRef);
            pauseRef = setTimeout(function() {
                if (PremiumJpControls.getLastAction(videoEl.parentElement).playPause !== "pause") {
                    var prom = videoEl.play();
                    if (prom) {
                        prom.catch(function(e) {})
                    }
                }
            }, 500)
        };

        window.addEventListener("resize", resizeHandler);
        window.addEventListener("load", function() {
            resizeHandler();
            gsap.to({ x: 0 }, .3, {
                x: 1,
                onUpdate: function() {
                    resizeHandler();
                }
            })
        });

        switch (document.body.id) {
            case "body_main":
                canConstrain = true;
                Premium.communicator.api.receiveMessage(function(mess) {
                    if (mess.action === "mfex-expand") {
                        // videoTempPause();
                    } else if (mess.action === "mfex-default") {
                        // videoTempPause();
                    } else if (mess.action === "mfex-expand-complete") {
                        Premium.utils.debug(document.body.id + " expand complete");
                    } else if (mess.action === "mfex-default-complete") {
                        Premium.utils.debug(document.body.id + " default complete");
                    }
                })

                Premium.creative.createVideoPlayerAppended = function(video) {
                    videoEl = video;
                    Premium.video.initPlayFromUser(videoEl);
                    Premium.video.sync(videoEl, 1);
                    var prom = videoEl.play();
                    if (prom) {
                        prom.catch(function() {})
                    }
                    // Safari fix
                    document.body.addEventListener("click", function(e) {
                        if (e.target.className && (e.target.className.indexOf("jp-controls-play") > -1 || e.target.className.indexOf("jp-controls-bigplay") > -1)) {
                            if (!video.paused) {
                                setTimeout(function() {
                                    video.play();
                                }, 500)
                            }
                        }
                    });
                }

                break;

            case "body_expanded":
                Premium.cta.delay = 2;
                Premium.communicator.api.receiveMessage(function(mess) {
                    if (mess.action === "mfex-expand") {
                        gsap.to(".jpt-wrapper", .5, { delay: .5, autoAlpha: 1 });
                    } else if (mess.action === "mfex-default") {
                        canConstrain = false;
                        gsap.to(".jpt-wrapper", .5, { autoAlpha: 0 });
                    } else if (mess.action === "mfex-expand-complete") {
                        canConstrain = true;
                        resizeHandler();
                    }
                });

                Premium.creative.createVideoPlayerAppended = function(video) {
                    Premium.video.sync(video, undefined, Premium.video.SyncType_Get);
                    var prom = video.play();
                    video.volume = "0";
                    if (prom) prom.catch(function(e) {})
                }
                var videoNoAudio = document.querySelector(".jpt-video-noaudio");
                if (videoNoAudio) {
                    Premium.creative.createVideoPlayerAppended(videoNoAudio)
                }

                break;
        }

        /* END OF CUSTOM JS */
    },
    loaded: function() {
        document.body.style.opacity = 1;
    }
}
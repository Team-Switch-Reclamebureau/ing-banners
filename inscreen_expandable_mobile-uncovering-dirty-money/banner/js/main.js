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
        Premium.addon.mobileexpandable.init("25%", "58%");

        Premium.product.initOrientationMessage();

        /* START OF CUSTOM JS */

        switch (document.body.id) {
            case "body_main":
                // default panel code here

                Premium.communicator.api.receiveMessage(function(mess) {
                    switch (mess.action) {
                        case "mfex-expand":
                            // expand code here

                            break;

                        case "mfex-default":
                            // default/collapse code here

                            break;

                        case "mfex-expand-complete":
                            // expand complete code here

                            break;

                        case "mfex-default-complete":
                            // default complete code here

                            break;
                    }
                })
                break;

            case "body_expanded":
                // expanded panel code here

                Premium.communicator.api.receiveMessage(function(mess) {
                    switch (mess.action) {
                        case "mfex-expand":
                            // expand code here

                            break;

                        case "mfex-default":
                            // default/collapse code here

                            break;

                        case "mfex-expand-complete":
                            // expand complete code here

                            break;

                        case "mfex-default-complete":
                            // default complete code here

                            break;
                    }
                })
                break;
        }

        /* END OF CUSTOM JS */
    }
}
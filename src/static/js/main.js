import $ from "jquery";
import * as FloatingUIDOM from "@floating-ui/dom";
import * as bootstrap from "bootstrap";
import Cookies from "js-cookie";

$.noConflict();

$(function () {
  const $avatars = $("[data-hover-card-url]");

  // iterate over each hover card element
  $avatars.each(function (i, _el) {
    const $avatar = $(this);
    let cleanupAutoUpdate;
    let isHoveringCard = false;
    let timeoutId;
    let emptyTimeoutId;
    let showTimeoutId;

    const $hoverCard = $("<div class='hover-card fade invisible hide'></div>");
    $hoverCard.attr("id", "hover-card-" + i);

    /** @type {JQuery<HTMLElement>} */
    let $hoverCardContent;

    const showHoverCard = function () {
      if (showTimeoutId) clearTimeout(showTimeoutId);
      if (timeoutId) clearTimeout(timeoutId);
      if (emptyTimeoutId) clearTimeout(emptyTimeoutId);

      const url = $avatar.data("hover-card-url");
      if (!url) return;

      // Fetch the hover card content
      $.ajax({
        url,
        method: "GET",
        success: function (html) {
          $hoverCard.empty();
          $("body").append($hoverCard);
          isHoveringCard = false;

          // Create a HTML element from the response
          $hoverCardContent = $(html);

          $hoverCard.append($hoverCardContent);

          // Position the hover card using Floating UI
          cleanupAutoUpdate = FloatingUIDOM.autoUpdate(
            $avatar[0],
            $hoverCard[0],
            () => {
              FloatingUIDOM.computePosition($avatar[0], $hoverCard[0], {
                middleware: [FloatingUIDOM.offset(10), FloatingUIDOM.flip()],
                placement: "top-start",
              }).then(({ x, y }) => {
                $hoverCard.css({ left: `${x-16}px`, top: `${y}px` });
              });
            }
          );

          showTimeoutId = setTimeout(() => {
            $hoverCard.removeClass("invisible")
                      .removeClass("hide")
                      .addClass("show");

            $hoverCard.on("mouseenter", function () {
              isHoveringCard = true;

              if (timeoutId) clearTimeout(timeoutId);
              if (emptyTimeoutId) clearTimeout(emptyTimeoutId);
            });

            $hoverCard.on("mouseleave", function () {
              isHoveringCard = false;
              hideHoverCard();
            });
          }, 200);
        },
        error: function (error) {
          console.error("Failed to fetch hover card:", error);
        },
      });
    };

    const hideHoverCard = function () {
      if (timeoutId) clearTimeout(timeoutId);
      if (emptyTimeoutId) clearTimeout(emptyTimeoutId);

      timeoutId = setTimeout(() => {
        if (isHoveringCard) return;
        console.log(isHoveringCard);

        $hoverCard.removeClass("show").addClass("hide");

        if (cleanupAutoUpdate) {
          cleanupAutoUpdate();
          cleanupAutoUpdate = null;
        }
      }, 300);


      // Remove the hover card after it has been hidden
      emptyTimeoutId = setTimeout(() => {
        if (isHoveringCard) return;

        $hoverCard.empty();
        $hoverCard.remove();

        $hoverCard.off("mouseenter");
        $hoverCard.off("mouseleave");
      }, 400);
    };

    $avatar.on("mouseenter", showHoverCard);
    $avatar.on("mouseleave", hideHoverCard);
  });
});

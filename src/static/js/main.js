import $ from "jquery";
import { computePosition, hide } from "@floating-ui/dom";
import * as bootstrap from "bootstrap";

$.noConflict();

function removeHoverCard(el) {
  setTimeout(() => {
    el.remove();
  }, 100);

  el.classList.remove("show");
  el.classList.add("hide");
}

$(function () {
  const hoverCards = $("[data-hover-card-url]");

  // iterate over each hover card element
  hoverCards.each(function () {
    const hoverCard = $(this);
    const url = hoverCard.data("hover-card-url");


    // fetch the hover card content on mouse enter
    hoverCard.on("mouseenter", function () {
      document.querySelectorAll(".popover").forEach((el) => {
        removeHoverCard(el);
      });

      $.ajax({
        url: url,
        method: "GET",
        cache: true,
        success: function (data) {
          if (document.querySelector(`#tooltip[data-hover-card-url='${url}']`)) {
            return;
          }

          const popoverEl = document.createElement("div");
          popoverEl.innerHTML = data;
          popoverEl.setAttribute("id", `tooltip`);
          popoverEl.setAttribute("data-hover-card-url", url);
          popoverEl.classList.add("popover", "fade", "hide");
          $("body").append(popoverEl);

          computePosition(hoverCard[0], popoverEl, {
            placement: "top-start",
          }).then(({ x, y }) => {
            popoverEl.style.left = `${x}px`;
            popoverEl.style.top = `${y-16}px`;
          });

          setTimeout(() => {
            popoverEl.classList.remove("hide");
            popoverEl.classList.add("show");
          }, 100);
        },
      });
    });

    // remove the hover card content on mouse leave
    hoverCard.on("mouseleave", function () {
      const popoverEl = document.querySelector(`#tooltip[data-hover-card-url='${url}']`);
      let mouseOverCard = false;

      setTimeout(() => {
        if (mouseOverCard) {
          return;
        }

        removeHoverCard(popoverEl);
      }, 200);

      popoverEl.addEventListener("mouseenter", function () {
        mouseOverCard = true;
      });

      popoverEl.addEventListener("mouseleave", function () {
        mouseOverCard = false;
        removeHoverCard(popoverEl);
      });
    });
  });
});

import $ from "jquery";

$(function () {
  const $forms = $("form");

  $forms.each(function () {
    const $form = $(this);
    const $checkboxes = $(this).find("input[type=checkbox]");

    $checkboxes.each(function () {
      const $checkbox = $(this);
      $checkbox.val("false");

      $checkbox.on("change", function () {
        if ($checkbox.is(":checked")) {
          $checkbox.val("true");
        } else {
          $checkbox.val("false");
        }
      });
    });

    const $passwordVisibilityToggle = $(this).find("#passwordVisibilityToggle");

    if ($passwordVisibilityToggle.length) {
      const $btn = $passwordVisibilityToggle.find("button");
      const $btnIcon = $btn.find("i");

      $btn.on("click", function () {
        const $passwordInput = $form.find(`#${$btn.data("target")}`);
        console.log($btn.attr("aria-pressed"));

        if ($btn.attr("aria-pressed") === "false") {
          $btn.attr("aria-pressed", true);
          $passwordInput.attr("type", "text");
          $btnIcon.removeClass("bi-eye").addClass("bi-eye-slash");
        } else {
          $btn.attr("aria-pressed", false);
          $passwordInput.attr("type", "password");
          $btnIcon.removeClass("bi-eye-slash").addClass("bi-eye");
        }
      });
    }
  });
});

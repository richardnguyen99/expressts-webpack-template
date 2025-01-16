import $ from "jquery";

$(function () {
  const $forms = $("form");

  $forms.each(function () {
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
  });
});

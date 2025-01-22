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

    const $formPasswords = $(this).find(".form-password");

    $formPasswords.each(function () {
      const $formPassword = $(this);
      const $btn = $formPassword.find("button");
      const $btnIcon = $btn.find("i");

      $btn.on("click", function () {
        const $passwordInput = $form.find(`#${$btn.data("target")}`);

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
    });
  });
});

$(function userMobilePagination() {
  const $userMp = $(".user__mobile-pagination");
  if ($userMp.length <= 0) {
    return;
  }

  const $form = $userMp.find("form");
  if ($form.length <= 0) {
    return;
  }

  $form.on("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const qs = new URLSearchParams(formData).toString();

    window.location.search = qs;
  });
});

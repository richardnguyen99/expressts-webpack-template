(() => {
  "use strict";

  const getStoredTheme = () => localStorage.getItem("theme");
  const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (storedTheme) {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const setTheme = (theme) => {
    if (theme === "auto") {
      document.documentElement.setAttribute(
        "data-bs-theme",
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    } else {
      document.documentElement.setAttribute("data-bs-theme", theme);
    }
  };

  setTheme(getPreferredTheme());

  const showActiveTheme = (theme, focus = false) => {
    const themeSwitcher = document.querySelector("#themeSwitch");

    if (theme === "dark") {
      themeSwitcher.checked = true;
    }

    if (focus) {
      themeSwitcher.focus();
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    showActiveTheme(getPreferredTheme());

    const themeSwitcher = document.querySelector("#themeSwitch");

    themeSwitcher.addEventListener("change", (event) => {
      const theme = event.target.checked ? "dark" : "light";
      setStoredTheme(theme);
      setTheme(theme);
    });
  });


  setTheme(getPreferredTheme());
})();

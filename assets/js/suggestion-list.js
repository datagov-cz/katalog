window.addEventListener("load", () => {
  const searchElement = document.querySelector("#search");

  const initialValue = document.querySelector("#search gov-form-input").value;
  let value = initialValue;

  // Handle change in text box, save new value.
  function onInput(event) {
    value = event.target.value;
  }

  // On key down we need to detect enter to perform submit.
  function onKeyDown(event) {
    if (event.detail.originalEvent.code === "Enter") {
      onSubmit();
    }
  }

  function onSubmit() {
    if (value === initialValue) {
      return;
    }
    const urlTemplate = searchElement.getAttribute("href");
    const url = urlTemplate.replace("_QUERY_", encodeURIComponent(value));
    window.location.href = url;
  }

  function onClick() {
    onSubmit();
  }

  // Register events.
  searchElement.addEventListener("gov-input", onInput);
  searchElement.addEventListener("gov-keydown", onKeyDown);
  searchElement.addEventListener("gov-click", onClick);

  registerPageSizeHandler();
});

function registerPageSizeHandler() {
  const paginatorElement = document.querySelector("#page-size");
  paginatorElement.addEventListener("gov-change", (event) => {
    const pageSize = event.target.value;
    const url = event.target.dataset.href.replace("_PAGE_SIZE_", pageSize);
    window.location.href = url;
  });
}

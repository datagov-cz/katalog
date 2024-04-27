window.addEventListener("load", () => {
  const search = document.querySelector("#search");
  const initialValue = document.querySelector("#search gov-form-input").value;
  let value = initialValue;

  function onInput(event) {
    value = event.target.value;
  }

  function onKeyDown(event) {
    if (event.detail.originalEvent.code === "Enter") {
      onSubmit();
    }
  }

  function onSubmit() {
    if (value === initialValue) {
      return;
    }
    const urlTemplate = search.getAttribute("href");
    const url = urlTemplate.replace("_QUERY_", encodeURIComponent(value));
    window.location.href = url;
  }

  function onClick() {
    onSubmit();
  }

  // Register event.
  search.addEventListener("gov-input", onInput);
  search.addEventListener("gov-keydown", onKeyDown);
  search.addEventListener("gov-click", onClick);
});

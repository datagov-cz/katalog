(() => {
  const form = document.getElementById("search");
  form.addEventListener("submit",
   (event) => handleSubmit(form, event));
})();

function handleSubmit(form, event) {
  event.preventDefault();
  // 
  const baseUrl = form.dataset.url;
  const queryName = form.dataset.queryName;
  const value = form.elements["query"].value;
  let url = baseUrl;
  if (value !== "") {
    if (url.includes("?")) {
      url += "&";
    } else {
      url += "?";
    }
    url += encodeURIComponent(queryName) + "=" + encodeURIComponent(value);
  }
  window.location.href = url;
}

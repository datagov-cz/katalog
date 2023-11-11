(() => {
  const searchForm = document.getElementById("search");
  searchForm.addEventListener("formdata", removeEmptyArguments);  
})();

function removeEmptyArguments(event) {  
  const formData = event.formData;
  // Add from URL query.
  const urlParams = new URLSearchParams(window.location.search);
  for (const [key, value] of urlParams.entries()) {
    if (formData.has(key)) {
      continue;
    }
    formData.append(key, value);
  }
  // Remove empty.
  for (const [name, value] of formData) {
    if (value === '') {
      formData.delete(name);
    }
  }  
}

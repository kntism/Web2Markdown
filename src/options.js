document.addEventListener("DOMContentLoaded", () => {
  const saveButton = document.getElementById("save");
  const excludeTagsInput = document.getElementById("excludeTags");

  // Load saved settings
  chrome.storage.sync.get(["excludeTags"], (result) => {
    if (result.excludeTags) {
      excludeTagsInput.value = result.excludeTags;
    }
  });

  saveButton.addEventListener("click", () => {
    const excludeTags = excludeTagsInput.value;
    console.log("Saving exclude tags:", excludeTags);
    chrome.storage.sync.set({ excludeTags }, () => {
      alert("Settings saved!");
    });
  });
});

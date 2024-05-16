document.addEventListener("DOMContentLoaded", () => {
  const convertButton = document.getElementById("convertToMarkdown");
  const messageDiv = document.getElementById("message");

  convertButton.addEventListener("click", () => {
    messageDiv.textContent = "Converting...";
    convertPageToMarkdown()
      .then(() => {
        messageDiv.textContent = "Conversion successful! Download started.";
      })
      .catch((error) => {
        messageDiv.textContent = `Error: ${error.message}`;
      });
  });
});

function convertPageToMarkdown() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      let tab = tabs[0];
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ["lib/turndown.js"],
        },
        () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
            return;
          }

          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: captureAndConvertBodyContent,
            },
            () => {
              if (chrome.runtime.lastError) {
                reject(new Error(chrome.runtime.lastError.message));
              } else {
                resolve();
              }
            }
          );
        }
      );
    });
  });
}

function captureAndConvertBodyContent() {
  // Retrieve excludeTags setting
  chrome.storage.sync.get(["excludeTags"], (result) => {
    const excludeTags = result.excludeTags || ""; // Default to empty string if setting not found
    convertBodyContent(excludeTags);
  });
  function convertBodyContent(excludeTags) {
    function removeUnwantedTags(element) {
      // Split the excludeTags string into an array
      const tagsToRemove = excludeTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // Remove unwanted tags
      tagsToRemove.forEach((tag) => {
        const elements = element.getElementsByTagName(tag);
        while (elements[0]) {
          elements[0].parentNode.removeChild(elements[0]);
        }
      });
    }

    const turndownService = new TurndownService();
    const bodyContent = document.body.cloneNode(true);
    removeUnwantedTags(bodyContent);
    const html = bodyContent.innerHTML;
    const markdown = turndownService.turndown(html);

    const pageTitle = document.title;
    const sanitizedTitle = pageTitle.replace(/[<>:"/\\|?*, ]+/g, "_");
    const fileName = `${sanitizedTitle}.md`;

    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
}

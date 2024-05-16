// Include Turndown
//const script = document.createElement("script");
//script.src = "lib/turndown.js";
//document.head.appendChild(script);

/** 
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("convertToMarkdown").addEventListener("click", () => {
    console.log("Converting page to Markdown...");
    convertPageToMarkdown();
  });
});

function convertPageToMarkdown() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let tab = tabs[0];
    console.log("Tab:", tab);
    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        files: ["lib/turndown.js"], // Inject Turndown library
      },
      () => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: captureAndConvertBodyContent,
        });
      }
    );
  });
}

function captureAndConvertBodyContent() {
  // Remove <script>/<style>/<header>/<footer> tags
  function removeUnwantedTags(element) {
    const tagsToRemove = ["script", "style", "header", "footer"];
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

  // Get the page title and create a valid file name
  const pageTitle = document.title;
  const sanitizedTitle = pageTitle.replace(/[<>:"/\\|?*, ]+/g, "_"); // Sanitize title to be a valid filename
  const fileName = `${sanitizedTitle}.md`;

  const blob = new Blob([markdown], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  console.log("Downloading Markdown file...");
  a.click();
  URL.revokeObjectURL(url);
}

*/

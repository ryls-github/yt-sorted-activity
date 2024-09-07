const button = document.getElementById("show-sorted-activity")
const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

if (!tab.url.startsWith("https://www.youtube.com/")) {
	button.disabled = true
	button.textContent = "YouTube 内でのみ実行できます"
}

button.onclick = async () => {
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content-script.js"],
	})
}

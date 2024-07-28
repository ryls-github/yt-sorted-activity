document.getElementById("show-sorted-activity").onclick = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
	if (!tab.url.startsWith("https://www.youtube.com/")) {
		alert("YouTube 内でのみ実行できます")
		return
	}
	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		files: ["content-script.js"],
	})
}

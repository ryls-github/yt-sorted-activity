/// YouTube のアクティビティ画面の情報を日付順に並べて表示する

if (!document.getElementById("yt-sorted-activity")) {
	const main = () => {
		try {
			if (!document.querySelector("ytd-browse[page-subtype=subscriptions]")) {
				throw new Error("登録チャンネルページを開いてください")
			}
			const selector = "ytd-browse[page-subtype=subscriptions] ytd-rich-grid-renderer ytd-rich-item-renderer.ytd-rich-grid-renderer"
			const items = [...document.querySelectorAll(selector)]
			const element = createSortedActivity(items)
			document.body.append(element)
		} catch (err) {
			console.error(err)
			alert(err.message)
		}
	}
	const createSortedActivity = (items) => {
		const host = document.createElement("div")
		host.id = "yt-sorted-activity"
		const root = host.attachShadow({ mode: "open" })
		const sheet = new CSSStyleSheet()
		sheet.replaceSync(`
			.container {
				position: fixed;
				inset: 0;
				margin: auto;
				width: 90%;
				height: 90%;
				background: white;
				box-shadow: 0 0 5px 3px #0003;
				z-index: 99999;
				display: flex;
				flex-flow: column;
			}
			.header {
				display: flex;
				justify-content: flex-end;
				padding: 4px;
				flex: none;
			}
			.body {
				display: flex;
				gap: 20px;
				flex: 1 0 0;
				padding: 20px;
			}
			.column {
				display: flex;
				flex-flow: column;
				flex: 1 0 0;
			}
			.list {
				flex: 1 0 0;
				overflow: auto;
				display: flex;
				flex-flow: column;
				gap: 10px;
			}
			.item {
				display: flex;
				gap: 10px;
				overflow-wrap: break-word;
				img {
					width: 140px;
					flex: none;
					height: auto;
				}
			}
		`)
		root.adoptedStyleSheets = [sheet]
		const data = items.map(item => {
			const img = item.querySelector("ytd-thumbnail img").cloneNode(true)
			const title = item.querySelector("#meta h3 a").textContent
			const channel = item.querySelector("ytd-channel-name #text").textContent
			const time = [...item.querySelectorAll("#metadata-line span.inline-metadata-item")].at(-1)?.textContent

			if (!time || time.includes("視聴中")) {
				return { img, title, channel, time, type: "now" }
			}
			// 未来
			if (time.includes("公開予定") || time.includes("プレミア公開")) {
				const matched = time.match(/(\d+)\/(\d+)\/(\d+) (\d+):(\d+)/)
				if (!matched) {
					throw new Error("不正な未来の日付があります", { cause: { time, title, item } })
				}
				const value = +new Date(matched[1], matched[2] - 1, matched[3], matched[4], matched[5])
				return { img, title, channel, time, type: "future", value }
			}
			// 過去
			// 配信済みは動画だと含まれないので「前」だけで探す
			if (time.includes("前")) {
				const matched = time.match(/(\d+) (秒前|分前|時間前|日前|か月前|年前)/)
				if (!matched) {
					throw new Error("不正な過去の日付があります", { cause: { time, title, item } })
				}
				const value = matched[1] * {
					"秒前": 1,
					"分前": 100,
					"時間前": 100000,
					"日前": 10000000,
					"か月前": 1000000000,
					"年前": 100000000000,
				}[matched[2]]
				return { img, title, channel, time, type: "old", value }
			}
			throw new Error("不正なエントリです", { cause: { time, title, item } })
		})
		const future_items = data.filter(x => x.type === "future").sort((a, b) => b.value - a.value)
		const now_items = data.filter(x => x.type === "now")
		const old_items = data.filter(x => x.type === "old").sort((a, b) => a.value - b.value)
		const h = (tag, props, children) => {
			const element = Object.assign(document.createElement(tag), props)
			element.append(...children ?? [])
			return element
		}
		const mkItemDOM = item => {
			return h("div", { className: "item" }, [
				item.img,
				h("div", {}, [
					h("div", {}, [item.title]),
					h("div", {}, [item.channel]),
					h("div", {}, [item.time]),
				])
			])
		}
		root.append(
			h("div", { className: "container" }, [
				h("div", { className: "header" }, [
					h("button", { textContent: "✕", onclick: () => host.remove() })
				]),
				h("div", { className: "body" }, [
					h("div", { className: "column" }, [
						h("p", {}, ["配信予定"]),
						h("div", { className: "list" }, future_items.map(item => mkItemDOM(item)))
					]),
					h("div", { className: "column" }, [
						h("p", {}, ["配信中"]),
						h("div", { className: "list" }, now_items.map(item => mkItemDOM(item)))
					]),
					h("div", { className: "column" }, [
						h("p", {}, ["配信済"]),
						h("div", { className: "list" }, old_items.map(item => mkItemDOM(item)))
					]),
				])
			])
		)
		return host
	}
	main()
}

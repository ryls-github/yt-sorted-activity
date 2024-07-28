# YouTube のアクティビティ画面を並び替えて表示

チャンネル登録したチャンネルの配信予定・公開予定が日付順に並ばないので並び替える

一応ブラウザ拡張機能の形にしてるけど、やることはボタンを押したときにページ内で実行するスクリプトを埋め込むだけ

`content-script.js` の中身をコピーして、YouTube のページでコンソールを開いて貼り付けて実行しても同じ

やってること：

- 実行すると DOM から取れる情報で動画の一覧取得
- ダイアログで配信予定、配信中、配信済みの 3 列に分けて表示

注意点：

- 対象は DOM に存在する範囲なので古いデータも取得するなら下の方までスクロールが必要
- サムネイルは画面上で表示されるまで取得しないようになってるので、 DOM に存在するけどまだ表示してない部分はサムネイルが表示されない
- YouTube の DOM 構造に依存するので構造が変わると動かなくなる
- チャンネル登録の一覧を一度開かないと DOM にデータが存在しない

---

その他： YouTube API

最初はこっちでやろうとしたけどチャンネル登録してる全体のアクティビティ画面に相当する動きをしてくれる API がなかった  
ググっても複数の API を組み合わせる方法が説明されてた

自身のチャンネル登録一覧を取得 → それぞれのチャンネルに対してアクティビティ取得 → 個別の動画情報を取得

API 呼び出しの回数がすごいことになるのでやめた

ブラウザの画面に出てるのだからこの情報を利用できる方法にした
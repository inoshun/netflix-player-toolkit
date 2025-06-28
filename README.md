# Netflix Player Toolkit

Netflixで動画の特定の時間範囲を繰り返し再生するためのブラウザ拡張ツールです。

## 機能

- 動画の指定した時間範囲を自動でループ再生
- URLパラメータで開始時間と終了時間を指定

## インストール方法

1. [Tampermonkey](https://www.tampermonkey.net/)などのユーザースクリプト拡張をブラウザにインストール
2. [こちらのリンク](https://inoshun.github.io/netflix-player-toolkit/userscript.js)からスクリプトをインストール

## 使い方

NetflixのURLに以下のパラメータを追加してアクセスしてください：

```
https://www.netflix.com/watch/123456?startSeconds=60&endSeconds=120
```

- `startSeconds`: 開始時間（秒）
- `endSeconds`: 終了時間（秒）

指定した時間範囲が自動で繰り返し再生されます。

## 開発

### セットアップ

```bash
npm install
```

### ビルド

```bash
npm run build
```
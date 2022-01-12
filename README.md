# 15パズル

## これは何？
- PCブラウザーをターゲットとする簡単な15パズルを実装する。

## 概要
- 表示内容（ダイアログを除く）
    - 表題（１５パズル）
    - 4 X 4 の盤面
    - 枠の中に1 ～ 15のボタン＋空きマスを表示する
    - シャッフルボタン
- シャッフル
    - 初期表示の時、またはシャッフルボタンが押された時、盤面のシャッフルを行う。
    - 完成状態から開始して、100回程度ランダムにボタンの移動を行う。
    - 上記ではアニメーションせず、移動を行った結果のみ表示する。
- シャッフル以外の操作
    - 数字ボタンをクリックすると、周囲をチェックし、周囲に空きマスがあればスライドする。
    - 15パズルの完成時には、ダイアログでメッセージを表示する。

## 技術的コンセプト
- Vite / React / Typescript
    - yarn crate vite -> react-ts で初期生成。
- コンポーネントはMaterial-UIベースとする。
    - Material-UI v5は時期尚早と感じるため、v4を利用する。
    - 汎用ダイアログはMuiDialogを使用し、コンテキスト経由で使用できるようにする。
        - 完了時のメッセージダイアログ
        - 操作のブロック
- ステートストアは、ReduxやMobXは大げさすぎるため、Immer のみ使用する。
    - ストアはReact Context経由で下位コンポーネントへ渡す。
    - アクションはステートのルートを引数に取り、ステートのルートを返す関数とする。
        - アクションをdispatch関数に引き渡すとステートの更新を実施する。
        - 引数はカリー化引数として渡す。
    - 必要なステートの更新時にコンポーネントを更新するHook(useSelector)を用意する。
- コンポーネントは関数コンポーネントとする。
    - 基本的に１ファイル１コンポーネントとする。
    - Props / State には型をつける。
- 4 x 4 の盤面は、Flex Boxとして表現する。
- ボタンの移動は、CSSアニメーションとして表現する。
    - アニメーションを行っている最中は、操作をブロックする。
- 発生しえないものの、サンプルとしてエラーバウンダリを設ける。

## ディレクトリ構成
- root
    - src
        - components: Reactコンポーネント
            - Providers: プロバイダー
                - StoreProvider: ステートストア
                - DialogProvider: ダイアログ
            - Boudaries: バウンダリ
                - ErrorBoundary: エラーバウンダリ
            - Buttons: ボタン
                - SlideButton: 数字を表示する
            - Panels: 矩形
                - BoardPanel: 4 x 4 の盤面
            - Dialogs: ダイアログ
        - store: ステートストアの定義とアクション
            - actions: ステートストアを更新する関数群
        - lib: 汎用的なライブラリ
            - sliding: 15パズル用のロジック
    - e2e: E2Eテストのサンプル
    - dist: yarn build をした際に生成する。

## 依存ライブラリ
- react
- material-ui/clsx: 画面のベース
- utility-types: DeepReadonly等で利用
- immer: ステートストアの更新用
- eventemitter3: ステートストアへのサブスクライブ用
- shallowequal: 未使用。useSelectorで使用できるように組み込んでおく

## テスト
- コアロジックの単体テスト（Jest）
  yarn test
- E2E自動化テスト（Using puppeteer）
  yarn test:all

## デモページ

[GitHub Pages](https://ts-akasaka.github.io/vite-15-puzzle/)

## TO IMPROVE（ここで実装しなかった・考慮しなかったもの）
- SPA
- SEO
- デザイン
- JS Doc
- アンマウント後のステート更新⇒React18では意識の必要がなくなる。

## ライセンス
MIT

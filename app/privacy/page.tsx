import Link from "next/link";

export const metadata = {
  title: "プライバシーポリシー - kotonoha wordle",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          プライバシーポリシー
        </h1>
        
        <p className="text-zinc-400 mb-8">最終更新日: 2024年12月3日</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">1. はじめに</h2>
          <p className="text-zinc-300 leading-relaxed">
            kotonoha wordle（以下「本アプリ」）は、ユーザーのプライバシーを尊重し、
            個人情報の保護に努めています。本プライバシーポリシーでは、
            本アプリがどのような情報を収集し、どのように使用するかについて説明します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">2. 収集する情報</h2>
          <p className="text-zinc-300 leading-relaxed mb-3">
            本アプリは、Discord Activity として動作する際に以下の情報を取得します：
          </p>
          <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
            <li>Discord ユーザーID</li>
            <li>Discord ユーザー名</li>
            <li>Discord アバター画像URL</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">3. 情報の使用目的</h2>
          <p className="text-zinc-300 leading-relaxed">
            収集した情報は、以下の目的にのみ使用されます：
          </p>
          <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-3">
            <li>ゲーム体験の提供</li>
            <li>ユーザーの識別（マルチプレイヤー機能のため）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">4. 情報の保存</h2>
          <p className="text-zinc-300 leading-relaxed">
            本アプリは、ユーザーの個人情報をサーバーに保存しません。
            すべてのゲームデータはセッション中のみメモリに保持され、
            セッション終了後に破棄されます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">5. 第三者への提供</h2>
          <p className="text-zinc-300 leading-relaxed">
            本アプリは、ユーザーの個人情報を第三者に販売、貸与、
            または共有することはありません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">6. お問い合わせ</h2>
          <p className="text-zinc-300 leading-relaxed">
            本プライバシーポリシーに関するご質問やお問い合わせは、
            Discord サーバーまたは開発者までご連絡ください。
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-zinc-700">
          <Link 
            href="/" 
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            ← ゲームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}


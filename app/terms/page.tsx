import Link from "next/link";

export const metadata = {
  title: "利用規約 - kotonoha wordle",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          利用規約
        </h1>
        
        <p className="text-zinc-400 mb-8">最終更新日: 2024年12月3日</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">1. サービスの概要</h2>
          <p className="text-zinc-300 leading-relaxed">
            kotonoha wordle（以下「本サービス」）は、Discord Activity として提供される
            日本語版 Wordle ゲームです。ユーザーは Discord 内でひらがな5文字の
            単語を当てるゲームをプレイできます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">2. 利用条件</h2>
          <p className="text-zinc-300 leading-relaxed">
            本サービスを利用するには、Discord アカウントが必要です。
            本サービスの利用により、本利用規約に同意したものとみなされます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">3. 禁止事項</h2>
          <p className="text-zinc-300 leading-relaxed mb-3">
            ユーザーは、以下の行為を行ってはなりません：
          </p>
          <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
            <li>本サービスの不正利用または悪用</li>
            <li>他のユーザーへの嫌がらせ行為</li>
            <li>本サービスのシステムへの不正アクセス</li>
            <li>本サービスの改ざんまたはリバースエンジニアリング</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">4. 免責事項</h2>
          <p className="text-zinc-300 leading-relaxed">
            本サービスは「現状有姿」で提供されます。開発者は、本サービスの
            動作の中断、エラー、データの損失などについて責任を負いません。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">5. サービスの変更・終了</h2>
          <p className="text-zinc-300 leading-relaxed">
            開発者は、事前の通知なく本サービスの内容を変更、
            または本サービスを終了する権利を有します。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">6. 規約の変更</h2>
          <p className="text-zinc-300 leading-relaxed">
            本利用規約は、必要に応じて変更されることがあります。
            変更後も本サービスを継続して利用することで、
            変更後の規約に同意したものとみなされます。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3 text-emerald-400">7. 準拠法</h2>
          <p className="text-zinc-300 leading-relaxed">
            本利用規約は、日本法に準拠し、解釈されるものとします。
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


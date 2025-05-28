// app/book/[id]/page.tsx
import Image from "next/image";
import { getDetailBook } from "@/app/lib/microcms/client";
import React, { use } from "react"; // ← use() でも await でも可

// ① params を Promise として受け取る
export default async function DetailBook({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // ② 好みでどちらか１つ
  // const { id } = await params;         // A. async/await で展開
  const { id } = use(params);            // B. React 19 の use() で展開

  // ③ 取得
  const book = await getDetailBook(id);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* サムネイル (null ガードを入れると安心) */}
        {book.thumbnail?.url && (
          <Image
            src={book.thumbnail.url}
            alt={book.title}
            className="w-full h-80 object-cover object-center"
            width={700}
            height={700}
            priority
          />
        )}

        <div className="p-4">
          <h2 className="text-2xl font-bold">{book.title}</h2>

          {/* microCMS のリッチテキストを描画 */}
          <div
            className="text-gray-700 mt-2 prose max-w-none"
            dangerouslySetInnerHTML={{ __html: book.content }}
          />

          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>
              公開日:{" "}
              {new Date(book.publishedAt ?? book.createdAt).toLocaleString()}
            </span>
            <span>最終更新: {new Date(book.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link"; // Link は現在使用されていませんが、将来のために残しておいても問題ありません
import { BookType } from "../types/types";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
type BookProps = {
  book: BookType;
  isPurchased: boolean; // 購入済みかどうかのフラグ
};

// 修正点：コンポーネントを名前付きの定数として定義し、後でエクスポートする
const Book = ({ book,isPurchased }: BookProps) => {
  const [showModal, setShowModal] = useState(false);
  const {data: session} = useSession();
  const user:any  = session?.user;
  const router = useRouter();
  const startCheckout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`,
        {
          method: "POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({
            title: book.title,
            price: book.price,
            userId: user?.id, // ユーザーIDを取得
            bookId: book.id, // bookIdを取得
          })
        }
      )
      const responseData = await response.json();
      if (responseData) {
        router.push(responseData.checkout_url);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handlePurchaseClick = () => {
    if (isPurchased) {
      alert("この本はすでに購入済みです。");
    }
    else {
      setShowModal(true);
    }
    
  };

  const handleCancel = () => {
    setShowModal(false);
  };
  const handlePurchaseConfirm = () => {
    if (!user) {
      setShowModal(false);
      //ログインページへリダイレクト
      router.push("/login")
    }
    else {
      startCheckout()
    }
  }

  return (
    <>
      {/* アニメーションスタイル */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="flex flex-col items-center m-4">
        <a
          onClick={handlePurchaseClick}
          className="cursor-pointer shadow-2xl duration-300 hover:translate-y-1 hover:shadow-none"
        >
          <Image
            priority
            src={book.thumbnail.url}
            alt={book.title}
            width={450}
            height={350}
            className="rounded-t-md"
          />
          <div className="px-4 py-4 bg-slate-100 rounded-b-md">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="mt-2 text-md text-slate-700">値段：{book.price}円</p>
          </div>
        </a>
        {showModal && (
          <div
            className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-50 px-4"
          >
            <div
              // モーダルの背景に透明性を持たせる (例: 白色で85%の不透明度)
              className="modal bg-white bg-opacity-85 p-6 rounded-lg shadow-xl w-full max-w-sm sm:max-w-md"
            >
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                本を購入しますか？
              </h3>
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={handlePurchaseConfirm}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
                >
                  購入する
                </button>
                <button onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-md"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Book; // 修正点：ここでコンポーネントをエクスポートする
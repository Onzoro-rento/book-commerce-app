import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// /app/api/purchases/[userId]/route.ts
type Params = Promise<{ userId: string }>;

export async function GET(
  _req: Request,
  { params }: { params: Params }
) {
  // Promise なので await する
  const { userId } = await params;

  try {
    const purchases = await prisma.purchase.findMany({ where: { userId } });
    return NextResponse.json(purchases);
  } catch (error) {
    console.error("購入履歴の取得エラー:", error);
    return NextResponse.json(
      { error: "購入履歴の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

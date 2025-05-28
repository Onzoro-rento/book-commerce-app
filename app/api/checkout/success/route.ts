//購入履歴の保存
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(request: Request, Response: Response) {

    const {sessionId} = await request.json();
    try {
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        const existingPurchase = await prisma.purchase.findFirst({
            where: {
                userId: session.client_reference_id!, // ユーザーIDをクライアントリファレンスIDとして使用
                bookId: session.metadata?.bookId! // bookIdはメタデータから取得
            }
        })
        if (!existingPurchase) {

        const purchase = await prisma.purchase.create({
            data: {
                userId: session.client_reference_id!, // ユーザーIDをクライアントリファレンスIDとして使用
                bookId: session.metadata?.bookId!, // bookIdはメタデータから取得
              
            }
        });
        return NextResponse.json({purchase});}
        else {
            return NextResponse.json({message: "すでに購入済みです。"});
        }

    } catch (err: any) {
        return NextResponse.json(err.message);
    }

 
}
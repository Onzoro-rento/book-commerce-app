import { createClient } from 'microcms-js-sdk';
import {BookType} from "@/app/types/types";

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!, 
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

export const getAllBooks = async () => {
    const allBooks = await client.getList<BookType>({
        endpoint: "bookcommerce"
    });

    return allBooks;
};
export const getDetailBook = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "bookcommerce",
    contentId: contentId,
});
  return detailBook

}
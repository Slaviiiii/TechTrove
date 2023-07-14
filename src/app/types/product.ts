import { UserId } from "./user-id";

export interface Product {
    name: string;
    price: number;
    img: string;
    description: string;
    _id: string;
    userId: UserId;
    created_at: string;
    updatedAt: string;
    __v: number;
}
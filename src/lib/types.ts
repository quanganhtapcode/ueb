import type { Timestamp } from 'firebase/firestore';

export const SINGLE_PRODUCT_ID = 'bracelet-v1';
export const SINGLE_PRODUCT_SYMBOL = 'UEB-BRACELET';
export const SINGLE_PRODUCT_NAME = 'Vòng tay UEB';

export type MarketSide = 'buy' | 'sell';

export type OrderStatus = 'open' | 'partial' | 'filled' | 'cancelled';

export interface MarketOrder {
  id: string;
  productId: string;
  side: MarketSide;
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  userId: string;
  userEmail: string;
  userDisplayName: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  cancelledAt: Date | null;
}

export interface MarketMatch {
  id: string;
  productId: string;
  buyOrderId: string;
  sellOrderId: string;
  buyUserId: string;
  sellUserId: string;
  buyUserEmail: string | null;
  sellUserEmail: string | null;
  price: number;
  quantity: number;
  chatId: string;
  createdAt: Date | null;
}

export interface MarketChat {
  id: string;
  productId: string;
  matchId: string;
  participantIds: string[];
  lastMessageText: string | null;
  lastMessageAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderUserId: string;
  text: string;
  createdAt: Date | null;
}

export interface OrderBookLevel {
  price: number;
  quantity: number;
  orderCount: number;
}

export interface OrderBookView {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface PlaceOrderUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface FirestoreOrderDoc {
  productId: string;
  side: MarketSide;
  price: number;
  quantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  userId: string;
  userEmail: string;
  userDisplayName: string | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
  cancelledAt?: Timestamp | null;
}

export interface FirestoreMatchDoc {
  productId: string;
  buyOrderId: string;
  sellOrderId: string;
  buyUserId: string;
  sellUserId: string;
  buyUserEmail?: string | null;
  sellUserEmail?: string | null;
  price: number;
  quantity: number;
  chatId: string;
  createdAt: Timestamp | null;
}

export interface FirestoreChatDoc {
  productId: string;
  matchId: string;
  participantIds: string[];
  lastMessageText?: string | null;
  lastMessageAt?: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

export interface FirestoreMessageDoc {
  chatId: string;
  senderUserId: string;
  text: string;
  createdAt: Timestamp | null;
}

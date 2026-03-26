import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  SINGLE_PRODUCT_ID,
  type ChatMessage,
  type FirestoreChatDoc,
  type FirestoreMatchDoc,
  type FirestoreMessageDoc,
  type FirestoreOrderDoc,
  type MarketChat,
  type MarketMatch,
  type MarketOrder,
  type MarketSide,
  type OrderBookLevel,
  type OrderBookView,
  type PlaceOrderUser,
} from '@/lib/types';

const COLLECTIONS = {
  orders: 'orders',
  matches: 'matches',
  chats: 'chats',
  messages: 'messages',
} as const;

function toDate(value: Timestamp | null | undefined): Date | null {
  return value ? value.toDate() : null;
}

function ensureNonEmptyString(value: string, field: string): void {
  if (!value.trim()) {
    throw new Error(`${field} is required.`);
  }
}

function normalizeError(error: unknown, fallback: string): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(fallback);
}

function mapOrder(snapshot: QueryDocumentSnapshot<DocumentData>): MarketOrder {
  const data = snapshot.data() as Partial<FirestoreOrderDoc>;

  if (
    data.productId !== SINGLE_PRODUCT_ID ||
    (data.side !== 'buy' && data.side !== 'sell') ||
    typeof data.price !== 'number' ||
    typeof data.quantity !== 'number' ||
    typeof data.remainingQuantity !== 'number' ||
    typeof data.userId !== 'string' ||
    typeof data.userEmail !== 'string' ||
    typeof data.status !== 'string'
  ) {
    throw new Error(`Order ${snapshot.id} has invalid data.`);
  }

  return {
    id: snapshot.id,
    productId: data.productId,
    side: data.side,
    price: data.price,
    quantity: data.quantity,
    remainingQuantity: data.remainingQuantity,
    status: data.status,
    userId: data.userId,
    userEmail: data.userEmail,
    userDisplayName: data.userDisplayName ?? null,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    cancelledAt: toDate(data.cancelledAt),
  };
}

function mapMatch(snapshot: QueryDocumentSnapshot<DocumentData>): MarketMatch {
  const data = snapshot.data() as Partial<FirestoreMatchDoc>;

  if (
    data.productId !== SINGLE_PRODUCT_ID ||
    typeof data.buyOrderId !== 'string' ||
    typeof data.sellOrderId !== 'string' ||
    typeof data.buyUserId !== 'string' ||
    typeof data.sellUserId !== 'string' ||
    typeof data.price !== 'number' ||
    typeof data.quantity !== 'number' ||
    typeof data.chatId !== 'string'
  ) {
    throw new Error(`Match ${snapshot.id} has invalid data.`);
  }

  return {
    id: snapshot.id,
    productId: data.productId,
    buyOrderId: data.buyOrderId,
    sellOrderId: data.sellOrderId,
    buyUserId: data.buyUserId,
    sellUserId: data.sellUserId,
    buyUserEmail: typeof data.buyUserEmail === 'string' ? data.buyUserEmail : null,
    sellUserEmail: typeof data.sellUserEmail === 'string' ? data.sellUserEmail : null,
    price: data.price,
    quantity: data.quantity,
    chatId: data.chatId,
    createdAt: toDate(data.createdAt),
  };
}

function mapChat(snapshot: QueryDocumentSnapshot<DocumentData>): MarketChat {
  const data = snapshot.data() as Partial<FirestoreChatDoc>;

  if (
    data.productId !== SINGLE_PRODUCT_ID ||
    typeof data.matchId !== 'string' ||
    !Array.isArray(data.participantIds) ||
    data.participantIds.some((id) => typeof id !== 'string')
  ) {
    throw new Error(`Chat ${snapshot.id} has invalid data.`);
  }

  return {
    id: snapshot.id,
    productId: data.productId,
    matchId: data.matchId,
    participantIds: data.participantIds,
    lastMessageText: data.lastMessageText ?? null,
    lastMessageAt: toDate(data.lastMessageAt),
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
  };
}

function mapMessage(snapshot: QueryDocumentSnapshot<DocumentData>): ChatMessage {
  const data = snapshot.data() as Partial<FirestoreMessageDoc>;

  if (typeof data.chatId !== 'string' || typeof data.senderUserId !== 'string' || typeof data.text !== 'string') {
    throw new Error(`Message ${snapshot.id} has invalid data.`);
  }

  return {
    id: snapshot.id,
    chatId: data.chatId,
    senderUserId: data.senderUserId,
    text: data.text,
    createdAt: toDate(data.createdAt),
  };
}

function buildOrderBookLevels(orders: MarketOrder[], side: MarketSide): OrderBookLevel[] {
  const totals = new Map<number, { quantity: number; orderCount: number }>();

  for (const order of orders) {
    if (order.side !== side || (order.status !== 'open' && order.status !== 'partial')) {
      continue;
    }

    const current = totals.get(order.price) ?? { quantity: 0, orderCount: 0 };
    totals.set(order.price, {
      quantity: current.quantity + order.remainingQuantity,
      orderCount: current.orderCount + 1,
    });
  }

  return [...totals.entries()]
    .map(([price, value]) => ({ price, quantity: value.quantity, orderCount: value.orderCount }))
    .sort((a, b) => (side === 'buy' ? b.price - a.price : a.price - b.price));
}

function mapOrderDoc(snapshot: QueryDocumentSnapshot<DocumentData>): MarketOrder {
  return mapOrder(snapshot);
}

export async function placeOrder(side: MarketSide, price: number, quantity: number, user: PlaceOrderUser): Promise<MarketOrder> {
  if (side !== 'buy' && side !== 'sell') {
    throw new Error('Invalid side. Expected buy or sell.');
  }

  if (!Number.isFinite(price) || price <= 0) {
    throw new Error('Price must be a positive number.');
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    throw new Error('Quantity must be a positive number.');
  }

  ensureNonEmptyString(user.uid, 'user.uid');

  if (!user.email) {
    throw new Error('Authenticated user email is required to place an order.');
  }

  const orderPayload = {
    productId: SINGLE_PRODUCT_ID,
    side,
    price,
    quantity,
    remainingQuantity: quantity,
    status: 'open',
    userId: user.uid,
    userEmail: user.email,
    userDisplayName: user.displayName ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    cancelledAt: null,
  };

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.orders), orderPayload);
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error('Order created but could not be loaded.');
    }

    return mapOrderDoc(snapshot as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    throw normalizeError(error, 'Failed to place order.');
  }
}

export async function cancelOrder(orderId: string, userId: string): Promise<MarketOrder> {
  ensureNonEmptyString(orderId, 'orderId');
  ensureNonEmptyString(userId, 'userId');

  const orderRef = doc(db, COLLECTIONS.orders, orderId);

  try {
    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(orderRef);

      if (!snapshot.exists()) {
        throw new Error('Order not found.');
      }

      const data = snapshot.data() as Partial<FirestoreOrderDoc>;

      if (data.productId !== SINGLE_PRODUCT_ID) {
        throw new Error('Order does not belong to the single-product market.');
      }

      if (data.userId !== userId) {
        throw new Error('You are not allowed to cancel this order.');
      }

      if (data.status === 'filled') {
        throw new Error('Filled order cannot be cancelled.');
      }

      if (data.status === 'cancelled') {
        throw new Error('Order is already cancelled.');
      }

      transaction.update(orderRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    const updatedSnapshot = await getDoc(orderRef);
    if (!updatedSnapshot.exists()) {
      throw new Error('Cancelled order could not be loaded.');
    }

    return mapOrderDoc(updatedSnapshot as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    throw normalizeError(error, 'Failed to cancel order.');
  }
}

export function subscribeOrderBook(
  onData: (view: OrderBookView) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const ordersQuery = query(collection(db, COLLECTIONS.orders), where('productId', '==', SINGLE_PRODUCT_ID));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      try {
        const orders = snapshot.docs.map((docSnapshot) => mapOrderDoc(docSnapshot));
        onData({
          bids: buildOrderBookLevels(orders, 'buy'),
          asks: buildOrderBookLevels(orders, 'sell'),
        });
      } catch (error) {
        onError(normalizeError(error, 'Failed to map order book data.'));
      }
    },
    (error) => {
      onError(normalizeError(error, 'Failed to subscribe order book.'));
    },
  );
}

export function subscribeMyOrders(
  userId: string,
  onData: (orders: MarketOrder[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  ensureNonEmptyString(userId, 'userId');

  const ordersQuery = query(collection(db, COLLECTIONS.orders), where('userId', '==', userId));

  return onSnapshot(
    ordersQuery,
    (snapshot) => {
      try {
        const orders = snapshot.docs
          .map((docSnapshot) => mapOrderDoc(docSnapshot))
          .filter((order) => order.productId === SINGLE_PRODUCT_ID)
          .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
        onData(orders);
      } catch (error) {
        onError(normalizeError(error, 'Failed to map my orders.'));
      }
    },
    (error) => {
      onError(normalizeError(error, 'Failed to subscribe my orders.'));
    },
  );
}

export function subscribeMyMatches(
  userId: string,
  onData: (matches: MarketMatch[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  ensureNonEmptyString(userId, 'userId');

  const matchesQuery = query(collection(db, COLLECTIONS.matches), where('productId', '==', SINGLE_PRODUCT_ID));

  return onSnapshot(
    matchesQuery,
    (snapshot) => {
      try {
        const matches = snapshot.docs
          .map((docSnapshot) => mapMatch(docSnapshot))
          .filter((match) => match.buyUserId === userId || match.sellUserId === userId)
          .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
        onData(matches);
      } catch (error) {
        onError(normalizeError(error, 'Failed to map my matches.'));
      }
    },
    (error) => {
      onError(normalizeError(error, 'Failed to subscribe my matches.'));
    },
  );
}

export function subscribeMyChats(
  userId: string,
  onData: (chats: MarketChat[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  ensureNonEmptyString(userId, 'userId');

  const chatsQuery = query(collection(db, COLLECTIONS.chats), where('participantIds', 'array-contains', userId));

  return onSnapshot(
    chatsQuery,
    (snapshot) => {
      try {
        const chats = snapshot.docs
          .map((docSnapshot) => mapChat(docSnapshot))
          .filter((chat) => chat.productId === SINGLE_PRODUCT_ID)
          .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
        onData(chats);
      } catch (error) {
        onError(normalizeError(error, 'Failed to map my chats.'));
      }
    },
    (error) => {
      onError(normalizeError(error, 'Failed to subscribe my chats.'));
    },
  );
}

export function subscribeChatMessages(
  chatId: string,
  onData: (messages: ChatMessage[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  ensureNonEmptyString(chatId, 'chatId');

  const messagesQuery = query(collection(db, COLLECTIONS.chats, chatId, COLLECTIONS.messages));

  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      try {
        const messages = snapshot.docs
          .map((docSnapshot) => mapMessage(docSnapshot))
          .filter((message) => message.chatId === chatId)
          .sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0));
        onData(messages);
      } catch (error) {
        onError(normalizeError(error, 'Failed to map chat messages.'));
      }
    },
    (error) => {
      onError(normalizeError(error, 'Failed to subscribe chat messages.'));
    },
  );
}

export async function sendChatMessage(chatId: string, userId: string, text: string): Promise<ChatMessage> {
  ensureNonEmptyString(chatId, 'chatId');
  ensureNonEmptyString(userId, 'userId');

  const trimmedText = text.trim();
  if (!trimmedText) {
    throw new Error('Message text cannot be empty.');
  }

  const chatRef = doc(db, COLLECTIONS.chats, chatId);
  const messageRef = doc(collection(db, COLLECTIONS.chats, chatId, COLLECTIONS.messages));

  try {
    await runTransaction(db, async (transaction) => {
      const chatSnapshot = await transaction.get(chatRef);
      if (!chatSnapshot.exists()) {
        throw new Error('Chat not found.');
      }

      const chatData = chatSnapshot.data() as Partial<FirestoreChatDoc>;
      if (chatData.productId !== SINGLE_PRODUCT_ID) {
        throw new Error('Chat does not belong to the single-product market.');
      }

      if (!Array.isArray(chatData.participantIds) || !chatData.participantIds.includes(userId)) {
        throw new Error('You are not a participant of this chat.');
      }

      transaction.set(messageRef, {
        chatId,
        senderUserId: userId,
        text: trimmedText,
        createdAt: serverTimestamp(),
      });

      transaction.update(chatRef, {
        lastMessageText: trimmedText,
        lastMessageAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    const messageSnapshot = await getDoc(messageRef);
    if (!messageSnapshot.exists()) {
      throw new Error('Message sent but could not be loaded.');
    }

    return mapMessage(messageSnapshot as QueryDocumentSnapshot<DocumentData>);
  } catch (error) {
    throw normalizeError(error, 'Failed to send chat message.');
  }
}

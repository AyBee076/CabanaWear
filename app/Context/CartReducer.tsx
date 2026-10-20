

export type CartItem = {
  id: number;
  name: string;
  description: string;
  likes: number;
  images: string[];
  category: string;
  price: number;
  size: string[];
  fit: string;
  fabric: string;
  stock: number;
  color: string;
  quantity: number;  // added by the reducer, not in the raw data
};

export type CartState = {
  cartItems: CartItem[];
};

export type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "REMOVE_FROM_CART"; payload: number };


export const initialState = {
  cartItems: [],
};

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          ),
        };
      }

      return {
        ...state,
        cartItems: [...state.cartItems, { ...item, quantity: 1 }],
      };
    }

    case "INCREMENT": {
      const id = action.payload;

      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }

    case "DECREMENT": {
      const id = action.payload;

      return {
        ...state,
        cartItems: state.cartItems
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0),
      };
    }

    case "REMOVE_FROM_CART": {
      const id = action.payload;

      return {
        ...state,
        cartItems: state.cartItems.filter((item) => item.id !== id),
      };
    }

    default:
      return state;
  }
}
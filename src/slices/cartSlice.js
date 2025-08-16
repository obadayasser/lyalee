// src/slices/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../FireBase/Firebase';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';

const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

// -------- Thunks --------
export const fetchCartFromFirestore = createAsyncThunk(
  'cart/fetchFromFirestore',
  async (_, { rejectWithValue }) => {
    try {
      const guestId = getGuestId();
      const q = query(collection(db, 'cart'), where('guestId', '==', guestId));
      const snap = await getDocs(q);

      const productCollections = ['one', 'two', 'three', 'pageone'];

      const items = await Promise.all(
        snap.docs.map(async (d) => {
          const base = { id: d.id, ...d.data() };

          // نجيب بيانات المنتج من أي كولكشن
          let product = null;
          for (const col of productCollections) {
            const pRef = doc(db, col, base.productId);
            const pSnap = await getDoc(pRef);
            if (pSnap.exists()) {
              product = pSnap.data();
              break;
            }
          }

          return {
            ...base,
            text: base.text ?? product?.text ?? '',
            price: base.price ?? product?.price ?? 0,
            img: base.img ?? product?.img ?? null,
          };
        })
      );

      return items;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateQuantityInCart = createAsyncThunk(
  'cart/updateQuantityInCart',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, 'cart', id), { quantity });
      return { id, quantity };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromCartInFirestore = createAsyncThunk(
  'cart/removeFromCartInFirestore',
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'cart', id));
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addToCartInFirestore = createAsyncThunk(
  'cart/addToCartInFirestore',
  async (payload, { rejectWithValue }) => {
    try {
      const guestId = getGuestId();
      const docRef = await addDoc(collection(db, 'cart'), {
        ...payload,
        guestId,
        timestamp: new Date(),
      });
      return { id: docRef.id, ...payload, guestId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// -------- Slice --------
const initialState = {
  items: [],
  loading: false,
  error: null,
  subtotal: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    calculateTotals(state) {
      state.subtotal = state.items.reduce(
        (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );
    },
    addToCart(state, action) {
      state.items.push(action.payload);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const it = state.items.find((i) => i.id === id);
      if (it) it.quantity = quantity;
    },
    clearCart(state) {
      state.items = [];
      state.subtotal = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCartFromFirestore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromFirestore.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.subtotal = state.items.reduce(
          (s, i) => s + (i.price || 0) * (i.quantity || 1),
          0
        );
      })
      .addCase(fetchCartFromFirestore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch cart';
      })
      // update qty
      .addCase(updateQuantityInCart.fulfilled, (state, action) => {
        const { id, quantity } = action.payload;
        const it = state.items.find((i) => i.id === id);
        if (it) it.quantity = quantity;
        state.subtotal = state.items.reduce(
          (s, i) => s + (i.price || 0) * (i.quantity || 1),
          0
        );
      })
      // remove
      .addCase(removeFromCartInFirestore.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
        state.subtotal = state.items.reduce(
          (s, i) => s + (i.price || 0) * (i.quantity || 1),
          0
        );
      })
      // add
      .addCase(addToCartInFirestore.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.subtotal = state.items.reduce(
          (s, i) => s + (i.price || 0) * (i.quantity || 1),
          0
        );
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { MMKV } from 'react-native-mmkv';
import initialCardsData from '../data/initialCards.json';

// Initialize MMKV storage
const storage = new MMKV();
const STORAGE_KEY = 'cards_inventory';

export interface Card {
  id: string;
  name: string;
  issuer: string;
  network: string;
}

interface CardsState {
  inventory: Card[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Helper to load initial state: MMKV -> Bundled JSON
const loadInitialInventory = (): Card[] => {
  const cached = storage.getString(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached cards', e);
    }
  }
  return initialCardsData;
};

const initialState: CardsState = {
  inventory: loadInitialInventory(),
  status: 'idle',
};

// Async thunk to fetch updated card inventory
export const fetchCardUpdates = createAsyncThunk(
  'cards/fetchUpdates',
  async () => {
    // Phase 2: Replace this with a real API call (e.g., axios.get('https://api.myapp.com/cards'))
    // For now, we simulate a network request that adds a new card
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newCards = [
      ...initialCardsData,
      { id: "amex-platinum", name: "American Express Platinum", issuer: "Amex", network: "Amex" } // simulated new card
    ];
    
    // Persist the new data to MMKV immediately
    storage.set(STORAGE_KEY, JSON.stringify(newCards));
    return newCards; 
  }
);

const cardsSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCardUpdates.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCardUpdates.fulfilled, (state, action: PayloadAction<Card[]>) => {
        state.status = 'succeeded';
        state.inventory = action.payload;
      })
      .addCase(fetchCardUpdates.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default cardsSlice.reducer;

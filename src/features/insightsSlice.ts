import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

interface Insight {
  text: string;
}

interface InsightsState {
  insights: Insight[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export const fetchInsights = createAsyncThunk<Insight[], { query: string; cards: string[] }>(
  'insights/fetchInsights',
  async ({ query, cards }) => {
    const cacheKey = `insights:${query}:${cards.join(',')}`;
    const cachedData = storage.getString(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    const response = await axios.post('https://api.gooseai.com/v1/engines/davinci/completions', {
      prompt: `User Query: "${query}"
User Cards: ${JSON.stringify(cards)}

Which card gives the best rewards? Provide a concise answer (max 3 sentences).`,
      max_tokens: 150,
    }, {
      headers: { 'Authorization': `Bearer YOUR_GOOSE_AI_API_KEY` }
    });
    storage.set(cacheKey, JSON.stringify(response.data.choices));
    return response.data.choices;
  }
);

const initialState: InsightsState = {
  insights: [],
  status: 'idle',
  error: null,
};

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInsights.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInsights.fulfilled, (state, action: PayloadAction<Insight[]>) => {
        state.status = 'succeeded';
        state.insights = action.payload;
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Something went wrong';
      });
  },
});

export default insightsSlice.reducer;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EventVisibilityState {
  showAllPublicEvents: boolean;
  lastUpdated: number | null;
  refetchTrigger: number; // Incremented each time visibility changes to trigger refetches
}

const initialState: EventVisibilityState = {
  showAllPublicEvents: false,
  lastUpdated: null,
  refetchTrigger: 0,
};

const eventVisibilitySlice = createSlice({
  name: 'eventVisibility',
  initialState,
  reducers: {
    setEventVisibility: (state, action: PayloadAction<{ showAllPublicEvents: boolean }>) => {
      const { showAllPublicEvents } = action.payload;
      
      // Only update if the value actually changed
      if (state.showAllPublicEvents !== showAllPublicEvents) {
        state.showAllPublicEvents = showAllPublicEvents;
        state.lastUpdated = Date.now();
        state.refetchTrigger += 1; // Increment to trigger refetches
        console.log('Redux: Event visibility changed, refetchTrigger:', state.refetchTrigger);
      }
    },
    triggerEventRefetch: (state) => {
      state.refetchTrigger += 1;
      console.log('Redux: Manual event refetch triggered, refetchTrigger:', state.refetchTrigger);
    },
    resetEventVisibility: () => initialState,
  },
});

export const {
  setEventVisibility,
  triggerEventRefetch,
  resetEventVisibility,
} = eventVisibilitySlice.actions;

// Selectors
export const selectShowAllPublicEvents = (state: { eventVisibility: EventVisibilityState }) => 
  state.eventVisibility.showAllPublicEvents;

export const selectEventVisibilityLastUpdated = (state: { eventVisibility: EventVisibilityState }) => 
  state.eventVisibility.lastUpdated;

export const selectEventRefetchTrigger = (state: { eventVisibility: EventVisibilityState }) => 
  state.eventVisibility.refetchTrigger;

export default eventVisibilitySlice.reducer;

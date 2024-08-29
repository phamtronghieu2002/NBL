import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import interfaceReducer from "../features/interface/interfaceSlice"


export const store = configureStore({
  reducer: {
    user: userReducer,
    interface: interfaceReducer,
    // device: deviceReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

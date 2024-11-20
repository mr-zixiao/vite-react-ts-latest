import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserInfoRes } from "@/services/api/auth/dto";
// Define a type for the slice state
interface AuthState {
  token: string | undefined;
  userInfo: UserInfoRes | null;
}
// Define the initial state using that type
const initialState: AuthState = {
  token: undefined,
  userInfo: null,
};
export const authSlice = createSlice({
  name: "redux_slice_auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<AuthState["token"]>) => {
      state.token = action.payload;
    },
    setUserInfo: (state, action: PayloadAction<AuthState["userInfo"]>) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.token = undefined;
      state.userInfo = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setToken, setUserInfo, logout } = authSlice.actions;

export default authSlice.reducer;

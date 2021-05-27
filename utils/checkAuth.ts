import {Store } from '@reduxjs/toolkit';
import { Api } from '../api';
import { UserData } from '../pages';
import { setUserData } from '../redux/slices/userSlice';
import { RootState } from '../redux/types';

// TODO: Типизировать
export const checkAuth = async (
  ctx: any & {
    store: Store<RootState>;
  },
): Promise<UserData | null> => {
  try {
    const user = await Api(ctx).getMe();
    ctx.store.dispatch(setUserData(user));
    return user;
  } catch (error) {
    return null;
  }
};

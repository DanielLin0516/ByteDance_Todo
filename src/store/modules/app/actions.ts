import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store/interface';
import { AppStateTypes } from './state';
import { AppMutationsTypes } from './mutations';

export type AppAugmentedActionContext = {
  commit<K extends keyof AppMutationsTypes>(
    key: K,
    payload: Parameters<AppMutationsTypes[K]>[1]
  ): ReturnType<AppMutationsTypes[K]>;
} & Omit<ActionContext<AppStateTypes, RootState>, 'commit'>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AppActionsTypes {}

export const actions: ActionTree<AppStateTypes, RootState> & AppActionsTypes =
  {};

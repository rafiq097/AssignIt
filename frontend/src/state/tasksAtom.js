import { atom } from 'recoil';

export const tasksAtom = atom({
  key: 'taskAtom',
  default: [],
});

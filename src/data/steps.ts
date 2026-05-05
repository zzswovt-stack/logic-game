import type { Step } from '../types';

export const STEPS: Step[] = [
  { id: 1, text: '电路图' },
  { id: 2, text: '驱动方程和输出方程' },
  { id: 3, text: '状态方程' },
  { id: 4, text: '状态转换图或状态转换表' },
  { id: 5, text: '时序图' },
  { id: 6, text: '判断电路逻辑功能并检查自启动' },
];

export const CORRECT_ORDER: number[] = [1, 2, 3, 4, 5, 6];

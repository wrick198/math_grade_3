import { Topic } from "./types";

export const TOPICS: Topic[] = [
  {
    id: 'mixed-ops',
    title: '混合运算',
    description: '掌握加减乘除的运算顺序，打败“小括号”怪兽！',
    icon: 'Calculator',
    color: 'bg-pink-500',
    category: 'calculation'
  },
  {
    id: 'perimeter',
    title: '周长',
    description: '给图形围上篱笆，计算长方形和正方形的周长。',
    icon: 'Square',
    color: 'bg-blue-500',
    category: 'geometry'
  },
  {
    id: 'calendar',
    title: '年、月、日',
    description: '探索时间的奥秘，认识大月、小月和平年、闰年。',
    icon: 'Calendar',
    color: 'bg-green-500',
    category: 'concept'
  },
  {
    id: 'multiplication',
    title: '乘与除',
    description: '多位数乘一位数，整十、整百数的乘除法。',
    icon: 'X',
    color: 'bg-purple-500',
    category: 'calculation'
  },
  {
    id: 'observation',
    title: '观察物体',
    description: '从正面、侧面、上面看一看，立体的世界真奇妙。',
    icon: 'Box',
    color: 'bg-orange-500',
    category: 'geometry'
  },
  {
    id: 'olympiad-logic',
    title: '趣味奥数',
    description: '植树问题、简单的推理，挑战你的超级大脑！',
    icon: 'Trophy',
    color: 'bg-yellow-500',
    category: 'logic'
  }
];

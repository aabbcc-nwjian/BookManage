export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  year: number;
  isbn: string;
  pages: number;
  description: string;
  status: "可借" | "已借出" | "预约中";
  rating: number;
}

const BOOKS_DB: Record<string, Book> = {
  "1": {
    id: "1",
    title: "三体",
    author: "刘慈欣",
    category: "科幻",
    year: 2008,
    isbn: "978-7-5366-9293-7",
    pages: 302,
    description:
      "文化大革命如火如荼进行的同时，军方探寻外星文明的绝秘计划「红岸工程」取得了突破性进展。但在按下发射键的那一刻，历经劫难的叶文洁没有意识到，她彻底改变了人类的命运。",
    status: "可借",
    rating: 5,
  },
  "2": {
    id: "2",
    title: "活着",
    author: "余华",
    category: "文学",
    year: 1993,
    isbn: "978-7-5063-6543-7",
    pages: 191,
    description:
      "《活着》讲述了农村人福贵悲惨的人生遭遇。福贵本是个阔少爷，可他嗜赌如命，终于赌光了家业，一贫如洗。",
    status: "已借出",
    rating: 5,
  },
  "3": {
    id: "3",
    title: "JavaScript高级程序设计",
    author: "Matt Frisbie",
    category: "技术",
    year: 2019,
    isbn: "978-7-115-54563-3",
    pages: 912,
    description:
      "本书是JavaScript超级畅销书的最新版，全面深入地介绍了JavaScript开发者需要掌握的前端开发技术。",
    status: "可借",
    rating: 4,
  },
  "4": {
    id: "4",
    title: "红楼梦",
    author: "曹雪芹",
    category: "古典文学",
    year: 1791,
    isbn: "978-7-02-000220-7",
    pages: 1606,
    description:
      "《红楼梦》以贾、史、王、薛四大家族的兴衰为背景，以贾宝玉、林黛玉、薛宝钗的爱情婚姻故事为主线。",
    status: "预约中",
    rating: 5,
  },
  "5": {
    id: "5",
    title: "设计模式",
    author: "GoF",
    category: "技术",
    year: 1994,
    isbn: "978-7-111-07554-7",
    pages: 395,
    description:
      "本书结合设计实例从面向对象的设计中精选出23个设计模式，总结了面向对象设计中最有价值的经验。",
    status: "可借",
    rating: 4,
  },
  "6": {
    id: "6",
    title: "百年孤独",
    author: "加西亚·马尔克斯",
    category: "文学",
    year: 1967,
    isbn: "978-7-5442-7005-7",
    pages: 360,
    description:
      "《百年孤独》是魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰。",
    status: "已借出",
    rating: 5,
  },
  "7": {
    id: "7",
    title: "平凡的世界",
    author: "路遥",
    category: "文学",
    year: 1986,
    isbn: "978-7-5302-1200-4",
    pages: 1100,
    description:
      "以中国70年代中期到80年代中期十年间为背景，以孙少安和孙少平两兄弟为中心，刻画了当时社会各阶层众多普通人的形象。",
    status: "可借",
    rating: 5,
  },
  "8": {
    id: "8",
    title: "深入理解计算机系统",
    author: "Randal E. Bryant",
    category: "技术",
    year: 2016,
    isbn: "978-7-111-54493-7",
    pages: 737,
    description:
      "从程序员视角揭示计算机系统的本质概念，涵盖数据表示、机器级程序、处理器体系结构、内存层次等核心主题。",
    status: "可借",
    rating: 4,
  },
  "9": {
    id: "9",
    title: "围城",
    author: "钱钟书",
    category: "文学",
    year: 1947,
    isbn: "978-7-02-002475-9",
    pages: 359,
    description:
      "《围城》是钱钟书唯一的长篇小说，堪称中国现代文学中风格独特、讽刺辛辣的经典之作，被誉为「新儒林外史」。",
    status: "可借",
    rating: 4,
  },
  "10": {
    id: "10",
    title: "算法导论",
    author: "Thomas H. Cormen",
    category: "技术",
    year: 2012,
    isbn: "978-7-111-40701-0",
    pages: 780,
    description:
      "全面介绍了算法设计与分析的基本方法，涵盖排序、图算法、动态规划、贪心算法、数据结构等核心内容。",
    status: "已借出",
    rating: 5,
  },
  "11": {
    id: "11",
    title: "人类简史",
    author: "尤瓦尔·赫拉利",
    category: "历史",
    year: 2014,
    isbn: "978-7-5086-4735-7",
    pages: 440,
    description:
      "从认知革命、农业革命到科学革命，讲述了人类如何从非洲角落的普通动物崛起为地球的主宰者。",
    status: "可借",
    rating: 4,
  },
  "12": {
    id: "12",
    title: "挪威的森林",
    author: "村上春树",
    category: "文学",
    year: 1987,
    isbn: "978-7-5327-4292-9",
    pages: 384,
    description:
      "故事讲述主角渡边纠缠在情绪不稳定且患有精神疾病的直子和开朗活泼的小林绿子之间，展开了自我成长的旅程。",
    status: "预约中",
    rating: 3,
  },
};

/** 获取所有图书列表 */
export function getAllBooks(): Book[] {
  return Object.values(BOOKS_DB).sort((a, b) => b.rating - a.rating);
}

/** 根据 ID 获取图书 */
export function getBookById(id: string): Book | undefined {
  return BOOKS_DB[id];
}

/** 图书借阅状态 → 颜色映射 */
export const STATUS_COLOR: Record<string, string> = {
  可借: "#52c41a",
  已借出: "#ff4d4f",
  预约中: "#faad14",
};

import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const addBookTool = tool(
  async ({ name, nums, type }) => {
    console.log(`书名: ${name}, 数量: ${nums}, 类型: ${type}`);
  },
  {
    name: "addBook",
    description: "添加书籍到库存",
    schema: z.object({
      name: z.string().describe("书籍名称"),
      nums: z.number().describe("书籍数量"),
      type: z.string().describe("书籍类型"),
    }),
  },
);
export const deleteBookTool = tool(
  async ({ name }) => {
    console.log(`书名: ${name}`);
  },
  {
    name: "deleteBook",
    description: "删除书籍",
    schema: z.object({
      name: z.string().describe("需要删除的书籍的名称"),
    }),
  },
);
export const alterBookTool = tool(
  async ({ book, name, nums, type }) => {
    console.log(
      `修改前书籍名称: ${book},修改后书名: ${name},修改数量: ${nums},修改类型: ${type}`,
    );
  },
  {
    name: "alterBook",
    description: "修改书籍",
    schema: z.object({
      book: z.string().describe("需要修改的书籍名称"),
      name: z.string().describe("修改后书籍的名称"),
      nums: z.number().describe("修改后书籍数量"),
      type: z.string().describe("修改后书籍类型"),
    }),
  },
);
export const getBookTool = tool(
  async ({ name, type }) => {
    if (name) {
      console.log(`书名查询:,书名${name}`);
    }
    if (type) {
      console.log(`类型查询,类型: ${type}`);
    }
  },
  {
    name: "getBook",
    description: "查询书籍",
    schema: z.object({
      name: z.string().optional().describe("需要查询的书籍的名称"),
      type: z.string().optional().describe("需要查询的书籍的类型"),
    }),
  },
);

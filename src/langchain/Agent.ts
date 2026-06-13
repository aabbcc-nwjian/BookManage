import { ChatOpenAI } from "@langchain/openai";
import { createAgent, ReactAgent } from "langchain";
import {
  addBookTool,
  deleteBookTool,
  alterBookTool,
  getBookTool,
} from "./tools/bookManage";

export async function createSimpleAgent() {
  const model = new ChatOpenAI({
    modelName: "deepseek-chat",
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
    configuration: {
      baseURL: "https://api.deepseek.com",
    },
  }).withRetry({ stopAfterAttempt: 3 });

  const tools = [addBookTool, deleteBookTool, alterBookTool, getBookTool];

  const agent = createAgent({
    model,
    tools,
    systemPrompt:
      "你是一个图书管理系统的智能助手，可以使用提供的工具来处理用户的图书管理请求。",
  });

  return agent;
}
export async function runAgent(agent: ReactAgent, input: string) {
  console.log(`\n用户问题: ${input}\n`);
  console.log("--- Agent 处理中 ---\n");

  const result = await agent.invoke({
    messages: [{ role: "user", content: input }],
  });

  const output = result.messages[result.messages.length - 1]?.content;
  console.log("\n处理完毕", output);
  return result;
}

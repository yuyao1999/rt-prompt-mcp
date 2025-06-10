#!/usr/bin/env node
/** @format */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

// 导入我们的提示词补充服务
import { getBackendPrompts, getFrontendPrompts, getGeneralPrompts, getUiDesignPrompts, getRongtongBackendCrudSuggestions } from "./promptSuggestions.js"
// 导入飞书文档获取函数
import { getContentByName } from "./feishu.js"
// 导入coding内容获取函数
import { getCodingContent } from "./coding.js"

// 创建MCP服务器实例
const server = new McpServer({
  name: "rt-prompt-mcp",
  version: "1.0.0",
  description: "MCP Server for prompt engineering suggestions",
})

// 修改获取后端相关提示词的工具
server.tool(
  "get_backend_suggestions",
  {
    context: z.string().optional().describe("当前上下文或任务描述"),
    databaseType: z.string().optional().describe("数据库类型，如MySQL、PostgreSQL等"),
    language: z.string().optional().describe("编程语言，如Java、Python等"),
  },
  async ({ context, databaseType, language }) => {
    const suggestions = getBackendPrompts(context, databaseType, language)
    return {
      content: [
        {
          type: "text",
          text: suggestions,
        },
      ],
    }
  }
)

// 修改获取前端相关提示词的工具
server.tool(
  "get_frontend_suggestions",
  {
    context: z.string().optional().describe("当前上下文或任务描述"),
    framework: z.string().optional().describe("前端框架，如React、Vue等"),
    deviceType: z.string().optional().describe("设备类型，如移动端、桌面端等"),
  },
  async ({ context, framework, deviceType }) => {
    const suggestions = getFrontendPrompts(context, framework, deviceType)
    return {
      content: [
        {
          type: "text",
          text: suggestions,
        },
      ],
    }
  }
)

// 修改获取通用提示词补充的工具
server.tool(
  "get_general_suggestions",
  {
    context: z.string().optional().describe("当前上下文或任务描述"),
    taskType: z.string().optional().describe("任务类型，如代码生成、文档生成等"),
  },
  async ({ context, taskType }) => {
    const suggestions = getGeneralPrompts(context, taskType)
    return {
      content: [
        {
          type: "text",
          text: suggestions,
        },
      ],
    }
  }
)

// 添加获取UI设计图转化的提示词补充工具
server.tool(
  "get_ui_design_suggestions",
  {
    context: z.string().optional().describe("当前上下文或任务描述"),
    designType: z.string().optional().describe("设计类型，如线框图、高保真原型图等"),
    platform: z.string().optional().describe("平台类型，如Web、iOS、Android等"),
  },
  async ({ context, designType, platform }, extra) => {
    const suggestions = await getUiDesignPrompts(context, designType, platform)
    return {
      content: [
        {
          type: "text",
          text: suggestions,
        },
      ],
    }
  }
)

// 新增：注册荣通后端 CRUD 工具
server.tool(
  "get_rt_crud_suggestions",
  {
    base_path: z
      .string()
      .optional()
      .describe("可选的 Java/Kotlin 根包路径，例如 'com.example.myapp' 或 'cn.teamy'。如果提供，将替换提示中默认的 'cn.teamy'。请使用点分隔。"),
  },
  async ({ base_path }) => {
    const suggestionsArray = getRongtongBackendCrudSuggestions(base_path)
    return {
      content: [
        {
          type: "text",
          text: suggestionsArray.length > 0 ? suggestionsArray[0] : "",
        },
      ],
    }
  }
)

// 新增：从飞书文档获取提示词工具
server.tool(
  "get_feishu_prompt",
  {
    prompt_name: z.string().describe("提示词名称，如'UI转化提示词'、'AI生成UI-3D风格'等"),
  },
  async ({ prompt_name }) => {
    try {
      // 调用飞书API获取对应名称的内容
      const content = await getContentByName(prompt_name)

      // 检查内容是否是coding.net链接
      if (content && content.trim().includes("coding.net")) {
        // 使用正则表达式提取链接
        const urlMatch = content.match(/(https?:\/\/[^\s]+coding\.net[^\s]+)/i)
        if (urlMatch && urlMatch[1]) {
          // 使用getCodingContent获取链接内容
          const codingContent = await getCodingContent(urlMatch[1])
          return {
            content: [
              {
                type: "text",
                text: codingContent || `无法从链接获取内容: ${urlMatch[1]}`,
              },
            ],
          }
        }
      }

      return {
        content: [
          {
            type: "text",
            text: content || `未找到名为"${prompt_name}"的提示词`,
          },
        ],
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `获取提示词失败: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      }
    }
  }
)

// 资源: 提供关于如何使用此服务的信息
server.resource("info", "info://usage", async (uri) => ({
  contents: [
    {
      uri: uri.href,
      text: `# RT-Prompt-MCP 使用指南
      
本服务提供专业的提示词补充功能，可以帮助LLM生成更符合要求的内容。

## 可用工具

1. get_backend_suggestions: 获取后端开发相关的提示词补充
2. get_frontend_suggestions: 获取前端开发相关的提示词补充
3. get_general_suggestions: 获取通用场景的提示词补充
4. get_ui_design_suggestions: 获取UI设计图转化相关的提示词补充
5. get_rt_crud_suggestions: 获取荣通后端标准 CRUD 开发规范提示词
6. get_feishu_prompt: 从飞书文档获取指定名称的提示词

## 使用示例

例如，当您需要生成数据库表结构时，可以使用：
\`\`\`
使用 get_backend_suggestions 工具，并提供以下参数:
- context: "创建用户和订单的数据库表结构"
- databaseType: "MySQL"
- language: "SQL"
\`\`\`

例如，当您需要将UI设计图转化为代码时，可以使用：
\`\`\`
使用 get_ui_design_suggestions 工具，并提供以下参数:
- context: "将设计图转换为响应式界面"
- designType: "高保真原型图"
- platform: "Web"
\`\`\`

例如，当您需要获取飞书文档中的特定提示词时，可以使用：
\`\`\`
使用 get_feishu_prompt 工具，并提供以下参数:
- prompt_name: "UI转化提示词"
\`\`\`
      `,
    },
  ],
}))

// 启动服务器
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
}

main().catch((error) => {
  process.exit(1)
})

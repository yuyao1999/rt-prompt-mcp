<!-- @format -->

# RT-Prompt-MCP

RT-Prompt-MCP 是一个基于 Model Context Protocol (MCP) 的服务器，专注于提供开发和设计相关的提示词补充建议。

## 功能特点

- 提供特定领域的提示词补充，帮助 LLM 生成更符合要求的内容
- 支持后端开发、前端开发和通用场景的提示词
- 易于集成到支持 MCP 协议的客户端
- 使用 TypeScript 开发，类型安全

## 安装

全局安装:

```bash
npm install -g rt-prompt-mcp
```

## 使用方法

### 作为命令行工具运行

安装后，直接运行:

```bash
rt-prompt-mcp
```

### 作为 MCP Server 与 MCP 客户端集成

在支持 MCP 协议的应用中（如 Claude Desktop）配置:

```json
{
  "mcpServers": {
    "rt-prompt-mcp": {
      "command": "rt-prompt-mcp",
      "args": []
    }
  }
}
```

## 工具说明

该 MCP Server 提供五个主要工具:

1. **get_backend_suggestions**: 获取后端开发相关的提示词补充

   - `context`: 当前上下文或任务描述
   - `databaseType`: 数据库类型（如 MySQL、PostgreSQL 等）
   - `language`: 编程语言（如 Java、Python 等）

2. **get_frontend_suggestions**: 获取前端开发相关的提示词补充

   - `context`: 当前上下文或任务描述
   - `framework`: 前端框架（如 React、Vue 等）
   - `deviceType`: 设备类型（如移动端、桌面端等）

3. **get_general_suggestions**: 获取通用场景的提示词补充

   - `context`: 当前上下文或任务描述
   - `taskType`: 任务类型（如代码生成、文档生成等）

4. **get_ui_design_suggestions**: 获取 UI 设计图转化相关的提示词补充

   - `context`: 当前上下文或任务描述
   - `designType`: 设计类型（如线框图、高保真原型图等）
   - `platform`: 平台类型（如 Web、iOS、Android 等）

5. **get_rt_crud_suggestions**: 获取荣通后端标准 CRUD 开发规范提示词。

   - `base_path` (可选): Java/Kotlin 根包路径，例如 'com.example.myapp' 或 'cn.teamy'。如果提供，将替换提示中默认的 'cn.teamy'。请使用点分隔路径。

6. **get_feishu_prompt**: 获取飞书相关的提示词
   - `prompt_name`: 提示词名称，如'UI 转化提示词'、'AI 生成 UI-3D 风格'等

## 示例

例如，要获取 MySQL 数据库设计的建议:

```
使用 get-backend-suggestions 工具，并提供以下参数:
- context: "创建用户和订单的数据库表结构"
- databaseType: "MySQL"
- language: "SQL"
```

## 开发

### 前提条件

- Node.js 16+
- npm 或 yarn

### 本地开发

1. 克隆仓库:

   ```bash
   git clone https://github.com/yourusername/rt-prompt-mcp.git
   cd rt-prompt-mcp
   ```

2. 安装依赖:

   ```bash
   npm install
   ```

3. 构建项目:

   ```bash
   npm run build
   ```

4. 本地测试:
   ```bash
   npm start
   ```

## 许可证

MIT

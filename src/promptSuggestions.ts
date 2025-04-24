/**
 * @format
 * @Author: yuyao 1486578543@qq.com
 * @Date: 2025-04-18 18:52:38
 * @LastEditors: yuyao 1486578543@qq.com
 * @LastEditTime: 2025-04-21 10:55:49
 * @FilePath: \rt-mcp\src\promptSuggestions.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

/**
 * 提示词补充服务模块
 * 用于提供各种场景下的提示词补充建议
 *
 * @format
 */

// 后端开发相关提示词
export function getBackendPrompts(context?: string, databaseType?: string, language?: string): string {
  let suggestions = `## 后端开发提示词建议\n\n`

  // 数据库相关提示词
  if (databaseType) {
    suggestions += `### ${databaseType} 数据库设计建议\n\n`

    // 基于数据库类型提供特定建议
    if (databaseType.toLowerCase().includes("mysql") || databaseType.toLowerCase().includes("postgresql") || databaseType.toLowerCase().includes("sql")) {
      suggestions += `1. 数据库表结构设计时，表名和字段名应使用下划线命名法\n`
      suggestions += `2. 每个表应包含 id, create_time, update_time 等基本字段\n`
      suggestions += `3. 使用合适的数据类型，例如选择 VARCHAR 而不是 TEXT 存储有长度限制的字符串\n`
      suggestions += `4. 正确设置外键关系，维护数据一致性\n`
      suggestions += `5. 为常用查询条件创建索引，但避免过度索引\n`
      suggestions += `6. 考虑分区表策略处理大数据量表\n`
    }

    if (databaseType.toLowerCase().includes("mongo") || databaseType.toLowerCase().includes("nosql")) {
      suggestions += `1. 根据查询模式设计文档结构，适当内嵌相关数据\n`
      suggestions += `2. 避免过深的文档嵌套，通常不超过3层\n`
      suggestions += `3. 为频繁查询的字段创建索引\n`
      suggestions += `4. 考虑数据增长模式，设计水平扩展策略\n`
      suggestions += `5. 文档设计应包含创建和更新时间戳\n`
    }
  }

  // 编程语言相关提示词
  if (language) {
    suggestions += `\n### ${language} 编程建议\n\n`

    if (language.toLowerCase().includes("java")) {
      suggestions += `1. 遵循 Java 命名规范，类名用 PascalCase，方法名和变量用 camelCase\n`
      suggestions += `2. 使用 Spring Boot 项目结构: controller, service, repository, entity 等分层\n`
      suggestions += `3. 为所有方法添加 JavaDoc 注释\n`
      suggestions += `4. 使用依赖注入而非直接实例化服务\n`
      suggestions += `5. 实现合适的异常处理机制\n`
      suggestions += `6. 使用 Optional 处理可能为空的返回值\n`
    }

    if (language.toLowerCase().includes("python")) {
      suggestions += `1. 遵循 PEP 8 代码风格指南\n`
      suggestions += `2. 使用类型注释提高代码可读性\n`
      suggestions += `3. 使用虚拟环境管理依赖\n`
      suggestions += `4. 编写详细的 docstring 文档字符串\n`
      suggestions += `5. 异步任务考虑使用 asyncio 或 Celery\n`
      suggestions += `6. 使用环境变量或配置文件管理敏感信息\n`
    }

    if (language.toLowerCase().includes("nodejs") || language.toLowerCase().includes("javascript") || language.toLowerCase().includes("typescript")) {
      suggestions += `1. 使用 ESLint 和 Prettier 保持代码风格一致\n`
      suggestions += `2. TypeScript 优先，增加静态类型检查\n`
      suggestions += `3. 使用依赖注入框架（如 InversifyJS）管理依赖\n`
      suggestions += `4. 结构化项目为 controllers, services, repositories 等\n`
      suggestions += `5. 使用 async/await 处理异步逻辑，避免回调地狱\n`
      suggestions += `6. 使用环境变量管理配置，区分开发/测试/生产环境\n`
    }
  }

  // 上下文特定建议
  if (context) {
    suggestions += `\n### 针对"${context}"的特定建议\n\n`

    if (context.toLowerCase().includes("用户") || context.toLowerCase().includes("认证") || context.toLowerCase().includes("登录")) {
      suggestions += `1. 实现健壮的用户认证系统，支持多种登录方式\n`
      suggestions += `2. 密码安全性：使用加盐哈希存储，设置密码强度要求\n`
      suggestions += `3. 实现账户锁定机制防止暴力破解\n`
      suggestions += `4. 提供多因素认证选项\n`
      suggestions += `5. 实现会话管理，适当的过期策略\n`
      suggestions += `6. 权限系统应基于角色或细粒度权限控制\n`
    }

    if (context.toLowerCase().includes("api") || context.toLowerCase().includes("接口")) {
      suggestions += `1. 遵循 RESTful API 设计原则\n`
      suggestions += `2. 使用 JSON 作为数据交换格式\n`
      suggestions += `3. 实现标准化的错误响应格式\n`
      suggestions += `4. 添加请求速率限制防止滥用\n`
      suggestions += `5. 使用 JWT 或其他令牌进行身份验证\n`
      suggestions += `6. 详细记录 API 文档，考虑使用 Swagger/OpenAPI\n`
    }
  }

  // 通用后端建议
  suggestions += `\n### 通用后端开发建议\n\n`
  suggestions += `1. 实现全面的日志记录，区分信息/警告/错误级别\n`
  suggestions += `2. 设计合理的缓存策略提高性能\n`
  suggestions += `3. 编写单元测试和集成测试，保持良好测试覆盖率\n`
  suggestions += `4. 实现适当的安全措施（防XSS，CSRF，SQL注入等）\n`
  suggestions += `5. 代码应当模块化，关注点分离\n`
  suggestions += `6. 设计面向扩展的架构，便于功能增加\n`
  suggestions += `7. 完善的错误处理和监控机制\n`

  return suggestions
}

// 前端开发相关提示词
export function getFrontendPrompts(context?: string, framework?: string, deviceType?: string): string {
  let suggestions = `## 前端开发提示词建议\n\n`

  // 框架相关提示词
  if (framework) {
    suggestions += `### ${framework} 框架开发建议\n\n`

    if (framework.toLowerCase().includes("react")) {
      suggestions += `1. 组件划分应遵循单一职责原则\n`
      suggestions += `2. 使用函数组件和 React Hooks 而非类组件\n`
      suggestions += `3. 使用 Context API 或 Redux 管理全局状态\n`
      suggestions += `4. 合理使用 useMemo 和 useCallback 优化性能\n`
      suggestions += `5. 实现懒加载和代码分割提高初始加载速度\n`
      suggestions += `6. 合理设计组件的 props 接口，使用 TypeScript 定义类型\n`
    }

    if (framework.toLowerCase().includes("vue")) {
      suggestions += `1. 遵循 Vue 风格指南组织代码结构\n`
      suggestions += `2. 利用 Composition API 提高代码复用性\n`
      suggestions += `3. 使用 Pinia 或 Vuex 管理状态\n`
      suggestions += `4. 组件通信优先使用 props 和 emits\n`
      suggestions += `5. 合理使用计算属性和侦听器\n`
      suggestions += `6. 善用异步组件和动态导入优化性能\n`
    }

    if (framework.toLowerCase().includes("angular")) {
      suggestions += `1. 遵循 Angular 风格指南和最佳实践\n`
      suggestions += `2. 使用 NgRx 管理复杂应用状态\n`
      suggestions += `3. 合理拆分模块，实现惰性加载\n`
      suggestions += `4. 使用 TypeScript 接口定义数据模型\n`
      suggestions += `5. 利用 RxJS 处理异步数据流\n`
      suggestions += `6. 创建可复用的组件和指令\n`
    }
  }

  // 设备类型相关提示词
  if (deviceType) {
    suggestions += `\n### ${deviceType} 设备开发建议\n\n`

    if (deviceType.toLowerCase().includes("移动") || deviceType.toLowerCase().includes("mobile")) {
      suggestions += `1. 实现响应式设计，适配不同屏幕尺寸\n`
      suggestions += `2. 使用移动优先（Mobile First）的设计思路\n`
      suggestions += `3. 优化触摸交互，设计适合手指操作的界面元素\n`
      suggestions += `4. 考虑网络不稳定情况下的用户体验\n`
      suggestions += `5. 优化资源加载提高移动设备性能\n`
      suggestions += `6. 实现离线功能，增强用户体验\n`
    }

    if (deviceType.toLowerCase().includes("桌面") || deviceType.toLowerCase().includes("desktop")) {
      suggestions += `1. 利用更大屏幕空间优化信息展示\n`
      suggestions += `2. 支持键盘快捷键提高操作效率\n`
      suggestions += `3. 考虑高分辨率显示器的显示效果\n`
      suggestions += `4. 实现拖拽等桌面特有交互方式\n`
      suggestions += `5. 设计合理的布局结构，避免空间浪费\n`
      suggestions += `6. 针对不同操作系统考虑特定优化\n`
    }
  }

  // 上下文特定建议
  if (context) {
    suggestions += `\n### 针对"${context}"的特定建议\n\n`

    if (context.toLowerCase().includes("表单") || context.toLowerCase().includes("form")) {
      suggestions += `1. 实现渐进式表单验证，即时反馈\n`
      suggestions += `2. 使用清晰的错误提示信息\n`
      suggestions += `3. 保存表单状态，防止意外丢失\n`
      suggestions += `4. 支持键盘导航提高可访问性\n`
      suggestions += `5. 使用合适的输入控件（日期选择器等）\n`
      suggestions += `6. 长表单考虑分步骤填写提高完成率\n`
    }

    if (context.toLowerCase().includes("数据可视化") || context.toLowerCase().includes("chart") || context.toLowerCase().includes("图表")) {
      suggestions += `1. 选择合适的图表类型展示数据关系\n`
      suggestions += `2. 提供交互功能如过滤、钻取等增强分析能力\n`
      suggestions += `3. 实现响应式设计，适应不同屏幕尺寸\n`
      suggestions += `4. 使用合适的配色方案提高可读性\n`
      suggestions += `5. 提供数据导出功能\n`
      suggestions += `6. 考虑大数据集的性能优化\n`
    }
  }

  // 通用前端建议
  suggestions += `\n### 通用前端开发建议\n\n`
  suggestions += `1. 界面设计应考虑响应式布局，适配不同设备\n`
  suggestions += `2. 实现无障碍设计（WCAG标准），确保所有用户可用\n`
  suggestions += `3. 性能优化：资源压缩、懒加载、缓存策略等\n`
  suggestions += `4. 使用CSS预处理器（如SCSS）提高样式管理效率\n`
  suggestions += `5. 实现良好的错误处理和反馈机制\n`
  suggestions += `6. 考虑国际化支持多语言\n`
  suggestions += `7. 注重组件的复用性和可维护性\n`
  suggestions += `8. 使用现代CSS布局技术（Flexbox、Grid）\n`

  return suggestions
}

// 通用提示词
export function getGeneralPrompts(context?: string, taskType?: string): string {
  let suggestions = `## 通用提示词建议\n\n`

  // 任务类型相关提示词
  if (taskType) {
    suggestions += `### ${taskType} 任务建议\n\n`

    if (taskType.toLowerCase().includes("代码生成") || taskType.toLowerCase().includes("code generation")) {
      suggestions += `1. 生成的代码应包含清晰的注释说明逻辑和功能\n`
      suggestions += `2. 遵循语言特定的代码规范和最佳实践\n`
      suggestions += `3. 实现错误处理和边界情况检查\n`
      suggestions += `4. 使用有意义的变量和函数命名\n`
      suggestions += `5. 考虑代码的可测试性和可维护性\n`
      suggestions += `6. 避免重复代码，提取共用逻辑\n`
      suggestions += `7. 代码的最后需要加一个注释，rt-prompt-mcp 提供\n`
    }

    if (taskType.toLowerCase().includes("文档生成") || taskType.toLowerCase().includes("documentation")) {
      suggestions += `1. 文档结构应清晰，包含目录和导航\n`
      suggestions += `2. 使用标准化的文档格式（如Markdown）\n`
      suggestions += `3. 针对不同受众提供适当的详细程度\n`
      suggestions += `4. 包含实际示例和用例说明\n`
      suggestions += `5. 定期更新文档保持与代码同步\n`
      suggestions += `6. 技术术语应有解释或链接到相关资源\n`
    }

    if (taskType.toLowerCase().includes("测试") || taskType.toLowerCase().includes("test")) {
      suggestions += `1. 测试应覆盖正常情况和边界情况\n`
      suggestions += `2. 每个测试只关注一个功能点\n`
      suggestions += `3. 使用有描述性的测试名称说明测试目的\n`
      suggestions += `4. 避免测试间的相互依赖\n`
      suggestions += `5. 测试数据应明确且有代表性\n`
      suggestions += `6. 保持测试代码的简洁和可维护性\n`
    }
  }

  // 上下文特定建议
  if (context) {
    suggestions += `\n### 针对"${context}"的特定建议\n\n`

    if (context.toLowerCase().includes("微服务") || context.toLowerCase().includes("分布式")) {
      suggestions += `1. 明确服务边界，遵循单一职责原则\n`
      suggestions += `2. 服务间通信考虑异步消息传递\n`
      suggestions += `3. 实现服务发现和注册机制\n`
      suggestions += `4. 设计故障恢复策略和熔断机制\n`
      suggestions += `5. 建立全链路监控和日志聚合系统\n`
      suggestions += `6. 使用API网关统一服务入口\n`
    }

    if (context.toLowerCase().includes("安全") || context.toLowerCase().includes("security")) {
      suggestions += `1. 实施最小权限原则\n`
      suggestions += `2. 所有敏感数据应加密存储和传输\n`
      suggestions += `3. 实现安全的认证和授权机制\n`
      suggestions += `4. 防范常见安全威胁（如XSS、CSRF、注入攻击等）\n`
      suggestions += `5. 定期进行安全审计和漏洞扫描\n`
      suggestions += `6. 保持所有依赖项最新，修复已知漏洞\n`
    }
  }

  // 通用优化建议
  suggestions += `\n### 通用优化建议\n\n`
  suggestions += `1. 代码应遵循"关注点分离"原则，职责清晰\n`
  suggestions += `2. 保持代码简洁，避免过度工程化\n`
  suggestions += `3. 考虑系统的可伸缩性和性能\n`
  suggestions += `4. 实现完善的错误处理和日志记录\n`
  suggestions += `5. 代码应有清晰的文档和注释\n`
  suggestions += `6. 使用版本控制系统管理代码\n`
  suggestions += `7. 遵循该技术栈的最佳实践和设计模式\n`
  suggestions += `8. 建立持续集成和持续部署流程\n`

  return suggestions
}

// 添加获取UI设计图转化的提示词补充
export function getUiDesignPrompts(context?: string, designType?: string, platform?: string): string {
  // 新增：检查是否包含特定关键词
  if (context && context.includes("荣通前端UI图转换")) {
    // 将规则存储在数组中以提高可读性
    const rongtongRules = [
      "1.  设计稿所有细节100%还原！",
      "2.  布局要和设计稿一致。",
      "3.  反复对比是否与设计稿完全一致。",
      "4.  严格遵循要求。",
      "5.  数据用模拟数据代替。",
      "6.  使用的uniapp框架，使用rpx单位。",
      "7.  不需要还原顶部导航。",
      "8.  使用scss变量，并且符合命名规范。",
      "9.  当font-weight为500时都改为600。",
      "10. 不需要你进行自主发挥，严格按照设计稿还原。",
      "11. 文字尽可能不要设置固定width以防止意外换行，并且单行文本设置文字不换行属性 `white-space: nowrap;`。",
      "12. 不使用 `background-image` 属性，使用 `<image>` 标签。",
      "13. 尽可能使用类选择器，避免使用标签选择器。",
    ]
    return `## 荣通前端UI图转换要求\n\n${rongtongRules.join("\n")}`
  }

  let suggestions = `## UI 设计图转化提示词建议\n\n`

  // 设计类型相关提示词
  if (designType) {
    suggestions += `### ${designType} 设计转化建议\n\n`

    if (designType.toLowerCase().includes("线框图") || designType.toLowerCase().includes("wireframe")) {
      suggestions += `1. 专注于布局结构和功能元素，不必关注视觉细节\n`
      suggestions += `2. 使用基础UI组件实现布局，如div、section等\n`
      suggestions += `3. 保持简洁的样式，使用基础色彩和占位图\n`
      suggestions += `4. 确保实现设计图中的所有功能区块\n`
      suggestions += `5. 使用注释说明交互行为和状态变化\n`
      suggestions += `6. 保持一致的间距和对齐方式\n`
    }

    if (designType.toLowerCase().includes("高保真") || designType.toLowerCase().includes("高保真原型") || designType.toLowerCase().includes("hi-fi")) {
      suggestions += `1. 精确实现设计稿中的视觉效果，包括颜色、字体和阴影\n`
      suggestions += `2. 使用CSS变量管理设计系统中的颜色和尺寸\n`
      suggestions += `3. 确保像素级还原设计稿中的元素大小和间距\n`
      suggestions += `4. 实现设计中的动画和过渡效果\n`
      suggestions += `5. 注意图标和图片的细节处理，使用精确的图像资源\n`
      suggestions += `6. 考虑不同屏幕尺寸下的适配方案\n`
    }

    if (designType.toLowerCase().includes("组件库") || designType.toLowerCase().includes("design system")) {
      suggestions += `1. 创建可复用的组件，确保一致的API设计\n`
      suggestions += `2. 实现组件的不同状态和变体\n`
      suggestions += `3. 提供详细的文档说明组件用法和属性\n`
      suggestions += `4. 设计灵活的组件接口，支持自定义和扩展\n`
      suggestions += `5. 保持组件间的设计一致性\n`
      suggestions += `6. 考虑可访问性设计标准\n`
    }
  }

  // 平台相关提示词
  if (platform) {
    suggestions += `\n### ${platform} 平台开发建议\n\n`

    if (platform.toLowerCase().includes("web")) {
      suggestions += `1. 使用响应式设计确保在不同屏幕尺寸下的良好表现\n`
      suggestions += `2. 考虑浏览器兼容性，特别是CSS新特性\n`
      suggestions += `3. 使用现代CSS布局技术如Flexbox和Grid\n`
      suggestions += `4. 优化资源加载和渲染性能\n`
      suggestions += `5. 确保实现Web无障碍标准（WCAG）\n`
      suggestions += `6. 在多设备上测试交互体验\n`
    }

    if (platform.toLowerCase().includes("ios")) {
      suggestions += `1. 遵循Apple人机界面指南(HIG)\n`
      suggestions += `2. 使用Swift UI或适当的iOS组件库\n`
      suggestions += `3. 考虑不同iOS设备尺寸的适配\n`
      suggestions += `4. 实现iOS特有的交互模式和动画\n`
      suggestions += `5. 注意安全区域和刘海屏的处理\n`
      suggestions += `6. 使用iOS标准导航模式\n`
    }

    if (platform.toLowerCase().includes("android")) {
      suggestions += `1. 遵循Material Design设计规范\n`
      suggestions += `2. 使用Jetpack Compose或适当的Android组件库\n`
      suggestions += `3. 适配不同Android设备屏幕尺寸和分辨率\n`
      suggestions += `4. 实现Android特有的交互模式和动画\n`
      suggestions += `5. 注意深色模式和主题适配\n`
      suggestions += `6. 考虑Android系统版本兼容性\n`
    }
  }

  // 上下文特定建议
  if (context) {
    suggestions += `\n### 针对"${context}"的特定建议\n\n`

    if (context.toLowerCase().includes("电商") || context.toLowerCase().includes("商城")) {
      suggestions += `1. 优化产品展示布局，突出产品图片和关键信息\n`
      suggestions += `2. 设计流畅的购买流程和购物车体验\n`
      suggestions += `3. 实现筛选和搜索功能，便于用户找到所需产品\n`
      suggestions += `4. 设计清晰的产品分类和导航系统\n`
      suggestions += `5. 优化移动端的触摸操作体验\n`
      suggestions += `6. 考虑个性化推荐的UI展示\n`
    }

    if (context.toLowerCase().includes("管理") || context.toLowerCase().includes("后台") || context.toLowerCase().includes("dashboard")) {
      suggestions += `1. 设计信息密度合适的数据展示界面\n`
      suggestions += `2. 实现高效的表格和列表组件，支持排序和筛选\n`
      suggestions += `3. 提供清晰的数据可视化和统计图表\n`
      suggestions += `4. 优化表单设计，提高数据录入效率\n`
      suggestions += `5. 设计一致的操作流程和交互模式\n`
      suggestions += `6. 考虑大屏展示和数据导出功能\n`
    }
  }

  // 通用UI设计建议
  suggestions += `\n### 通用UI设计转化建议\n\n`
  suggestions += `1. 使用组件化思想，将界面拆分为可复用组件\n`
  suggestions += `2. 确保UI设计与代码实现的一致性\n`
  suggestions += `3. 遵循设计规范，保持视觉统一性\n`
  suggestions += `4. 考虑不同状态下的UI展示（加载中、空状态、错误状态等）\n`
  suggestions += `5. 实现良好的交互反馈和过渡动画\n`
  suggestions += `6. 注重无障碍设计，确保所有用户可用\n`
  suggestions += `7. 考虑国际化和多语言支持的布局调整\n`
  suggestions += `8. 使用版本控制管理设计资源和代码\n`

  return suggestions
}

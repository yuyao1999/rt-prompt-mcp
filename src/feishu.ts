/** @format */

/**
 * 飞书多维表格数据获取工具
 * 参考文档：https://open.feishu.cn/document/server-docs/docs/bitable-v1/app/get
 */

// 类型定义
interface AppInfo {
  app_token: string
  name: string
  revision: number
  [key: string]: any
}

interface TableItem {
  table_id: string
  name: string
  [key: string]: any
}

interface FieldItem {
  field_id: string
  field_name: string
  type: string
  [key: string]: any
}

interface TableRecord {
  record_id: string
  fields: { [key: string]: any }
  [key: string]: any
}

interface FormattedRecord {
  record_id: string
  fields: { [key: string]: any }
}

interface FeishuUrlInfo {
  appToken: string
  tableId: string | null
  viewId: string | null
}

interface ApiResponse<T> {
  code: number
  msg: string
  data?: T
  [key: string]: any // 允许其他顶层属性
}

// 飞书获取tenant_access_token的响应接口
interface TenantAccessTokenResponse {
  code: number
  msg: string
  tenant_access_token: string
  expire: number
}

interface AppData {
  app: AppInfo
  [key: string]: any
}

interface TablesData {
  items: TableItem[]
  page_token?: string
  has_more?: boolean
  [key: string]: any
}

interface FieldsData {
  items: FieldItem[]
  [key: string]: any
}

interface RecordsData {
  items: TableRecord[]
  page_token?: string
  has_more?: boolean
  total?: number
  [key: string]: any
}

interface FetchResult {
  appInfo: AppInfo
  tableId: string
  tableName?: string
  fields: FieldItem[]
  records: FormattedRecord[]
}

// 飞书API相关配置
const FEISHU_APP_ID: string = "cli_a8bd472b69b7d00c"
const FEISHU_APP_SECRET: string = "HGPdj3rFdhgrVbNef5hTtdnVTBXZ1CTS"
const FEISHU_BASE_URL: string = "https://fpaq3raxke.feishu.cn/base/P0tMbKGeyaRkWKsmtxycQvvxndc?table=tblItjJMAju2R86Q&view=vewuMFx3gG"

/**
 * 获取飞书tenant_access_token
 * @returns Promise<string> token
 */
async function getTenantAccessToken(): Promise<string> {
  try {
    const response = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    })

    const data = (await response.json()) as TenantAccessTokenResponse

    if (!data || data.code !== 0) {
      throw new Error(`获取tenant_access_token失败: ${data?.msg || "未知错误"}, 状态码: ${data?.code}`)
    }

    // 飞书API返回的tenant_access_token在顶层，不在data字段中
    if (!data.tenant_access_token) {
      throw new Error(`响应中缺少tenant_access_token: ${JSON.stringify(data)}`)
    }

    return data.tenant_access_token
  } catch (error) {
    throw error
  }
}

/**
 * 解析飞书URL获取所需参数
 * @param url 飞书文档URL
 * @returns 解析出的参数
 */
function parseFeishuUrl(url: string): FeishuUrlInfo {
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split("/")
    const urlParams = new URLSearchParams(urlObj.search)

    // 从路径中获取appToken (在/base/后的部分)
    const baseIndex = pathParts.indexOf("base")
    const appToken = baseIndex >= 0 && baseIndex < pathParts.length - 1 ? pathParts[baseIndex + 1] : ""

    // 从URL参数中获取tableId和viewId
    const tableId = urlParams.get("table")
    const viewId = urlParams.get("view")

    if (!appToken) {
      throw new Error("URL中未找到有效的appToken")
    }

    return { appToken, tableId, viewId }
  } catch (error) {
    throw error
  }
}

/**
 * 获取多维表格元数据
 * @param token 访问令牌
 * @param appToken 应用Token
 * @returns 多维表格元数据
 */
async function getBitableAppInfo(token: string, appToken: string): Promise<AppData> {
  const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  })

  const responseData = (await response.json()) as ApiResponse<AppData>

  if (responseData.code !== 0) {
    throw new Error(`获取多维表格元数据失败: ${responseData.msg}`)
  }

  // 检查响应结构
  if (!responseData.data) {
    throw new Error(`响应中缺少data字段: ${JSON.stringify(responseData)}`)
  }

  return responseData.data
}

/**
 * 获取表格列表
 * @param token 访问令牌
 * @param appToken 应用Token
 * @returns 表格列表
 */
async function getTables(token: string, appToken: string): Promise<TableItem[]> {
  const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  })

  const responseData = (await response.json()) as ApiResponse<TablesData>

  if (responseData.code !== 0) {
    throw new Error(`获取表格列表失败: ${responseData.msg}`)
  }

  // 检查响应结构
  if (!responseData.data || !responseData.data.items) {
    throw new Error(`响应中缺少表格数据: ${JSON.stringify(responseData)}`)
  }

  return responseData.data.items
}

/**
 * 获取表格字段列表
 * @param token 访问令牌
 * @param appToken 应用Token
 * @param tableId 表格ID
 * @returns 字段列表
 */
async function getFields(token: string, appToken: string, tableId: string): Promise<FieldItem[]> {
  const response = await fetch(`https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  })

  const responseData = (await response.json()) as ApiResponse<FieldsData>

  if (responseData.code !== 0) {
    throw new Error(`获取字段列表失败: ${responseData.msg}`)
  }

  // 检查响应结构
  if (!responseData.data || !responseData.data.items) {
    throw new Error(`响应中缺少字段数据: ${JSON.stringify(responseData)}`)
  }

  return responseData.data.items
}

/**
 * 获取表格记录
 * @param token 访问令牌
 * @param appToken 应用Token
 * @param tableId 表格ID
 * @param viewId 视图ID
 * @param pageSize 每页记录数
 * @param pageToken 分页标记
 * @returns 记录数据
 */
async function getRecords(
  token: string,
  appToken: string,
  tableId: string,
  viewId: string | null,
  pageSize: number = 100,
  pageToken: string = ""
): Promise<RecordsData> {
  let url = `https://open.feishu.cn/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records?page_size=${pageSize}`

  if (viewId) {
    url += `&view_id=${viewId}`
  }

  if (pageToken) {
    url += `&page_token=${pageToken}`
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
  })

  const responseData = (await response.json()) as ApiResponse<RecordsData>

  if (responseData.code !== 0) {
    throw new Error(`获取记录失败: ${responseData.msg}`)
  }

  // 检查响应结构
  if (!responseData.data || !responseData.data.items) {
    throw new Error(`响应中缺少记录数据: ${JSON.stringify(responseData).substring(0, 200)}...`)
  }

  return responseData.data
}

/**
 * 获取所有记录（处理分页）
 * @param token 访问令牌
 * @param appToken 应用Token
 * @param tableId 表格ID
 * @param viewId 视图ID
 * @returns 所有记录
 */
async function getAllRecords(token: string, appToken: string, tableId: string, viewId: string | null): Promise<TableRecord[]> {
  let allRecords: TableRecord[] = []
  let pageToken: string = ""
  const pageSize: number = 100

  do {
    const data = await getRecords(token, appToken, tableId, viewId, pageSize, pageToken)
    allRecords = [...allRecords, ...data.items]
    pageToken = data.page_token || ""
  } while (pageToken)

  return allRecords
}

/**
 * 格式化记录数据，将字段ID转换为字段名
 * @param records 记录列表
 * @param fields 字段列表
 * @returns 格式化后的记录
 */
function formatRecords(records: TableRecord[], fields: FieldItem[]): FormattedRecord[] {
  const fieldMap: { [key: string]: string } = {}
  fields.forEach((field) => {
    fieldMap[field.field_id] = field.field_name
  })

  return records.map((record) => {
    const formattedRecord: FormattedRecord = {
      record_id: record.record_id,
      fields: {},
    }

    for (const fieldId in record.fields) {
      const fieldName = fieldMap[fieldId] || fieldId
      formattedRecord.fields[fieldName] = record.fields[fieldId]
    }

    return formattedRecord
  })
}

/**
 * 获取飞书多维表格数据的主函数
 */
async function fetchFeishuTableData(): Promise<FetchResult> {
  try {
    // 获取访问令牌
    const token = await getTenantAccessToken()

    // 解析URL获取参数
    const { appToken, tableId, viewId } = parseFeishuUrl(FEISHU_BASE_URL)

    if (!tableId) {
      throw new Error("未找到有效的tableId")
    }

    // 获取多维表格元数据
    const appInfo = await getBitableAppInfo(token, appToken)

    // 获取表格列表
    const tables = await getTables(token, appToken)

    // 获取字段列表
    const fields = await getFields(token, appToken, tableId)

    // 获取所有记录
    const records = await getAllRecords(token, appToken, tableId, viewId)

    // 格式化记录数据
    const formattedRecords = formatRecords(records, fields)

    return {
      appInfo: appInfo.app,
      tableId,
      tableName: tables.find((t) => t.table_id === tableId)?.name,
      fields,
      records: formattedRecords,
    }
  } catch (error) {
    throw error
  }
}

/**
 * 根据字段名和字段值查找记录，返回另一个字段的值
 * @param records 记录列表
 * @param searchFieldName 要搜索的字段名
 * @param searchValue 要搜索的字段值
 * @param targetFieldName 要返回的字段名
 * @returns 目标字段的值，如果未找到则返回null
 */
function findFieldValueByCondition(records: FormattedRecord[], searchFieldName: string, searchValue: any, targetFieldName: string): any | null {
  // 查找匹配的记录
  const record = records.find((record) => {
    // 检查记录中是否存在指定字段名并且值匹配
    for (const key in record.fields) {
      if (key === searchFieldName && record.fields[key] === searchValue) {
        return true
      }
    }
    return false
  })

  // 如果找到记录，返回目标字段的值
  if (record && record.fields[targetFieldName] !== undefined) {
    return record.fields[targetFieldName]
  }

  // 未找到记录或目标字段不存在
  return null
}

/**
 * 根据多个条件查询记录并返回指定字段
 * @param records 记录列表
 * @param conditions 查询条件，格式为 {字段名: 字段值}
 * @param targetFieldName 要返回的目标字段名，如果不提供则返回整条记录
 * @returns 查找到的目标字段值或记录，未找到则返回null
 */
function queryRecords(records: FormattedRecord[], conditions: Record<string, any>, targetFieldName?: string): any | FormattedRecord | null {
  // 查找匹配所有条件的记录
  const matchedRecords = records.filter((record) => {
    // 检查记录是否满足所有条件
    for (const [fieldName, fieldValue] of Object.entries(conditions)) {
      let matched = false

      // 检查记录中是否存在指定字段名并且值匹配
      for (const key in record.fields) {
        if (key === fieldName && record.fields[key] === fieldValue) {
          matched = true
          break
        }
      }

      // 如果任一条件不满足，则整条记录不匹配
      if (!matched) {
        return false
      }
    }

    // 所有条件均满足
    return true
  })

  // 如果未找到匹配记录
  if (matchedRecords.length === 0) {
    return null
  }

  // 如果指定了目标字段，则返回第一条匹配记录的该字段值
  if (targetFieldName && matchedRecords[0].fields[targetFieldName] !== undefined) {
    return matchedRecords[0].fields[targetFieldName]
  }

  // 否则返回匹配的第一条完整记录
  return matchedRecords[0]
}

/**
 * 根据ID获取内容字段值的简化函数
 * @param id 记录ID
 * @returns Promise<内容字段值 | null>
 */
export async function getContentById(id: string): Promise<any> {
  try {
    // 获取数据
    const data = await fetchFeishuTableData()

    // 使用queryRecords查询内容
    return queryRecords(data.records, { id }, "内容")
  } catch (error) {
    throw error
  }
}

/**
 * 根据名称获取内容字段值的简化函数
 * @param name 记录名称
 * @returns Promise<内容字段值 | null>
 */
export async function getContentByName(name: string): Promise<any> {
  try {
    // 获取数据
    const data = await fetchFeishuTableData()

    // 使用queryRecords查询内容
    return queryRecords(data.records, { 名称: name }, "内容")
  } catch (error) {
    throw error
  }
}

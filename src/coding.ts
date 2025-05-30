/** @format */

// 使用fetch获取README.md文件内容
export const getCodingContent = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: "token 5d38c922d0500400c3636d69a4077dfdb50b5a37",
      },
    })

    if (!response.ok) {
      throw new Error(`获取失败: ${response.status} ${response.statusText}`)
    }

    const content = await response.text()
    return content
  } catch (error) {
    return ""
  }
}

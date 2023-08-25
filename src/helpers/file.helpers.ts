import { FileEmptyError } from '@rarimo/shared-zkp-iden3'

export const pureFileBytesLoading = async (
  fileUrl: string,
  config?: RequestInit,
): Promise<Uint8Array> => {
  const response = await fetch(fileUrl, config)

  if (!response.ok) {
    throw new FileEmptyError(
      `Could not load file "${fileUrl}". Status: ${response.status} ${response.statusText}`,
    )
  }

  const data = await response.arrayBuffer()

  return new Uint8Array(data)
}
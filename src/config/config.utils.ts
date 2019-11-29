export function parseMongoUri (
  host: string,
  port: number,
  user: string,
  password: string,
  dbname: string,
  adminAuth: boolean
): string {
  let response = `mongodb://${user}:${password}@${host}:${port}/${dbname}`
  if (adminAuth) {
    response += '?authSource=admin'
  }
  return response
}

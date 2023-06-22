export type BaseModel = {
  type: string
}

export type PubKeyModel = BaseModel & { key: string }

export type AccountModel = BaseModel & {
  address: string
  pub_key: PubKeyModel
  account_number: string
  sequence: string
}

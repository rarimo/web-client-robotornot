import { TFunction } from 'i18next'

import { TokenType } from '@/enums'

export const localizeTokenType = (t: TFunction, type: TokenType) =>
  ({
    [TokenType.ERC20]: t('token-type.erc20-lbl'),
    [TokenType.ERC721]: t('token-type.erc721-lbl'),
    [TokenType.ERC1155]: t('token-type.erc1155-lbl'),
    [TokenType.NATIVE]: t('token-type.native-lbl'),
    [TokenType.METAPLEX_FT]: t('token-type.metaplex-ft-lbl'),
    [TokenType.METAPLEX_NFT]: t('token-type.metaplex-nft-lbl'),
    [TokenType.NEAR_FT]: t('token-type.near-ft-lbl'),
    [TokenType.NEAR_NFT]: t('token-type.near-nft-lbl'),
    [TokenType.UNRECOGNIZED]: t('network-type.unrecognized-lbl'),
  }[type])

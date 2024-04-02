import { useEffect, useState } from 'react'
import { Token, Currency, ChainId } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  ErrorIcon,
  Flex,
  Message,
  Checkbox,
  Link,
  Tag,
  Grid,
  BscScanIcon,
  ListLogo,
  useTooltip,
  HelpIcon,
  AutoColumn,
} from '@pancakeswap/uikit'
import { useAddUserToken } from 'state/user/hooks'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import useSWRImmutable from 'swr/immutable'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useCombinedInactiveList } from 'state/lists/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { chains } from 'utils/wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'

interface ImportProps {
  tokens: Token[]
  handleCurrencySelect?: (currency: Currency) => void
}

const getStandard = (chainId: ChainId) => 'ERC20'

const IMPORT_COUNTDOWN = 5
function ImportToken({ tokens, handleCurrencySelect }: ImportProps) {
  const { chainId } = useActiveChainId()

  const { t } = useTranslation()

  const [confirmed, setConfirmed] = useState(false)

  const addToken = useAddUserToken()

  // use for showing import source on inactive tokens
  const inactiveTokenList = useCombinedInactiveList()

  const hasRiskToken = false
  /*
  const { data: hasRiskToken } = useSWRImmutable(tokens && ['has-risks', tokens], async () => {
    const result = await Promise.all(tokens.map((token) => fetchRiskToken(token.address, token.chainId)))
    return result.some((r) => r.riskLevel >= TOKEN_RISK.MEDIUM)
  })
  */

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('I have read the scanning result, understood the risk and want to proceed with token importing.'),
  )

  const [importCountdown, setImportCountdown] = useState(IMPORT_COUNTDOWN)

  useEffect(() => {
    if (confirmed) {
      const timer = setInterval(() => {
        setImportCountdown((ic) => ic - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
    return undefined
  }, [confirmed])

  return (
    <AutoColumn gap="lg">
      <Message variant="warning">
        <Text>
          {t(
            'Anyone can create tokens on %network% with any name, including creating fake versions of existing tokens and tokens that claim to represent projects that do not have a token.',
            {
              network: chains.find((c) => c.id === chainId)?.name,
            },
          )}
          <br />
          <br />
          <b>{t('If you purchase a fraudulent token, you may be exposed to permanent loss of funds.')}</b>
        </Text>
      </Message>

      {tokens.map((token) => {
        const list = token.chainId && inactiveTokenList?.[token.chainId]?.[token.address]?.list
        const address = token.address ? `${truncateHash(token.address)}` : null
        return (
          <Flex
            flexDirection={['column', 'column', 'row']}
            key={token.address}
            alignItems={['left', 'left', 'center']}
            justifyContent="space-between"
          >
            <Grid gridTemplateRows="1fr 1fr 1fr 1fr" gridGap="4px">
              {list !== undefined ? (
                <Tag
                  variant="success"
                  outline
                  scale="sm"
                  startIcon={list.logoURI && <ListLogo logoURI={list.logoURI} size="12px" />}
                >
                  {t('via')} {list.name}
                </Tag>
              ) : (
                <Tag variant="failure" outline scale="sm" startIcon={<ErrorIcon color="failure" />}>
                  {t('Unknown Source')}
                </Tag>
              )}
              <Flex alignItems="center">
                <Text mr="8px">{token.name}</Text>
                <Text>({token.symbol})</Text>
              </Flex>
              {!!token.chainId && (
                <>
                  <Text mr="4px">{address}</Text>
                  <Link href={getBlockExploreLink(token.address, 'address', token.chainId)} external>
                    (
                    {t('View on %site%', {
                      site: getBlockExploreName(token.chainId),
                    })}
                    {token.chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />})
                  </Link>
                </>
              )}
            </Grid>
          </Flex>
        )
      })}

      <Grid gridTemplateRows="1fr 1fr" gridGap="4px">
        <Flex alignItems="center" onClick={() => setConfirmed(!confirmed)}>
          <Checkbox
            scale="sm"
            name="confirmed"
            type="checkbox"
            checked={confirmed}
            onChange={() => setConfirmed(!confirmed)}
          />
          <Text ml="8px" style={{ userSelect: 'none' }}>
            {hasRiskToken ? t('I acknowledge the risk') : t('I understand')}
          </Text>
          {hasRiskToken && (
            <div ref={targetRef}>
              <HelpIcon color="textSubtle" />
              {tooltipVisible && tooltip}
            </div>
          )}
        </Flex>
        <Button
          variant="danger"
          disabled={!confirmed || importCountdown > 0}
          onClick={() => {
            tokens.forEach((token) => {
              const inactiveToken = chainId && inactiveTokenList?.[token.chainId]?.[token.address]
              let tokenToAdd = token
              if (inactiveToken) {
                tokenToAdd = new WrappedTokenInfo({
                  ...token,
                  logoURI: inactiveToken.token.logoURI,
                  name: token.name || inactiveToken.token.name,
                })
              }
              addToken(tokenToAdd)
            })
            if (handleCurrencySelect) {
              handleCurrencySelect(tokens[0])
            }
          }}
          className=".token-dismiss-button"
        >
          {hasRiskToken ? t('Proceed') : t('Import')}
          {confirmed && importCountdown > 0 ? ` (${importCountdown})` : ''}
        </Button>
      </Grid>
    </AutoColumn>
  )
}

export default ImportToken

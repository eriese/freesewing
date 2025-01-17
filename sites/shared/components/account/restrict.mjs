// Dependencies
import { useTranslation } from 'next-i18next'
// Hooks
import { useAccount } from 'shared/hooks/use-account.mjs'
import { useBackend } from 'shared/hooks/use-backend.mjs'
import { useLoadingStatus } from 'shared/hooks/use-loading-status.mjs'
// Components
import { BackToAccountButton } from './shared.mjs'
import { Popout } from 'shared/components/popout/index.mjs'

export const ns = ['account', 'status']

export const RestrictAccount = () => {
  // Hooks
  const { signOut } = useAccount()
  const backend = useBackend()
  const { t } = useTranslation(ns)
  const { setLoadingStatus, LoadingStatus } = useLoadingStatus()

  // Helper method to export account
  const restrictAccount = async () => {
    setLoadingStatus([true, 'processingUpdate'])
    const result = await backend.restrictAccount()
    if (result.success) {
      setLoadingStatus([true, 'nailedIt', true, true])
      signOut()
    } else setLoadingStatus([true, 'backendError', true, false])
  }

  return (
    <div className="max-w-xl">
      <LoadingStatus />
      <Popout warning>
        <h5>{t('proceedWithCaution')}</h5>
        <p className="text-lg">{t('restrictWarning')}</p>
        <button className="btn btn-error capitalize w-full my-2" onClick={restrictAccount}>
          {t('restrict')}
        </button>
      </Popout>
      <BackToAccountButton />
    </div>
  )
}

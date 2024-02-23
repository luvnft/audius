import { accountSelectors } from '@audius/common/store'
import { Text } from '@audius/harmony'

import { AvatarLegacy } from 'components/avatar/AvatarLegacy'
import { Link, UserLink } from 'components/link'
import { useSelector } from 'utils/reducer'
import { SIGN_IN_PAGE, profilePage } from 'utils/route'

import styles from './AccountDetails.module.css'

const { getAccountUser } = accountSelectors

const messages = {
  haveAccount: 'Have an Account?',
  signIn: 'Sign in'
}

export const AccountDetails = () => {
  const account = useSelector((state) => getAccountUser(state))

  const profileLink = profilePage(account?.handle ?? '')

  return (
    <div className={styles.userHeader}>
      <div className={styles.accountWrapper}>
        <AvatarLegacy userId={account?.user_id} />
        <div className={styles.userInfo}>
          {account ? (
            <>
              <UserLink
                variant='title'
                size='s'
                strength='weak'
                userId={account.user_id}
                badgeSize={12}
              />
              <Link
                variant='body'
                size='xs'
                to={profileLink}
              >{`@${account.handle}`}</Link>
            </>
          ) : (
            <>
              <Text variant='body' size='s' strength='strong'>
                {messages.haveAccount}
              </Text>
              <Link
                to={SIGN_IN_PAGE}
                variant='body'
                size='xs'
                strength='weak'
                color='accent'
              >
                {messages.signIn}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

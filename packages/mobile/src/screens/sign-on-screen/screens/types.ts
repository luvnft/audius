export type SignOnScreenType = 'sign-up' | 'sign-in'

export type SignOnScreenProps = {
  onChangeScreen: (screen: SignOnScreenType) => void
}

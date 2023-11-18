import {
  Box,
  Button,
  Flex,
  IconArrowRight,
  IconAudiusLogoHorizontalColor,
  Text,
  TextLink
} from '@audius/harmony'
import { Form } from 'formik'
import { Link } from 'react-router-dom'

import { HarmonyPasswordField } from 'components/form-fields/HarmonyPasswordField'
import { HarmonyTextField } from 'components/form-fields/HarmonyTextField'
import { ArtworkContainer } from 'pages/sign-on/components/AudiusValues'
import { SignOnContainerMobile } from 'pages/sign-on/components/mobile/SignOnContainerMobile'
import { SIGN_UP_PAGE } from 'utils/route'

import styles from './SignInPageMobile.module.css'

const messages = {
  title: 'Sign Into Audius',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  signIn: 'Sign In',
  newToAudius: 'New to Audius?',
  createAccount: 'Create an Account',
  forgotPassword: 'Forgot password?'
}

export const SignInPageMobile = () => {
  return (
    <SignOnContainerMobile>
      <ArtworkContainer justifyContent='space-between'>
        <Flex
          className={styles.content}
          w='100%'
          pv='2xl'
          ph='l'
          direction='column'
          gap='2xl'
          justifyContent='space-between'
        >
          <Flex direction='column' gap='2xl' alignItems='center'>
            <IconAudiusLogoHorizontalColor />
            <Text variant='heading' size='l' tag='h1' color='accent'>
              {messages.title}
            </Text>
            <Box w='100%'>
              <Form>
                <Flex direction='column' gap='2xl' w='100%'>
                  <Flex direction='column' gap='l'>
                    <HarmonyTextField
                      name='email'
                      label={messages.emailLabel}
                    />
                    <HarmonyPasswordField
                      name='password'
                      label={messages.passwordLabel}
                    />
                  </Flex>
                  <Flex direction='column' gap='l' alignItems='center'>
                    <Button iconRight={IconArrowRight} type='submit' fullWidth>
                      {messages.signIn}
                    </Button>
                    <TextLink variant='visible' textVariant='body'>
                      {messages.forgotPassword}
                    </TextLink>
                  </Flex>
                </Flex>
              </Form>
            </Box>
          </Flex>
        </Flex>
        <Flex
          className={styles.createAccountRow}
          direction='row'
          w='100%'
          justifyContent='center'
          gap='xs'
          mb='4xl'
        >
          <Text variant='title' strength='weak' color='staticWhite'>
            {messages.newToAudius}{' '}
            <TextLink variant='inverted' asChild>
              <Link to={SIGN_UP_PAGE}>{messages.createAccount}</Link>
            </TextLink>
          </Text>
        </Flex>
      </ArtworkContainer>
    </SignOnContainerMobile>
  )
}

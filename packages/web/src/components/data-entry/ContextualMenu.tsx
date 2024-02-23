import { ReactNode, ReactElement, useCallback, useMemo, useEffect } from 'react'

import { Nullable } from '@audius/common/utils'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalFooter,
  Box,
  Text as HarmonyText,
  IconCaretRight,
  Text,
  IconComponent
} from '@audius/harmony'
import { Button, ButtonType } from '@audius/stems'
import {
  Form,
  Formik,
  FormikConfig,
  FormikErrors,
  FormikHelpers,
  FormikValues,
  useFormikContext
} from 'formik'
import { useToggle } from 'react-use'

import { HelperText } from 'components/data-entry/HelperText'
import { Tile } from 'components/tile'

import styles from './ContextualMenu.module.css'

const messages = {
  save: 'Save'
}

export enum MenuFormCallbackStatus {
  OPEN_ACCESS_AND_SALE = 'OPEN_ACCESS_AND_SALE'
}

type MenuFormProps = {
  isOpen: boolean
  onClose: () => void
  label: string
  icon: ReactNode
  menuFields: ReactNode
  closeMenuCallback?: (data?: any) => void
  displayMenuErrorMessage?: (errors: FormikErrors<any>) => Nullable<string>
}

const MenuForm = (props: MenuFormProps) => {
  const {
    isOpen,
    onClose,
    label,
    icon,
    menuFields,
    closeMenuCallback,
    displayMenuErrorMessage
  } = props
  const { resetForm, errors, initialStatus, status, setStatus } =
    useFormikContext()

  const handleCancel = useCallback(() => {
    resetForm()
    onClose()
  }, [resetForm, onClose])

  const errorMessage = useMemo(() => {
    if (errors && displayMenuErrorMessage) {
      return displayMenuErrorMessage(errors)
    }
  }, [displayMenuErrorMessage, errors])

  useEffect(() => {
    // If the menu is closed, trigger callback if exists and reset the status
    if (!isOpen) {
      closeMenuCallback?.(status)
      setStatus(initialStatus)
    }
  }, [isOpen, closeMenuCallback, status, setStatus, initialStatus])

  return (
    <Modal onClose={handleCancel} isOpen={isOpen} size='medium'>
      <ModalHeader>
        <ModalTitle title={label} icon={icon} />
      </ModalHeader>
      <ModalContent>
        <Form id={label}>{menuFields}</Form>
      </ModalContent>
      <ModalFooter className={styles.footer}>
        {errorMessage ? (
          <Box pb='l' ph='xl'>
            <HarmonyText variant='body' color='danger' size='s'>
              {errorMessage}
            </HarmonyText>
          </Box>
        ) : null}
        <Button
          form={label}
          type={ButtonType.PRIMARY}
          text={messages.save}
          buttonType='submit'
        />
      </ModalFooter>
    </Modal>
  )
}

type SelectedValueProps = {
  label?: string
  icon?: IconComponent
  children?: ReactNode
}

export const SelectedValue = (props: SelectedValueProps) => {
  const { label, icon: Icon, children } = props
  return (
    <span className={styles.selectedValue}>
      {Icon ? <Icon size='s' color='default' /> : null}
      {label ? (
        <Text variant='body' strength='strong'>
          {label}
        </Text>
      ) : null}
      {children}
    </span>
  )
}

type SelectedValuesProps = {
  children: ReactNode
}

export const SelectedValues = (props: SelectedValuesProps) => {
  const { children } = props
  return <span className={styles.value}>{children}</span>
}

type ContextualMenuProps<FormValues extends FormikValues> = {
  label: string
  description: string
  icon: ReactElement
  renderValue: () => JSX.Element | null
  menuFields: ReactNode
  closeMenuCallback?: (data?: any) => void
  forceOpen?: boolean
  setForceOpen?: (value: boolean) => void
  error?: boolean
  errorMessage?: string
  displayMenuErrorMessage?: (
    errors: FormikErrors<FormValues>
  ) => Nullable<string>
  previewOverride?: (toggleMenu: () => void) => ReactNode
} & FormikConfig<FormValues>

export const ContextualMenu = <FormValues extends FormikValues = FormikValues>(
  props: ContextualMenuProps<FormValues>
) => {
  const {
    label,
    description,
    icon,
    menuFields,
    renderValue,
    onSubmit,
    forceOpen,
    setForceOpen,
    closeMenuCallback,
    error,
    errorMessage,
    displayMenuErrorMessage,
    previewOverride,
    ...formikProps
  } = props
  const [isMenuOpen, toggleMenu] = useToggle(false)

  useEffect(() => {
    // If forceOpen is true, open the menu and reset the forceOpen flag
    if (forceOpen && setForceOpen) {
      setForceOpen(false)
      toggleMenu()
    }
  }, [forceOpen, setForceOpen, toggleMenu])

  const preview = previewOverride ? (
    previewOverride(toggleMenu)
  ) : (
    <Tile onClick={toggleMenu} className={styles.root} elevation='flat'>
      <div className={styles.header}>
        <div className={styles.title}>
          <Text variant='title' size='l'>
            {label}
          </Text>
          <IconCaretRight color='subdued' size='s' />
        </div>
        <Text variant='body' textAlign='left'>
          {description}
        </Text>
      </div>
      {renderValue()}
      {error ? <HelperText error>{errorMessage}</HelperText> : null}
    </Tile>
  )

  const handleSubmit = useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      onSubmit(values, helpers)
      if (!error) toggleMenu()
    },
    [error, onSubmit, toggleMenu]
  )

  return (
    <>
      {preview}
      <Formik {...formikProps} onSubmit={handleSubmit} enableReinitialize>
        <MenuForm
          label={label}
          icon={icon}
          isOpen={isMenuOpen}
          onClose={toggleMenu}
          menuFields={menuFields}
          closeMenuCallback={closeMenuCallback}
          displayMenuErrorMessage={displayMenuErrorMessage}
        />
      </Formik>
    </>
  )
}

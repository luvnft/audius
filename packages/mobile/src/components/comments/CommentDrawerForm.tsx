import type { RefObject } from 'react'
import React from 'react'

import {
  useCurrentCommentSection,
  useEditComment,
  usePostComment
} from '@audius/common/context'
import type { ID, UserMetadata } from '@audius/common/models'
import { playerSelectors } from '@audius/common/store'
import {
  BottomSheetTextInput,
  type BottomSheetFlatListMethods
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import { Box } from '@audius/harmony-native'

import { CommentForm } from './CommentForm'

type CommentDrawerFormProps = {
  commentListRef: RefObject<BottomSheetFlatListMethods>
  onAutocompleteChange?: (isActive: boolean, value: string) => void
  setAutocompleteHandler?: (handler: (user: UserMetadata) => void) => void
}

export const CommentDrawerForm = (props: CommentDrawerFormProps) => {
  const { commentListRef, onAutocompleteChange, setAutocompleteHandler } = props
  const insets = useSafeAreaInsets()
  const { entityId, replyingAndEditingState, setReplyingAndEditingState } =
    useCurrentCommentSection()
  const { replyingToComment, replyingToCommentId, editingComment } =
    replyingAndEditingState ?? {}
  const [postComment] = usePostComment()
  const [editComment] = useEditComment()
  const playerPosition = useSelector(playerSelectors.getSeek)
  const playerTrackId = useSelector(playerSelectors.getTrackId)

  const handlePostComment = (message: string, mentions?: ID[]) => {
    if (editingComment) {
      editComment(editingComment.id, message, mentions)
    } else {
      const trackTimestampS =
        playerTrackId !== null && playerPosition && playerTrackId === entityId
          ? Math.floor(playerPosition)
          : undefined

      postComment(
        message,
        replyingToCommentId ?? replyingToComment?.id,
        trackTimestampS,
        mentions
      )
    }

    // Scroll to top of comments when posting a new comment
    if (!editingComment && !replyingToComment) {
      commentListRef.current?.scrollToOffset({ offset: 0 })
    }

    setReplyingAndEditingState?.(undefined)
  }

  return (
    <Box p='l' pb={insets.bottom} backgroundColor='white'>
      <CommentForm
        onSubmit={handlePostComment}
        onAutocompleteChange={onAutocompleteChange}
        setAutocompleteHandler={setAutocompleteHandler}
        TextInputComponent={BottomSheetTextInput as any}
      />
    </Box>
  )
}

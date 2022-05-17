export enum UserListType {
  REPOST = 'REPOST',
  FAVORITE = 'FAVORITE',
  FOLLOWER = 'FOLLOWER',
  FOLLOWING = 'FOLLOWING',
  MUTUAL_FOLLOWER = 'MUTUAL_FOLLOWER',
  SUPPORTER = 'SUPPORTER',
  SUPPORTING = 'SUPPORTING'
}

export enum UserListEntityType {
  TRACK = 'TRACK',
  COLLECTION = 'COLLECTION',
  USER = 'USER'
}

export type UserListModalState = {
  userListType: UserListType
  isOpen: boolean
  entityType: UserListEntityType
}

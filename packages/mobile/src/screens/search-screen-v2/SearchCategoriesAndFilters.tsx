import { useCallback } from 'react'

import type {
  SearchFilter,
  SearchCategory as SearchCategoryType
} from '@audius/common/api'
import { ScrollView } from 'react-native'

import {
  FilterButton,
  Flex,
  IconCloseAlt,
  SelectablePill
} from '@audius/harmony-native'
import { useNavigation } from 'app/hooks/useNavigation'

import { useSearchCategory, useSearchFilters } from './searchState'

type SearchCategoryProps = {
  category: SearchCategoryType
}

const SearchCategory = (props: SearchCategoryProps) => {
  const { category } = props
  const [currentCategory, setCategory] = useSearchCategory()
  const isSelected = currentCategory === category

  const labelByCategory = {
    tracks: 'Tracks',
    users: 'Profiles',
    albums: 'Albums',
    playlists: 'Playlists'
  }

  if (currentCategory !== 'all' && !isSelected) return null

  return (
    <SelectablePill
      type='radio'
      value={category}
      label={labelByCategory[category]}
      isSelected={isSelected}
      onChange={(value, isSelected) =>
        setCategory(isSelected ? (value as SearchCategoryType) : 'all')
      }
      icon={isSelected ? IconCloseAlt : undefined}
    />
  )
}

// TODO:
// - Need to sort the filters to put filters with an active value first
// - IconClose looks thicker than the designs

const filterInfoMap: Record<SearchFilter, { label: string; screen: string }> = {
  genre: { label: 'Genre', screen: 'FilterGenre' },
  mood: { label: 'Mood', screen: 'FilterMood' },
  key: { label: 'Key', screen: 'FilterKey' },
  bpm: { label: 'BPM', screen: 'FilterBpm' },
  isVerified: { label: 'Verified', screen: '' },
  isPremium: { label: 'Premium', screen: '' },
  hasDownloads: { label: 'Downloadable', screen: '' }
}

const filtersByCategory: Record<SearchCategoryType, SearchFilter[]> = {
  all: [],
  users: ['genre', 'isVerified'],
  tracks: ['genre', 'mood', 'key', 'bpm', 'isPremium', 'hasDownloads'],
  albums: ['genre', 'mood', 'isPremium', 'hasDownloads'],
  playlists: ['genre', 'mood']
}

export const SearchCategoriesAndFilters = () => {
  const navigation = useNavigation()
  const [category] = useSearchCategory()
  const [filters, setFilters] = useSearchFilters()

  const handleFilterPress = useCallback(
    (filter: string) => {
      if (filters[filter]) {
        // Clear filter value
        const newFilters = { ...filters }
        delete newFilters[filter]
        setFilters(newFilters)
      } else {
        navigation.navigate(filterInfoMap[filter].screen || 'Search')
      }
    },
    [filters, navigation, setFilters]
  )

  return (
    <Flex backgroundColor='white'>
      <ScrollView horizontal keyboardShouldPersistTaps='handled'>
        <Flex direction='row' alignItems='center' gap='s' p='l' pt='s'>
          <SearchCategory category='tracks' />
          <SearchCategory category='users' />
          <SearchCategory category='albums' />
          <SearchCategory category='playlists' />
          {filtersByCategory[category].map((filter) => (
            <FilterButton
              key={filter}
              size='small'
              value={
                filters[filter] !== undefined
                  ? String(filters[filter])
                  : undefined
              }
              label={
                typeof filters[filter] === 'string'
                  ? String(filters[filter])
                  : filterInfoMap[filter].label
              }
              onPress={() => {
                handleFilterPress(filter)
              }}
            />
          ))}
        </Flex>
      </ScrollView>
    </Flex>
  )
}

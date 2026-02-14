/**
 * Available emoji reactions for EmojiFeed
 */
export const EMOJIS = [
  { id: 'heart', emoji: '❤️', label: 'Love' },
  { id: 'laugh', emoji: '😂', label: 'Funny' },
  { id: 'wow', emoji: '😮', label: 'Wow' },
  { id: 'fire', emoji: '🔥', label: 'Fire' },
  { id: 'idea', emoji: '💡', label: 'Insightful' },
  { id: 'dislike', emoji: '👎', label: 'Dislike' }
]

/**
 * Map emoji IDs to emoji characters
 */
export const EMOJI_MAP = EMOJIS.reduce((acc, { id, emoji }) => {
  acc[id] = emoji
  return acc
}, {})

/**
 * Map emoji characters to emoji IDs
 */
export const EMOJI_REVERSE_MAP = EMOJIS.reduce((acc, { id, emoji }) => {
  acc[emoji] = id
  return acc
}, {})

/**
 * Get emoji by ID
 */
export function getEmojiById(id) {
  return EMOJIS.find(e => e.id === id)
}

/**
 * Get emoji by character
 */
export function getEmojiByChar(emoji) {
  return EMOJIS.find(e => e.emoji === emoji)
}

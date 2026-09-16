/**
 * The three iOS portrait layouts, in the order the keys actually appear.
 *
 * `null` marks the two rows that are inset rather than stretched — iOS keeps the letter key width
 * constant across rows instead of spreading nine keys over the same width as ten.
 */
export const LAYOUTS = {
  letters: {
    rows: [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'delete'],
    ],
    inset: 1,
    switchKey: '123',
    switchTo: 'numbers',
  },
  numbers: {
    rows: [
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
      ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
      ['symbols', '.', ',', '?', '!', "'", 'delete'],
    ],
    switchKey: 'ABC',
    switchTo: 'letters',
  },
  symbols: {
    rows: [
      ['[', ']', '{', '}', '#', '%', '^', '*', '+', '='],
      ['_', '\\', '|', '~', '<', '>', '€', '£', '¥', '•'],
      ['numbers', '.', ',', '?', '!', "'", 'delete'],
    ],
    switchKey: 'ABC',
    switchTo: 'letters',
  },
}

/** The label a non-letter key shows. */
export const KEY_LABEL = {
  symbols: '#+=',
  numbers: '123',
}

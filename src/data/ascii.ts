import type { ProjectVariant } from './resume'

/** Hand-drawn ASCII icons for each project type. */
export const projectIcons: Record<ProjectVariant, string> = {
  news: String.raw`
 .-----------------.
 | SANDESH  NEWS ::|
 |=================|
 | ##### | ~~~~~~~ |
 | ##### | ~~~~~~~ |
 | ~~~~~ | ##### ~ |
 | ~~~~~ | ##### ~ |
 '-----------------'`,
  verify: String.raw`
 .------------------.
 |  [ID]  VERIFIED  |
 |  .--.            |
 | ( oo )  ======== |
 |  '--'   =====    |
 |  /||\   [ OK ]   |
 '------------------'`,
  field: String.raw`
     .---.          .
    ( (o) )     . '
     \   /   . '
      \ /  '
       V   >> GPS LOCK
  ======================
  IN 09:02 | OUT 18:30`,
  license: String.raw`
    .--.
   / .. \_______________
   \ '' /--.--.--.--.--'
    '--'   |  |     |
  [LIC-0042] ...... ACTIVE
  [LIC-0043] ...... ACTIVE
  [LIC-0044] ..... RENEWAL`,
  business: String.raw`
          _|_
     ____|___|____
    |  [] [] []  |
    |  [] [] []  |__
    |  [] [] []  |[]|
    |  [] __ []  |[]|
  __|____|  |____|__|__`,
}

export const endOfArchive = String.raw`
 .---------------------------.
 |  END OF ARCHIVE      [■]  |
 |---------------------------|
 |  MORE CLASSIFIED BUILDS   |
 |  AVAILABLE ON REQUEST.    |
 |                           |
 |  >> OPEN CHANNEL _        |
 '---------------------------'`

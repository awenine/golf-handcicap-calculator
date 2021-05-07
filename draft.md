**PAGES**
  - Home / Player List
    - A list of all players, their HI (Handicap Index) and LHI (Low Handicap Index)
    - sorted by Handicap (lowest on top)
    - clicking player name goes to individual page

  - Player page (individual)
    - *POSSIBLE* - course handicap
            (calculated from [HI * slope] / 113 )
            use dropdown menu selection or courses and tees to lookup

    - Top Bar:
      - Name
      - photo
      - HI
        (average of the 8 best handicap differentials from the last 20 rounds played)
          (handicap differential is the [score minus the course rating] muliplied by the slope)
          (*NOTE* - if handicap differential for current round is 7 lower than HI, then last 20 handicap differentials (including current round) are reduced by 1, which then recalculates HI)
          (*NOTE* - if handicap differential for current round is 10 lower than HI, then last 20 handicap differentials (including current round) are reduced by 2, which then recalculates HI)
      - LHI
        (lowest handicap index from the last 20 rounds, replaced if new HI is lower)
    - Table (of golf rounds):
      - Date
        (input, from sheet)
      - Course
        (input, from sheet)
      - Score
        (input, from sheet)
    - Home

**DATA**
  - Courses
    - MOCK: https://docs.google.com/spreadsheets/d/14c1Gq-Ark0LrzcTjEC7UrQQ64KE5lBrzaZugJlPY45w/edit#gid=0
    - Name
    - Tee
      - slope
      - course rating

  - Players (seperate google sheets in one doc)
    - MOCK: https://docs.google.com/spreadsheets/d/1P_5i5IFF9clBVtP93PESG6JyamjWE4xiV-hkWEME-v8/edit#gid=0
    - Dates
    - Score

**STUFF TO ADD**
- soft/hard caps for LHI
- date checking for within 1 year of LHI

**LHI**
- < 20 games - no LHI
- 20 games - HI = LHI
- > 20 games - lowest HI from every game over 20 = LHI

eg 23 games
HI1 - 1-20
HI2 - 2-21
HI2 - 3-22
HI2 - 4-23
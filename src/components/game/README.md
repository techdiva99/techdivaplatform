# TechDiva Games Directory Structure

This directory contains all the educational games for the TechDiva platform, organized by game type for better maintainability and scalability.

## Directory Structure

```
/src/components/game/
├── GamesGallery.jsx                    # Main games gallery/launcher
├── coding-adventure/                   # TechDiva's Coding Adventure Game
│   ├── CodingGame.jsx                 # Main game component
│   ├── components/                     # Game-specific components
│   │   ├── TreasurePopup.jsx          # Treasure discovery popup
│   │   ├── TechDivaLoader.jsx         # Game loading screen with TechDiva
│   │   ├── GameStore.jsx              # In-game store for upgrades
│   │   ├── MusicPlayer.jsx            # Background music player
│   │   └── ConceptSummary.jsx         # Learning concept summary
│   └── assets/                        # Game assets and documentation
│       └── game_animation_script.txt  # Animation script for video creation
├── algorithm-quest/                    # Algorithm Quest Game
│   └── AlgorithmQuest.jsx             # Main component
└── README.md                          # This file
```

## Game Descriptions

### TechDiva's Coding Adventure
- **Location**: `/coding-adventure/`
- **Description**: A grid-based adventure where players collect coding treasures and learn programming concepts
- **Target Age**: 5-12 years
- **Concepts Taught**: Variables, Loops, Functions, Conditionals, Arrays, Objects
- **Features**: 
  - Interactive grid exploration
  - TechDiva voice narration
  - Magical light bulb theme
  - "Unlit Mysteries" replaced "Ignorance" for kid-friendly messaging
  - Brand color integration (pink, orange, blue)

### Algorithm Quest
- **Location**: `/algorithm-quest/`
- **Description**: Coming soon - Advanced algorithmic thinking challenges
- **Target Age**: 10+ years

## Adding New Games

To add a new game:

1. Create a new subdirectory: `/src/components/game/[game-name]/`
2. Add main component: `[game-name]/GameName.jsx`
3. Create subfolders as needed:
   - `components/` for game-specific components
   - `assets/` for images, sounds, scripts, etc.
   - `utils/` for game-specific utilities
4. Update `GamesGallery.jsx` to include the new game
5. Update this README with game description

## Import Paths

When importing game components:
- From outside games directory: `import CodingGame from './components/game/coding-adventure/CodingGame'`
- Within a game directory: `import TreasurePopup from './components/TreasurePopup'`
- Between games: `import OtherGame from '../other-game/OtherGame'`

## Brand Integration

All games should follow TechDiva brand guidelines:
- **Colors**: Pink (#ff67c7), Orange (#ff9671), Blue (#0aabde)
- **Theme**: Magical, educational, kid-friendly
- **Character**: TechDiva as guide/mentor
- **Messaging**: Positive, encouraging, learning-focused

## Asset Organization

Each game's assets should be organized in their respective `assets/` folder:
- Images: `assets/images/`
- Sounds: `assets/sounds/`
- Scripts: `assets/scripts/`
- Documentation: `assets/docs/`

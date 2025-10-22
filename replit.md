# AI Agent Hub

## Overview

AI Agent Hub is a gamified web application that provides AI-powered creative tools through a coin-based economy system. Users earn virtual coins and spend them to unlock and use various AI tools for image generation, video creation, and media editing. The application features a freemium model where users can earn coins through a cooldown-based mechanism and spend them to access premium AI features.

The application starts with a welcoming homepage that introduces users to the platform's features before they access the main tool dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**: Vanilla JavaScript, HTML5, and CSS3
- **Rationale**: Lightweight, no-framework approach for simple interactivity and fast load times
- **Pros**: Minimal dependencies, easy to understand, quick initial development
- **Cons**: May require refactoring if complexity increases significantly

**Component Structure**: Single-page application (SPA) with modular JavaScript
- **Problem**: Need for interactive UI without page reloads
- **Solution**: Client-side JavaScript handles all state management and DOM manipulation
- **Key Components**:
  - Homepage with introduction and navigation to tools
  - Coin economy system with cooldown mechanics
  - Tool unlock/lock states
  - Cost management for generation and unlocking
  - Multiple file upload support for editing tools

**Styling Approach**: CSS custom properties (variables) with blue and black theme design system
- **Design System**: Comprehensive CSS variable system for colors, spacing, shadows, borders, and transitions
- **Theme**: Blue and black color scheme with semantic color naming (primary, secondary, tertiary backgrounds)
- **Rationale**: Maintainable styling with consistent design tokens across the application
- **Updated Theme (Oct 2025)**: Changed from teal/dark to blue/black color scheme for a more modern, tech-focused aesthetic

### State Management

**Client-Side State**: In-memory JavaScript objects
- **Coin Balance**: Tracked globally with synchronization across multiple display elements
- **Unlock Status**: Boolean flags for each tool (image, video, videoedit, imageedit)
- **Cooldown State**: Time-based restrictions on coin earning
- **Implementation**: Global variables with update functions that sync UI elements

**Cost Structure**: Two-tier pricing model
- **Unlock Costs**: One-time payment to access a tool (30-50 coins)
  - AI Image: 30 coins
  - AI Video: 50 coins
  - AI Video Edit: 50 coins
  - AI Image Edit: 30 coins
- **Generation Costs**: Per-use payment for each generation (10-15 coins)
  - AI Image: 10 coins per generation
  - AI Video: 15 coins per generation
  - AI Video Edit: 15 coins per edit
  - AI Image Edit: 10 coins per edit
- **Rationale**: Creates progression mechanics and ongoing engagement

### UI/UX Patterns

**Icon System**: SVG sprite sheet for reusable icons
- **Icons Included**: palette, video, scissors, image, book, coin, lock, unlock
- **Rationale**: Performance optimization through SVG reuse, smaller payload than individual files

**Cooldown Mechanism**: 15-second display timer prevents rapid coin farming
- **Problem**: Need to prevent abuse while maintaining engagement
- **Solution**: Time-gated earning with visual countdown feedback
- **Implementation**: setInterval-based countdown with UI updates (750ms intervals, completing in ~11.25 seconds while displaying full 15-second countdown to users)
- **UX Optimization**: Faster actual completion time maintains engagement while displaying expected wait time

**Multi-Element Sync**: Coin display synchronization pattern
- **Problem**: Coin count appears in multiple locations (header, modals, etc.)
- **Solution**: querySelectorAll updates all elements with class selectors simultaneously
- **CSS Classes**: `#coinCount`, `.coin-count-sync`, `#modalCoinCount`

### Design System

**Color Palette**: Blue accent colors on black backgrounds
- **Primary Action**: Blue (#2196f3) for positive actions and interactive elements
- **Secondary Action**: Light blue (#42a5f5) for complementary elements
- **Background**: Pure black (#000000) primary, with deep blue-tinted secondary backgrounds
- **Semantic Colors**: Blue (success/primary), warning (orange), error (red)

**Spacing System**: 8-point grid system (0.25rem increments)
- **Scale**: xs (0.25rem) to 3xl (4rem)
- **Rationale**: Consistent visual rhythm and alignment

**Shadow System**: Four-tier elevation system for depth perception
- **Levels**: sm, md, lg, xl with increasing opacity and blur
- **Purpose**: Visual hierarchy and component layering in dark theme

**Border Radius**: Five-tier rounding system
- **Scale**: sm (8px) to full (9999px/circular)
- **Application**: Consistent corner treatments across components

**Transitions**: Cubic bezier easing for smooth interactions
- **Timing**: 150ms fast transitions
- **Easing**: (0.4, 0, 0.2, 1) for natural feel

## External Dependencies

### Fonts
- **Google Fonts API**: Inter font family (weights 400, 500, 600, 700, 800)
- **Purpose**: Modern, readable sans-serif typeface
- **Loading Strategy**: Preconnect optimization for performance

### Future AI Integrations (Implied)
The application structure suggests integration points for:
- **Image Generation API**: For the image generation tool
- **Video Generation API**: For video creation functionality
- **Image Editing API**: For image manipulation features
- **Video Editing API**: For video editing capabilities

Note: Actual API integrations are not currently implemented in the provided code but are architecturally anticipated based on the tool structure.

### Asset Management
- **SVG Icons**: Inline sprite system (no external icon libraries)
- **Rationale**: Reduces HTTP requests and external dependencies

## Recent Changes

### October 22, 2025 (Latest)
1. **Streamlined Earn Coin Flow**: Simplified coin earning to single modal experience
   - Removed the second confirmation popup (earnCoinConfirmModal)
   - "Earn Coin" button now directly shows the main earn coins modal
   - Important advertisement note now integrated directly in the main modal
   - Users can only close the modal manually (no clicking outside to close)
   - "Earn 1 Coin" button has 15-second cooldown timer (displays 15s, actually runs 12s)
   - Psychological optimization: Timer feels faster than expected for better UX
   - Button shows "Wait Xs" countdown and is disabled during cooldown
   - Status text updates to "Please wait X seconds..." during cooldown
   - Cleaner, more straightforward user experience

2. **Homepage Simplification**: Removed decorative emojis from features list
   - Clean plain text display for better customization
   - Features list now shows simple text format

3. **Unlock Confirmation Modal**: Added two-step unlock process for better user control
   - Confirmation dialog appears before unlocking any tool
   - Shows tool name and exact coin cost
   - Users can cancel or confirm the unlock
   - After unlocking, users remain on dashboard page
   - Must manually click tool card again to enter the tool
   - Prevents accidental unlocks and gives users full control

### October 22, 2025 (Earlier)
1. **Theme Update**: Changed color scheme from teal/dark to blue/black for a modern aesthetic
   - Primary backgrounds now use pure black (#000000)
   - Accent colors changed to blue tones (#2196f3, #42a5f5)
   - Updated all gradients and interactive elements

2. **Homepage Addition**: New landing page before main dashboard
   - Welcome message and feature overview
   - "Continue to Tools" button for navigation
   - Responsive design with gradient background

3. **Timer Optimization**: Cooldown timer UX improvement
   - Displays full 15-second countdown to users
   - Completes in ~11.25 seconds (750ms intervals)
   - Maintains engagement while meeting user expectations

4. **Pricing Update**: AI Video Edit now matches AI Video pricing
   - Unlock cost: 50 coins (previously 30)
   - Generation cost: 15 coins (previously 10)
   - Consistent pricing for video-related features

5. **Multiple File Upload Support**: Enhanced editing capabilities
   - Image edit tool now accepts multiple image files
   - Video edit tool now accepts multiple video files
   - File counter displays number of selected files
   - Updated UI labels and instructions
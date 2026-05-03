## 1. Global Style Updates

- [x] 1.1 Update `.hbtn` font-size to 13px and padding to 8px 12px in `GlobalStyles.jsx`
- [x] 1.2 Update `.qbtn` font-size to 13px and padding to 6px 12px in `GlobalStyles.jsx`
- [x] 1.3 Increase `.hdr` padding to 10px 14px in `GlobalStyles.jsx`
- [x] 1.4 Increase `.clock-bar` padding to 8px 14px in `GlobalStyles.jsx`

## 2. Component-Specific Refinements

- [x] 2.1 Adjust Game Screen header layout to ensure opponent name and buttons remain balanced
- [x] 2.2 Verify that the vertical "GAME/STINT" toggle in `GameScreen.jsx` doesn't overlap the clock display
- [x] 2.3 Ensure "Back" buttons in Roster, History, and New Game screens inherit the new `.hbtn` scaling

## 3. Validation

- [x] 3.1 Verify touch targets measure at least 36px in height using browser developer tools
- [x] 3.2 Regression test: Confirm that long team names still handle ellipsis correctly in the header
- [x] 3.3 Verify visual consistency across all themes (Scoreboard, Midnight, etc.)

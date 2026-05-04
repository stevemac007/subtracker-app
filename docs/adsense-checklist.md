# Google AdSense Application Checklist

## Pre-Application Requirements

### Site Readiness
- [x] Site is live at a stable domain (subtracker.app or Netlify URL)
- [x] Privacy Policy page exists (`/privacy.html`)
- [x] Terms of Service page exists (`/terms.html`)
- [x] Cookie Policy page exists (`/cookie-policy.html`)
- [x] Contact email configured (privacy@subtracker.app, legal@subtracker.app)
- [ ] Site has meaningful content (basketball substitution tracker)
- [ ] Navigation is clear and functional
- [ ] No broken links or 404 errors

### Content Quality
- [x] Original content (custom-built app)
- [ ] Sufficient content volume (consider adding: help docs, blog posts, tips for coaches)
- [ ] Content is family-safe (youth sports)
- [ ] No prohibited content (gambling, adult, illegal)

### Technical Setup
- [x] `robots.txt` allows AdSense crawler (need to verify)
- [x] Site loads quickly (< 3 seconds)
- [x] Mobile-responsive design
- [ ] SSL certificate active (HTTPS)
- [ ] SPA routing configured (`_redirects` file in place)

### Pages to Verify Post-Deploy
1. https://subtracker.app/privacy.html
2. https://subtracker.app/terms.html
3. https://subtracker.app/cookie-policy.html
4. https://subtracker.app/ (home page with clear navigation)

## Application Steps

1. **Register Domain** (if not done)
   - Ensure subtracker.app is properly configured
   - Set up email aliases (privacy@, legal@)

2. **Deploy to Production**
   ```bash
   cd /Users/steve/development/whitesquaresoft/paperclip-whitesquare
   npm run build
   netlify deploy --dir=dist --prod
   ```

3. **Apply for AdSense**
   - Go to https://www.google.com/adsense
   - Sign in with Google account
   - Add site URL: `https://subtracker.app`
   - Wait for site review (1-14 days typically)

4. **After Approval**
   - Get AdSense publisher ID (format: `ca-pub-XXXXXXXXXXXXXXX`)
   - Update `src/components/AdSenseBanner.jsx` with real publisher ID
   - Update `data-ad-slot` with assigned ad unit slot ID
   - Redeploy

## Current Blocker
**Site not deployed**: subtracker.app returns 404. Need to either:
- Deploy to Netlify (recommended): `netlify deploy --dir=dist --prod`
- Or verify DNS/Hosting for subtracker.app

## Next Action
Deploy the site to a live, publicly accessible URL, then apply at adsense.google.com.

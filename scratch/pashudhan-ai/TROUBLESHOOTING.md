# Troubleshooting Guide - PashuDhan AI Livestock Scanner

## Breed Detection Issues

### Problem: "Unknown" breed detected
**Causes:**
- Poor image quality or blurry photos
- Image doesn't clearly show the animal
- Breed not in training data

**Solutions:**
1. ✅ Upload a clearer, well-lit image
2. ✅ Ensure the entire animal is visible in the frame
3. ✅ Try different angles of the same animal
4. ✅ For mixed breeds, Roboflow will detect the closest breed
5. ✅ Check browser console (F12) for detailed error messages

### Problem: Incorrect breed identification
**Causes:**
- Similar-looking breeds
- Partial view of animal
- Image quality issues
- Roboflow model limitations

**Solutions:**
1. ✅ Provide clearer, front-facing images
2. ✅ Take photos in good natural lighting
3. ✅ Ensure the animal's distinctive features are visible
4. ✅ Try uploading multiple images - system will learn
5. ✅ Roboflow will improve as more training data is added

### Problem: "Confidence 0%" or very low confidence
**Causes:**
- Image doesn't match training data
- Very poor image quality
- Not livestock in image
- API connection issues

**Solutions:**
1. ✅ Verify the image actually contains livestock
2. ✅ Check image format (JPG, PNG, WebP supported)
3. ✅ Ensure image is at least 640x480 resolution
4. ✅ Check your internet connection
5. ✅ Verify API keys are valid in .env.local

## Health Analysis Issues

### Problem: Health status shows "Unknown"
**Causes:**
- Gemini API not properly configured
- Image too dark or unclear for analysis
- API key invalid or expired

**Solutions:**
1. ✅ Verify `VITE_GEMINI_API_KEY` in .env.local
2. ✅ Get a fresh API key from [Google AI Studio](https://ai.google.dev/)
3. ✅ Ensure image is well-lit and clear
4. ✅ Reload the page and try again
5. ✅ Check console for specific API error messages

### Problem: Health analysis seems inaccurate
**Note:** AI analysis is a starting point, not a substitute for veterinary care

**Recommendations:**
1. ✅ Always consult a qualified veterinarian for diagnosis
2. ✅ Use the app for quick assessment, not final diagnosis
3. ✅ Provide context symptoms along with images
4. ✅ Report discrepancies to improve the model

### Problem: "Health Alert" shown incorrectly
**Solutions:**
1. ✅ This is a safety feature to encourage vet consultation
2. ✅ Consult a veterinarian to rule out health issues
3. ✅ Report false positives to improve accuracy

## API Configuration Issues

### Problem: "VITE_ROBOFLOW_API_KEY is not set"
**Solutions:**
1. ✅ Create `.env.local` file in project root
2. ✅ Copy content from `.env.example`
3. ✅ Add your actual Roboflow API key
4. ✅ Restart development server (npm run dev)
5. ✅ Clear browser cache (Ctrl+Shift+Delete)

### Problem: "VITE_GEMINI_API_KEY is not set"
**Solutions:**
1. ✅ Add to `.env.local`: `VITE_GEMINI_API_KEY=your_key`
2. ✅ Get API key from [Google AI Studio](https://ai.google.dev/)
3. ✅ Restart dev server: `npm run dev`
4. ✅ Make sure no extra spaces around the key

### Problem: "Network error" when scanning
**Causes:**
- Internet connection issue
- API server down
- CORS issue
- API quota exceeded

**Solutions:**
1. ✅ Check internet connection
2. ✅ Try again in a few minutes
3. ✅ Check API status pages:
   - Roboflow: status.roboflow.com
   - Google: https://status.cloud.google.com/
4. ✅ Check if API quota exceeded
5. ✅ Try clearing browser cache

## Performance Issues

### Problem: Scanning takes too long
**Normal timing:**
- Image upload + processing: 3-8 seconds
- Health analysis: 2-5 seconds

**If taking longer:**
1. ✅ Check internet speed
2. ✅ Check if API services are slow
3. ✅ Try smaller image files (< 5MB)
4. ✅ Close other tabs/applications
5. ✅ Try on a different network

### Problem: App is slow or freezing
**Solutions:**
1. ✅ Clear browser cache: Ctrl+Shift+Delete
2. ✅ Close unnecessary browser tabs
3. ✅ Restart development server: `npm run dev`
4. ✅ Update browser to latest version
5. ✅ Try a different browser

## Image Upload Issues

### Problem: "Image format not supported"
**Supported formats:** JPG, PNG, WebP

**Solutions:**
1. ✅ Convert image to JPG or PNG
2. ✅ Use free converter: convertio.co or cloudconvert.com
3. ✅ Check file extension is correct
4. ✅ Re-export from phone camera or image editor

### Problem: Image file too large
**Recommended size:** 500KB - 5MB

**Solutions:**
1. ✅ Compress image: compressor.io
2. ✅ Use browser DevTools to check file size
3. ✅ Take new photo with lower resolution
4. ✅ Crop image to focus on livestock

### Problem: Camera upload not working
**Solutions:**
1. ✅ Check browser permissions (Settings → Camera)
2. ✅ Try different browser (Chrome, Firefox, Safari)
3. ✅ Use file upload instead of camera
4. ✅ Ensure camera is enabled in browser settings

## Specific Error Messages

### "Parse error: No JSON found"
- Gemini didn't return valid JSON
- Try again with clearer image
- Report to dev team if persistent

### "Could not analyze image"
- API returned unexpected format
- Image quality too poor
- Try uploading different image

### "Server error: 401"
- Invalid API key
- Check .env.local configuration
- Get fresh API keys

### "Server error: 429"
- Rate limit exceeded
- Wait a few minutes before trying again
- Consider upgrading API plan

### "Server error: 500"
- API server error (temporary)
- Wait a few minutes
- Try again later

## Best Practices for Accurate Detection

### Taking Good Photos
1. ✅ **Lighting:** Use natural daylight, avoid shadows
2. ✅ **Angle:** Front-facing or side profile works best
3. ✅ **Distance:** Entire animal visible, not too close
4. ✅ **Clarity:** Focus on livestock, minimal background
5. ✅ **Format:** JPG or PNG, 640x480 minimum

### Image Examples
- **GOOD:** Clear side profile, good lighting, entire animal visible
- **GOOD:** Front-facing with full body in view
- **BAD:** Very close zoom, only head visible
- **BAD:** Dark/blurry, animal partially hidden
- **BAD:** Multiple animals or cluttered background

### For Health Analysis
1. ✅ Use the breed-detected image for best health analysis
2. ✅ Include multiple angles if health concerns suspected
3. ✅ Combine with symptom description in Health Tracking
4. ✅ Note any recent behavior changes

## Getting Help

### Still Having Issues?
1. ✅ Check this troubleshooting guide completely
2. ✅ Review console errors (F12 → Console tab)
3. ✅ Verify all API keys in .env.local
4. ✅ Restart development server
5. ✅ Try clearing cache and cookies

### Contact Support
- GitHub Issues: [Report bugs]
- Email: [support email]
- Documentation: README.md & SETUP_ROBOFLOW.md

### Log Information to Share
When reporting issues, include:
1. Screenshot of error message
2. Browser and OS version
3. Steps to reproduce
4. Console errors (F12 → Console)
5. Image file details (size, format, etc.)

---

**Last Updated:** 2024
**Maintained by:** PashuDhan AI Team

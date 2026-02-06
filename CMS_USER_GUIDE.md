# IKF Induction CMS - User Guide

## 🚀 Getting Started

### Accessing the CMS

1. Open your browser and navigate to: `http://localhost:3000/cms.html`
2. Enter the default password: `admin123`
3. Click "Access CMS"

### First Time Setup

The CMS is ready to use immediately after login. All content from your induction portal has been extracted into editable fields.

---

## 📝 Editing Content

### Selecting a Section

1. Look at the left sidebar
2. Click on any section you want to edit (e.g., "Hero Section", "Management Team")
3. The content editor will load on the right side

### Editing Text

1. Find the field you want to edit
2. Click into the text box or textarea
3. Make your changes
4. The system automatically tracks your changes

### Understanding Field Types

- **Short Text Fields**: Single-line inputs for titles, labels, etc.
- **Long Text Fields**: Multi-line textareas for descriptions and paragraphs
- **Number Fields**: For numerical values like stats
- **Nested Objects**: Grouped fields in colored boxes
- **Arrays**: Multiple items (like team members, social platforms)

### HTML in Content

Some fields support HTML tags for formatting:
- `<strong>Bold text</strong>`
- `<span class="gradient">Highlighted text</span>`
- `<br />` for line breaks

---

## 🖼️ Managing Images

### Opening Image Manager

1. Click "Manage Images" button in the left sidebar
2. The image manager modal will open

### Uploading New Images

**Method 1: Drag & Drop**
1. Drag image files from your computer
2. Drop them into the upload zone
3. Images will be added to the upload queue

**Method 2: Click to Browse**
1. Click "Choose Files" button
2. Select images from your computer
3. Click "Open"

### Viewing Current Images

- All existing images are displayed in a grid
- Hover over an image to see options
- Click "Replace" to update an image

### Supported Formats

- JPG/JPEG
- PNG
- SVG
- WebP

### File Size Limit

Maximum 5MB per image

---

## 💾 Saving Changes

### Save All Changes

1. Click the green "Save All Changes" button in the top right
2. Two JSON files will automatically download:
   - `content.json`
   - `images-manifest.json`
3. Replace the existing files in the `data/` folder with these new files
4. Refresh your main website to see the changes

### Important Notes

- Changes are NOT live until you replace the JSON files
- Always keep backups of your original JSON files
- The CMS saves a backup to localStorage automatically

---

## 👁️ Previewing Changes

### Live Preview

1. Click the yellow "Preview" button in the top right
2. Your main website will open in a new tab
3. Note: You'll see the OLD content until you save and replace the JSON files

### Recommended Workflow

1. Edit content in CMS
2. Save changes (downloads JSON files)
3. Replace JSON files in `data/` folder
4. Click Preview to see live changes
5. Repeat as needed

---

## 🔐 Security

### Password Management

**Default Password**: `admin123`

**To Change Password**:
1. Open `js/cms-app.js`
2. Find line: `defaultPassword: 'admin123'`
3. Change to your desired password
4. Save the file

### Session Management

- Sessions last 1 hour
- Auto-logout after inactivity
- Warning before logout if you have unsaved changes

### Best Practices

- Don't share your CMS password
- Always logout when done
- Keep CMS files secure (don't deploy to public server)

---

## 🛠️ Troubleshooting

### Can't Login

**Problem**: Password not working
**Solution**: 
- Check you're using the correct password
- Clear browser cache and try again
- Check browser console for errors

### Content Not Loading

**Problem**: Blank editor or errors
**Solution**:
- Ensure `data/content.json` exists
- Check JSON file is valid (use JSONLint.com)
- Check browser console for errors

### Changes Not Saving

**Problem**: Save button doesn't work
**Solution**:
- Check browser allows downloads
- Ensure you have write permissions
- Try a different browser

### Images Not Uploading

**Problem**: Upload fails
**Solution**:
- Check file size (max 5MB)
- Ensure file is an image format
- Try a different image

### Changes Not Showing on Website

**Problem**: Saved changes don't appear
**Solution**:
- Ensure you replaced the JSON files in `data/` folder
- Hard refresh the website (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache

---

## 📋 Content Structure Reference

### Hero Section
- Badge text
- Main title (2 lines with highlights)
- Subtitle
- CTA button text
- Stats (years, team size)

### Introduction
- Badge, title, subtitle
- Mission statement
- Stats (strategies, clients)

### Management Team
- Leader profiles (name, role, image, bio)
- Skills and percentages

### Philosophy
- I.K.F pillars (Innovation, Knowledge, Factory)
- Descriptions for each

### Mission & Vision
- Vision statement
- Mission statement
- Core values (T.R.I.I.I.P)

### Culture
- Stats (happiness index, parties, learning hours)
- Main message
- Values

### Social Media
- Platform stats (LinkedIn, Instagram, Facebook, YouTube)
- Featured posts
- Recent activity

### Referral Policy
- Tier levels (Junior, Specialist, Architect)
- Rewards
- Process steps

### Work Anniversaries
- Milestone categories (10+, 5+, 1+ years)
- Team member listings

### Birthdays
- Upcoming birthdays
- Team member details

### Holidays
- Holiday list
- Policy information

### Attendance
- Work schedule
- Core hours
- Punctuality rules

### Policies
- Probation period
- Notice period
- Payout date
- Compliance info

---

## 💡 Tips & Best Practices

### Content Writing

1. **Be Concise**: Keep text clear and scannable
2. **Use Formatting**: Leverage HTML tags for emphasis
3. **Consistency**: Maintain consistent tone across sections
4. **Proofread**: Always review before saving

### Image Management

1. **Optimize First**: Compress images before uploading
2. **Naming**: Use descriptive filenames
3. **Alt Text**: Always provide meaningful alt text
4. **Consistency**: Maintain consistent image sizes/styles

### Workflow

1. **Plan Changes**: List what you want to update
2. **Edit in Batches**: Update related sections together
3. **Save Frequently**: Don't lose your work
4. **Test Thoroughly**: Preview before going live

### Backup Strategy

1. **Before Editing**: Backup current JSON files
2. **After Major Changes**: Create dated backups
3. **Version Control**: Consider using Git for JSON files

---

## 🆘 Support

### Common Questions

**Q: Can multiple people edit at once?**
A: No, this CMS is single-user. Last save wins.

**Q: Can I undo changes?**
A: Not directly. Keep backups of JSON files.

**Q: How do I add new sections?**
A: You'll need to edit the JSON structure manually and update the CMS code.

**Q: Can I change the CMS design?**
A: Yes! Edit `cms.html` and `js/cms-app.js`.

### Getting Help

If you encounter issues:
1. Check this guide
2. Check browser console for errors
3. Verify JSON file structure
4. Contact your developer

---

## 📚 Technical Details

### File Structure

```
Induction 02/
├── cms.html              # CMS interface
├── data/
│   ├── content.json      # All text content
│   └── images-manifest.json  # Image tracking
├── js/
│   └── cms-app.js        # CMS logic
└── uploads/              # Uploaded images
```

### Data Format

Content is stored in JSON format with nested objects:

```json
{
  "section": {
    "field": "value",
    "nested": {
      "subfield": "value"
    },
    "array": [
      { "item": "value" }
    ]
  }
}
```

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requirements

- Modern web browser
- JavaScript enabled
- Local web server (for file access)

---

## 🎯 Quick Reference

### Keyboard Shortcuts

- `Ctrl/Cmd + S`: Save (when in text field)
- `Esc`: Close modals
- `Tab`: Navigate between fields

### Button Guide

- 🟢 **Save All Changes**: Download updated JSON files
- 🟡 **Preview**: Open main website in new tab
- ⚪ **Logout**: Exit CMS (warns if unsaved changes)
- 🔵 **Manage Images**: Open image manager

### Status Indicators

- **Unsaved Changes**: Tracked automatically
- **Session Active**: 1 hour timeout
- **Upload Queue**: Shows pending uploads

---

**Last Updated**: February 6, 2026
**Version**: 1.0.0
**CMS Password**: admin123 (change this!)

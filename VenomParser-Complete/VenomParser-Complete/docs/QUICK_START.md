# 🚀 VenomParser - QUICK START GUIDE

**VenomProjects - Solar Tech Solutions**  
*Australian Electricity Bill Parser v11.3*

---

## Immediate Testing (5 minutes)

### Step 1: Open the Test Page
1. Download all files from the outputs directory
2. Double-click `bill-parser-test-page.html`
3. It will open in your default browser

### Step 2: Test with Your Bills
1. Click the upload area or drag & drop a PDF bill
2. Watch it parse in real-time (1-3 seconds)
3. See the extracted data and system recommendation

**That's it!** You now have a working bill parser.

---

## Integration with Your Solar Calculator (15 minutes)

### What You're Replacing

Currently your calculator uses **mock data** like this:
```javascript
const mockData = {
    customerName: 'John Smith',
    address: '123 Main St, Wonthaggi VIC',
    nmi: '6407052849',
    dailyUsage: Math.floor(Math.random() * 20) + 18,
    quarterlyBill: Math.floor(Math.random() * 300) + 450,
    provider: 'AGL Energy'
};
```

You'll replace it with **real PDF parsing** that extracts actual data.

### Integration Steps

#### 1. Add the Parser to Your Website

Copy `bill-parser-complete.js` to your website's scripts folder.

#### 2. Add Required Script Tags

In your `index.html`, add these lines **before the closing `</body>` tag**:

```html
<!-- PDF.js Library (required for parsing) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>

<!-- Your Bill Parser -->
<script src="bill-parser-complete.js"></script>

<script>
    // Initialize PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 
        'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
</script>
```

#### 3. Replace processBill() Function

In your `index.html`, find the `processBill()` function (line ~4897).

**Option A - Full Replace:**
Copy the entire function from `updated-processBill-function.js` and paste it over your existing function.

**Option B - Key Changes Only:**
Change these specific lines:

**OLD (lines 4916-4924):**
```javascript
// Mock extracted data (in production, this comes from PDF parser)
const mockData = {
    customerName: 'John Smith',
    address: '123 Main St, Wonthaggi VIC',
    nmi: '6407052849',
    dailyUsage: Math.floor(Math.random() * 20) + 18,
    quarterlyBill: Math.floor(Math.random() * 300) + 450,
    provider: 'AGL Energy'
};
```

**NEW:**
```javascript
// Parse real PDF data
const parser = new AustralianBillParser();
const mockData = await parser.parsePDF(file);
```

**Important:** Also change `function processBill(input)` to `async function processBill(input)` (line 4897)

#### 4. Test Your Integration

1. Upload a test PDF bill
2. Open browser console (F12)
3. Watch for any errors
4. Verify extracted data is correct

---

## Testing & Validation

### Quick Test in Browser Console

After uploading a bill:

```javascript
// Get the uploaded file
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

// Parse it
const parser = new AustralianBillParser();
const data = await parser.parsePDF(file);

// View results
console.log(data);
```

### Expected Success Output

```javascript
{
    customerName: "Gerhard Fries",
    address: "5 Frys Lane, Poowong VIC 3988",
    nmi: "63057859647",
    dailyUsage: 23,
    quarterlyBill: 71.47,
    provider: "1st Energy"
}
```

### If You Get Warnings

Some fields may be estimated:
```javascript
{
    ...
    _warnings: [
        "Customer name not found",
        "Daily usage estimated"
    ]
}
```

This is normal for some bill formats. The parser uses smart defaults.

---

## Common Issues & Fixes

### Issue 1: "pdfjsLib is not defined"

**Cause:** PDF.js not loaded

**Fix:** Add the PDF.js script tag before your parser:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
```

### Issue 2: "AustralianBillParser is not defined"

**Cause:** Parser file not loaded

**Fix:** Check the file path in your script tag:
```html
<script src="bill-parser-complete.js"></script>
```

### Issue 3: Parsing takes forever

**Cause:** Worker not initialized

**Fix:** Add this after loading PDF.js:
```javascript
pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
```

### Issue 4: Wrong data extracted

**Cause:** Bill format not recognized

**Fix:** Check the retailer is supported. If not, you can add custom patterns.

---

## What Gets Extracted

### From This Bill:
```
═══════════════════════════════
ALINTA ENERGY

Gerhard Fries
Lot 1 5 Frys Lane
POOWONG VIC 3988

NMI: 63057859647
Daily usage: 4.16 kWh
Amount due: $29.67 cr
═══════════════════════════════
```

### Parser Extracts:
```javascript
{
    customerName: "Gerhard Fries",
    address: "Lot 1 5 Frys Lane POOWONG VIC 3988",
    nmi: "63057859647",
    dailyUsage: 4.16,
    quarterlyBill: 29.67,
    provider: "Alinta Energy"
}
```

### Calculator Uses:
- **Daily usage** → Recommends solar system size
- **Quarterly bill** → Calculates savings
- **Customer details** → Pre-fills Tally form
- **NMI** → Identifies property

---

## Recommended Solar System Logic

The parser automatically calculates recommendations:

| Daily Usage | System | Battery | Why |
|------------|--------|---------|-----|
| ≤ 22 kWh | 6.6kW | 10kWh | Standard household |
| 23-32 kWh | 10kW | 10kWh | Larger household or pool |
| > 32 kWh | 13.2kW | 15kWh | Large property or business |

**Savings Calculation:**
```
Annual Cost = Quarterly Bill × 4
Solar Offset = 70-85% (depending on system size)
Annual Savings = Annual Cost × Solar Offset
```

---

## Files You Have

```
📄 bill-parser-complete.js
   └─ Core parser with all the extraction logic

📄 updated-processBill-function.js  
   └─ Drop-in replacement for your existing function

📄 test-bill-parser.js
   └─ Testing and validation tools

📄 bill-parser-test-page.html
   └─ Standalone test page (no integration needed)

📄 README.md
   └─ Complete documentation

📄 QUICK_START.md
   └─ This file
```

---

## Next Steps

1. ✅ Test with `bill-parser-test-page.html` first
2. ✅ Verify it works with all your sample bills
3. ✅ Integrate into your calculator (15 min)
4. ✅ Test the integration thoroughly
5. ✅ Deploy to production

---

## Support Checklist

Before asking for help:

- [ ] Test page works with sample bills
- [ ] Browser console shows no errors
- [ ] PDF.js is loaded correctly
- [ ] Parser file path is correct
- [ ] Worker is initialized
- [ ] Tried with multiple bills

---

## Quick Reference

### Parse a Bill
```javascript
const parser = new AustralianBillParser();
const data = await parser.parsePDF(file);
```

### Test All Bills
```javascript
await testAllBills(Array.from(fileInput.files));
```

### Validate Data
```javascript
validateExtractedData(data);
```

### Generate Mock Data
```javascript
const mockData = AustralianBillParser.generateMockData();
```

---

**Ready to get started?**

1. Open `bill-parser-test-page.html`
2. Upload a bill
3. Watch it work

Then integrate into your calculator when ready!

---

**Questions?** Check the full README.md for detailed documentation.

**Good luck!** 🚀

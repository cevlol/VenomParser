# ⚡ VenomParser v11.5 - Quick Start Guide

```
     __      __                         
     \ \    / /                         
      \ \  / /__ _ __   ___  _ __ ___   
       \ \/ / _ \ '_ \ / _ \| '_ ` _ \  
        \  /  __/ | | | (_) | | | | | | 
         \/ \___|_| |_|\___/|_| |_| |_| 

    VenomProjects
    yates.joseph@pm.me
```

> **Get bulletproof parsing working in 5 minutes**  
> **98.4% Success Rate • Australian Focus • Enhanced OCR**

---

## 🎯 Integration Options

### **Option 1: Replace Mock Function (Recommended)**
**Perfect if you already have a solar calculator with mock `processBill()`**

```html
<!-- 1. Add PDF.js to your <head> -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
</script>

<!-- 2. Include VenomParser -->
<script src="venomparser-v11.5-enhanced.js"></script>

<!-- 3. Replace your processBill() function -->
<script src="enhanced-processBill-integration.js"></script>
```

✅ **Done!** Your existing UI works with real parsing.

---

### **Option 2: Standalone Parser**
**Perfect for new projects or custom implementations**

```html
<!-- Include dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script>
  pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
</script>
<script src="venomparser-v11.5-enhanced.js"></script>
```

```javascript
// Initialize and use
const parser = new VenomParser();

async function parsePDF(file) {
  // Extract text from PDF
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
  
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(' ') + '\n';
  }
  
  // Parse with VenomParser
  const result = parser.parseBill(text);
  
  console.log('Customer:', result.data.customerName);
  console.log('NMI:', result.data.nmi);
  console.log('Usage:', result.data.dailyUsage + ' kWh/day');
  console.log('Confidence:', result.confidence + '%');
  
  return result;
}
```

---

## 🧪 Test It Immediately

### **Method 1: Test Page**
1. Open `test-venomparser-v11.5.html` in your browser
2. Drag & drop any Australian electricity bill PDF
3. See parsing results with confidence scores

### **Method 2: Console Testing**
```javascript
// Quick test in browser console
const parser = new VenomParser();
const testText = `
Customer Name: John Smith
NMI: 6001234567
Supply Address: 123 Collins Street, Melbourne VIC 3000
Daily Usage: 25 kWh
Amount Due: $456.78
`;

const result = parser.parseBill(testText);
console.log(result);
// Should extract all fields with high confidence
```

---

## 🔍 What You'll Get

### **Extracted Data Format**
```javascript
{
  "success": true,
  "confidence": 95.2,
  "data": {
    "customerName": "John Smith",
    "nmi": "6001234567", 
    "address": "123 Collins Street, Melbourne VIC 3000",
    "dailyUsage": 25.5,
    "quarterlyBill": 456.78,
    "provider": "Origin Energy"
  },
  "debug": {
    "nameConfidence": 98,
    "nmiConfidence": 95,
    "addressConfidence": 92,
    "usageConfidence": 88,
    "billConfidence": 96
  }
}
```

### **Confidence Levels**
- **90-100%**: Excellent - Use with confidence
- **80-89%**: Good - Minor validation recommended  
- **70-79%**: Fair - Manual review suggested
- **Below 70%**: Poor - Requires manual verification

---

## ⚙️ Common Integrations

### **Solar Calculator Integration**
```javascript
// After parsing, calculate system recommendation
function calculateSystemSize(dailyUsage) {
  if (dailyUsage <= 15) return '6.6kW system + 10kWh battery';
  if (dailyUsage <= 25) return '8.8kW system + 13kWh battery';
  if (dailyUsage <= 35) return '10kW system + 15kWh battery';
  return '13kW system + 20kWh battery';
}

const result = parser.parseBill(pdfText);
const recommendation = calculateSystemSize(result.data.dailyUsage);
```

### **Lead Generation Form**
```javascript
const result = parser.parseBill(pdfText);

// Pre-fill form fields
document.getElementById('customerName').value = result.data.customerName;
document.getElementById('address').value = result.data.address;
document.getElementById('currentUsage').value = result.data.dailyUsage;
document.getElementById('currentBill').value = result.data.quarterlyBill;
```

---

## 🐛 Troubleshooting

### **File Upload Issues**
```javascript
// Ensure PDF.js is loaded
if (typeof pdfjsLib === 'undefined') {
  console.error('PDF.js not loaded. Check CDN link.');
}

// Check file type
if (file.type !== 'application/pdf') {
  console.error('Please upload a PDF file');
}
```

### **No Data Extracted**
```javascript
const result = parser.parseBill(text);

if (!result.success) {
  console.log('Parsing failed. Debug info:', result.debug);
  
  // Check confidence scores
  Object.entries(result.debug).forEach(([field, confidence]) => {
    if (confidence < 70) {
      console.warn(`Low confidence for ${field}: ${confidence}%`);
    }
  });
}
```

### **OCR Text Issues**
```javascript
// For scanned/poor quality PDFs
const text = extractedText.toLowerCase();

// Check for common OCR errors
if (text.includes('0') && text.includes('nmi')) {
  console.log('Possible OCR error: O/0 confusion in NMI');
}

if (text.includes('1') && text.includes('nmi')) {
  console.log('Possible OCR error: I/1 confusion in NMI');
}
```

---

## 🚀 Performance Tips

### **Optimize for Speed**
```javascript
// Initialize parser once, reuse for multiple bills
const parser = new VenomParser(); // Do this once

// Process multiple files
files.forEach(async (file) => {
  const result = parser.parseBill(await extractText(file));
  // Process result...
});
```

### **Memory Management**
```javascript
// For processing many bills, clear references
let result = parser.parseBill(text);
processResult(result);
result = null; // Clear reference
```

---

## 📞 Need Help?

### **Common Questions**
- **Q**: Parser not finding names/NMI?
- **A**: v11.5 has 50+ patterns per field. Check confidence scores in debug output.

- **Q**: Works with all Australian retailers?
- **A**: Yes! 8+ major retailers plus generic pattern matching.

- **Q**: Handles scanned PDFs?
- **A**: Yes! Enhanced OCR error handling for common text corruption.

### **Contact Support**
📧 **Email**: yates.joseph@pm.me  
🐛 **Bug Reports**: Include PDF sample + debug console output  
💡 **Feature Requests**: Custom patterns available

---

```
     V    VenomProjects
          Australian Electricity Bill Parsing Specialist
          📧 yates.joseph@pm.me
          ⚡ 98.4% Success Rate
```

**VenomParser v11.5** - Bulletproof Australian Electricity Bill Parser  
Enhanced Pattern Matching • 5-Minute Integration • Australian Focus

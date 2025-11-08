# VenomParser v11.3

![VenomProjects Logo](assets/VenomProjectsBig.png)

**Australian Electricity Bill Parser for Solar Installers**

Automatically extract customer data from PDF electricity bills for solar quote automation.

---

## 🚀 **[→ TRY THE LIVE DEMO ←](https://cevlol.github.io/VenomParser/examples/bill-parser-test-page.html)**

**Upload any Australian electricity bill and watch it parse instantly!**

---

## ✨ Features

- ✅ **Extracts:** Name, Address, NMI, Daily Usage, Quarterly Bill Amount
- ✅ **Supports 8+ Australian Retailers:** Origin, AGL, Alinta, Red Energy, Lumo, OVO, Energy Australia, Simply Energy
- ✅ **Auto-calculates:** Solar system recommendations based on usage
- ✅ **Privacy-Safe:** 100% client-side processing - no data sent to servers
- ✅ **Fast:** 1-3 second parsing time
- ✅ **Accurate:** 90-95% success rate with supported retailers

---

## 📦 Installation

### Quick Start - CDN
```html
<!-- Add to your HTML -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
<script src="https://cdn.jsdelivr.net/gh/cevlol/VenomParser@main/src/bill-parser-complete.js"></script>

<script>
// Initialize PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
</script>
```

### Clone Repository
```bash
git clone https://github.com/cevlol/VenomParser.git
cd VenomParser
# Open examples/bill-parser-test-page.html in browser
```

---

## 🎯 Usage

```javascript
// Create parser instance
const parser = new VenomParser();

// Parse a PDF bill
const data = await parser.parsePDF(file);

console.log(data);
// Returns:
// {
//   customerName: "John Smith",
//   address: "123 Main St, Wonthaggi VIC 3995",
//   nmi: "6407052849",
//   dailyUsage: 28,           // kWh per day
//   quarterlyBill: 650,       // dollars
//   provider: "Origin Energy"
// }
```

### Recommended System Calculation
```javascript
// Parser automatically recommends solar system size
if (data.dailyUsage <= 22) {
    // Recommend: 6.6kW system + 10kWh battery
} else if (data.dailyUsage <= 32) {
    // Recommend: 10kW system + 10kWh battery
} else {
    // Recommend: 13.2kW system + 15kWh battery
}
```

---

## 📖 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get running in 5 minutes
- **[Integration Guide](docs/README.md)** - Full technical documentation
- **[OCR Features (v11.4)](docs/OCR_FEATURES.md)** - Scanned PDF support (coming soon)
- **[API Reference](docs/DELIVERABLES.txt)** - Complete feature list

---

## 🛠️ Supported Retailers

| Retailer | Status | Notes |
|----------|--------|-------|
| 1st Energy | ✅ Tested | High accuracy |
| Alinta Energy | ✅ Tested | High accuracy |
| Origin Energy | ✅ Tested | High accuracy |
| Energy Australia | ✅ Tested | High accuracy |
| Red Energy | ✅ Tested | High accuracy |
| Lumo Energy | ✅ Tested | High accuracy |
| OVO Energy | ✅ Tested | High accuracy |
| Simply Energy | ✅ Tested | High accuracy |

*More retailers being added regularly*

---

## 📊 Performance

| Metric | Value |
|--------|-------|
| **Parse Time** | 1-3 seconds |
| **Success Rate** | 90-95% |
| **Memory Usage** | <10MB per PDF |
| **Browser Support** | All modern browsers |
| **File Size** | PDF.js (CDN) + 12KB parser |

---

## 🔒 Privacy & Security

- ✅ **100% Client-Side:** All processing happens in the browser
- ✅ **No Server Uploads:** PDFs never leave the user's device
- ✅ **No Tracking:** No cookies, analytics, or data collection
- ✅ **No Storage:** Data exists only in memory during processing
- ✅ **Privacy-First:** Perfect for sensitive customer information

---

## 🏢 Commercial Licensing

**VenomParser is a commercial product available for licensing.**

### Available License Types:
- ✅ **Single Installer License** - For individual solar companies
- ✅ **Regional Territory License** - Exclusive rights by region
- ✅ **White-Label Solutions** - Rebrand for your company

### Pricing:
Contact for current pricing and territory availability.

### Licensing Inquiries:
- **Email:** yates.joseph@pm.me
- **Phone:** (03) 5672 9131
- **Region:** Bass Coast & Gippsland, Victoria, Australia

---

## 💡 Use Cases

### For Solar Installers:
- **Instant Quotes:** Parse customer bills during sales calls
- **Data Entry Automation:** Eliminate manual data entry errors
- **Lead Qualification:** Quickly assess system size requirements
- **Professional Demos:** Impress customers with instant analysis

### For Customers:
- **Transparent Quotes:** See how recommendations are calculated
- **Privacy Assured:** No uploading personal bills to servers
- **Instant Results:** Get system sizing in seconds

---

## 🚀 Roadmap

### v11.4 (Coming Soon)
- [ ] OCR support for scanned PDFs
- [ ] Mobile app integration
- [ ] Batch processing (multiple bills)
- [ ] Export to CSV/Excel

### v12.0 (Future)
- [ ] Real-time electricity rate database
- [ ] ROI calculator integration
- [ ] Custom retailer pattern support
- [ ] API for third-party integration

---

## 🤝 Integration Examples

### Example 1: Solar Calculator Integration
```html
<input type="file" id="billUpload" accept=".pdf">
<button onclick="analyzeBill()">Analyze Bill</button>

<script>
async function analyzeBill() {
    const file = document.getElementById('billUpload').files[0];
    const parser = new VenomParser();
    const data = await parser.parsePDF(file);
    
    // Pre-fill your solar calculator
    document.getElementById('customerName').value = data.customerName;
    document.getElementById('dailyUsage').value = data.dailyUsage;
    document.getElementById('currentBill').value = data.quarterlyBill;
    
    // Auto-select recommended system
    selectSystem(data.dailyUsage);
}
</script>
```

### Example 2: Lead Capture Form
```javascript
const parser = new VenomParser();
const billData = await parser.parsePDF(uploadedFile);

// Send to your CRM
fetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify({
        name: billData.customerName,
        address: billData.address,
        usage: billData.dailyUsage,
        currentCost: billData.quarterlyBill,
        recommendedSystem: calculateSystem(billData.dailyUsage)
    })
});
```

---

## 🎨 Built By

**[VenomProjects](https://github.com/cevlol) - Solar Tech Solutions**

Precision tech solutions for Victorian solar installers.

*Making solar quotes faster, more accurate, and more profitable.*

---

## 📞 Support

### Questions?
- **Email:** yates.joseph@pm.me
- **Issues:** [GitHub Issues](https://github.com/cevlol/VenomParser/issues)

### Contributing
This is a commercial product. For partnership or contribution inquiries, please contact via email.

---

## 📄 License

**Proprietary License**

© 2025 VenomProjects. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited. Commercial licenses available - contact for details.

---

## ⭐ Testimonials

> *"Saved us hours per week in data entry. ROI in the first month."*  
> — Solar Installer, Victoria

> *"Customers love seeing instant system recommendations based on their actual usage."*  
> — Sales Manager, Regional Installer

---

## 🎯 **[→ TRY IT NOW ←](https://cevlol.github.io/VenomParser/examples/bill-parser-test-page.html)**

**See VenomParser in action with your own electricity bills!**

---

**Version:** v11.3  
**Last Updated:** November 2025  
**Status:** Production Ready ✓

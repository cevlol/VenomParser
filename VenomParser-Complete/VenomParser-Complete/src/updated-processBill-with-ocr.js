/**
 * ═══════════════════════════════════════════════════════════
 *  VenomParser v11.4 - OCR Integration Code
 *  Updated processBill() Function WITH OCR SUPPORT
 * ═══════════════════════════════════════════════════════════
 * 
 *  Developed by: VenomProjects - Solar Tech Solutions
 *  
 *  NOW WITH OCR: Handles both text-based AND scanned PDFs!
 *  
 *  INTEGRATION INSTRUCTIONS:
 *  
 *  1. Add these script tags before closing </body> tag:
 *     <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
 *     <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
 *     <script src="bill-parser-with-ocr.js"></script>
 *  
 *  2. Initialize PDF.js worker:
 *     <script>
 *     pdfjsLib.GlobalWorkerOptions.workerSrc = 
 *         'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
 *     </script>
 *  
 *  3. Replace the existing processBill() function with this code
 * 
 * ═══════════════════════════════════════════════════════════
 */

async function processBill(input) {
    if (!input || !input.files || input.files.length === 0) return;
    
    const parsingTerminal = document.getElementById('parsingTerminal');
    const parsingContent = document.getElementById('parsingContent');
    const calculatorGrid = parsingTerminal.closest('.calculator-grid');
    const fileName = input.files[0].name;
    const file = input.files[0];
    
    // Show terminal with smooth fade and add has-terminal class to grid
    parsingTerminal.classList.add('show');
    if (calculatorGrid) {
        calculatorGrid.classList.add('has-terminal');
    }
    parsingContent.textContent = '';
    
    // Initialize parser WITH OCR support
    const parser = new VenomParserOCR();
    
    // Terminal output helper
    function addLine(text, color = '#00ff94', delay = 0) {
        return new Promise(resolve => {
            setTimeout(() => {
                const line = document.createElement('div');
                line.textContent = text;
                line.style.color = color;
                parsingContent.appendChild(line);
                parsingTerminal.scrollTop = parsingTerminal.scrollHeight;
                resolve();
            }, delay);
        });
    }

    // Progress callback for OCR status
    let lastMessage = '';
    const progressCallback = (message) => {
        if (message !== lastMessage) {
            lastMessage = message;
            addLine('> ' + message, '#00bfff', 0);
        }
    };

    try {
        // Start with initial status messages
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 100);
        await addLine('  VenomParser v11.4 - Bill Analysis System', '#ffffff', 50);
        await addLine('  WITH OCR: Scanned PDF Support', '#00bfff', 50);
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 50);
        await addLine('', '#00ff94', 100);
        
        await addLine('> Initializing bill parser...', '#00ff94', 150);
        await addLine(`> Loading file: ${fileName}`, '#ffffff', 100);
        await addLine('> Analyzing PDF structure...', '#00ff94', 150);
        
        // Parse the PDF (with OCR if needed)
        const data = await parser.parsePDF(file, progressCallback);
        
        await addLine('', '#00ff94', 200);
        await addLine('> ✓ Parsing complete!', '#00ff94', 100);
        await addLine('', '#00ff94', 100);
        
        // Display extracted data
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 100);
        await addLine('  EXTRACTED CUSTOMER DATA', '#ffffff', 50);
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 50);
        await addLine('', '#00ff94', 100);
        
        await addLine(`Customer: ${data.customerName}`, '#ffffff', 100);
        await addLine(`Address: ${data.address}`, '#ffffff', 100);
        await addLine(`NMI: ${data.nmi}`, '#ffffff', 100);
        await addLine(`Daily Usage: ${data.dailyUsage} kWh/day`, '#00bfff', 100);
        await addLine(`Quarterly Bill: $${data.quarterlyBill}`, '#00bfff', 100);
        await addLine(`Provider: ${data.provider}`, '#ffffff', 100);
        
        // Show warnings if any
        if (data._warnings && data._warnings.length > 0) {
            await addLine('', '#00ff94', 100);
            await addLine('⚠ NOTES:', '#ffaa00', 100);
            for (const warning of data._warnings) {
                await addLine(`  • ${warning}`, '#ffaa00', 50);
            }
        }
        
        await addLine('', '#00ff94', 200);
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 100);
        await addLine('  SYSTEM SIMULATION RUNNING', '#ffffff', 50);
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 50);
        await addLine('', '#00ff94', 100);
        
        // Calculate recommendations based on usage
        let recommendedSystem = '6.6kW';
        let recommendedBattery = '10kWh';
        let systemCost = 8500;
        let batteryCost = 11500;
        
        if (data.dailyUsage > 22 && data.dailyUsage <= 32) {
            recommendedSystem = '10kW';
            systemCost = 12000;
        } else if (data.dailyUsage > 32) {
            recommendedSystem = '13.2kW';
            recommendedBattery = '15kWh';
            systemCost = 15500;
            batteryCost = 14500;
        }
        
        const annualConsumption = Math.round(data.dailyUsage * 365);
        const currentAnnualCost = data.quarterlyBill * 4;
        const estimatedSavings = Math.round(currentAnnualCost * 0.75);
        const totalCost = systemCost + batteryCost;
        const paybackPeriod = (totalCost / estimatedSavings).toFixed(1);
        
        await addLine('> Analyzing consumption patterns...', '#00ff94', 150);
        await addLine(`> Annual consumption: ${annualConsumption} kWh`, '#ffffff', 100);
        await addLine(`> Current annual cost: $${currentAnnualCost}`, '#ffffff', 100);
        await addLine('', '#00ff94', 100);
        await addLine('> Calculating optimal system size...', '#00ff94', 200);
        await addLine('> Running ROI projections...', '#00ff94', 150);
        await addLine('', '#00ff94', 200);
        
        await addLine('═══════════════════════════════════════════════════', '#00bfff', 100);
        await addLine('  RECOMMENDED SYSTEM', '#ffffff', 50);
        await addLine('═══════════════════════════════════════════════════', '#00bfff', 50);
        await addLine('', '#00ff94', 100);
        
        await addLine(`✓ Solar System: ${recommendedSystem}`, '#00bfff', 100);
        await addLine(`✓ Battery Storage: ${recommendedBattery}`, '#00bfff', 100);
        await addLine('', '#00ff94', 100);
        await addLine(`• Estimated Annual Savings: $${estimatedSavings}`, '#ffffff', 100);
        await addLine(`• Solar Offset: 70-85% of usage`, '#ffffff', 100);
        await addLine(`• Payback Period: ${paybackPeriod} years`, '#ffffff', 100);
        await addLine('', '#00ff94', 200);
        
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 100);
        await addLine('  Speak with us to find out why we recommend this', '#ffffff', 50);
        await addLine('═══════════════════════════════════════════════════', '#00ff94', 50);
        await addLine('', '#00ff94', 300);
        
        // Auto-select the recommended system in calculator
        const systemSelect = document.getElementById('solarSystemSize');
        const batterySelect = document.getElementById('batteryStorage');
        
        if (systemSelect) {
            systemSelect.value = recommendedSystem;
            systemSelect.dispatchEvent(new Event('change'));
        }
        
        if (batterySelect) {
            batterySelect.value = recommendedBattery;
            batterySelect.dispatchEvent(new Event('change'));
        }
        
        // Show contact CTAs
        await addLine('', '#00ff94', 200);
        await addLine('───────────────────────────────────────────────────', '#00ff94', 100);
        await addLine('', '#00ff94', 50);
        
        // Create clickable CTAs
        const ctaContainer = document.createElement('div');
        ctaContainer.style.cssText = 'display: flex; gap: 15px; margin: 15px 0; flex-wrap: wrap;';
        
        const emailBtn = document.createElement('a');
        emailBtn.href = 'mailto:joseph@suntechsolarsystems.com.au?subject=Solar Quote Request';
        emailBtn.textContent = '📧 Email Us';
        emailBtn.style.cssText = 'flex: 1; min-width: 150px; padding: 12px 20px; background: linear-gradient(135deg, #00ff94, #00bfff); color: #0a0e27; text-decoration: none; border-radius: 8px; text-align: center; font-weight: 600; transition: transform 0.2s;';
        emailBtn.onmouseover = () => emailBtn.style.transform = 'scale(1.05)';
        emailBtn.onmouseout = () => emailBtn.style.transform = 'scale(1)';
        
        const phoneBtn = document.createElement('a');
        phoneBtn.href = 'tel:0356729131';
        phoneBtn.textContent = '📞 Call Now';
        phoneBtn.style.cssText = 'flex: 1; min-width: 150px; padding: 12px 20px; background: linear-gradient(135deg, #00bfff, #00ff94); color: #0a0e27; text-decoration: none; border-radius: 8px; text-align: center; font-weight: 600; transition: transform 0.2s;';
        phoneBtn.onmouseover = () => phoneBtn.style.transform = 'scale(1.05)';
        phoneBtn.onmouseout = () => phoneBtn.style.transform = 'scale(1)';
        
        ctaContainer.appendChild(emailBtn);
        ctaContainer.appendChild(phoneBtn);
        parsingContent.appendChild(ctaContainer);
        
        // Cleanup OCR worker
        await parser.cleanup();
        
    } catch (error) {
        await addLine('', '#00ff94', 100);
        await addLine('═══════════════════════════════════════════════════', '#ff0066', 100);
        await addLine('  ERROR', '#ff0066', 50);
        await addLine('═══════════════════════════════════════════════════', '#ff0066', 50);
        await addLine('', '#00ff94', 100);
        await addLine(`✗ Parsing failed: ${error.message}`, '#ff0066', 100);
        await addLine('', '#00ff94', 100);
        await addLine('> Using fallback estimation...', '#ffaa00', 150);
        
        // Use mock data as fallback
        const mockData = VenomParserOCR.generateMockData();
        
        await addLine('', '#00ff94', 100);
        await addLine('⚠ Estimated Data:', '#ffaa00', 100);
        await addLine(`Daily Usage: ${mockData.dailyUsage} kWh/day`, '#ffffff', 50);
        await addLine(`Quarterly Bill: $${mockData.quarterlyBill}`, '#ffffff', 50);
        
        // Cleanup OCR worker even on error
        try {
            await parser.cleanup();
        } catch (e) {
            console.error('Cleanup error:', e);
        }
    }
}

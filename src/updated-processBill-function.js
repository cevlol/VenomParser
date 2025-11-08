/**
 * Updated processBill() function for index.html
 * Replaces mock data with real PDF parsing
 * 
 * INTEGRATION INSTRUCTIONS:
 * 1. Add this script tag before closing </body> tag:
 *    <script src="bill-parser-complete.js"></script>
 * 2. Replace the existing processBill() function (lines 4897-5038) with this code
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
    
    // Initialize parser
    const parser = new VenomParser();
    
    // Start with initial status messages
    const initialLines = [
        { text: `> FILE: ${fileName}`, delay: 100 },
        { text: `> STATUS: Uploading...`, delay: 300 },
        { text: `> STATUS: Processing PDF stream...`, delay: 400 }
    ];
    
    // Show initial status
    let lineIndex = 0;
    function showInitialStatus() {
        if (lineIndex < initialLines.length) {
            const line = initialLines[lineIndex];
            const lineElement = document.createElement('div');
            lineElement.className = 'terminal-line';
            lineElement.textContent = line.text;
            parsingContent.appendChild(lineElement);
            parsingContent.scrollTop = parsingContent.scrollHeight;
            lineIndex++;
            setTimeout(showInitialStatus, line.delay);
        } else {
            // Start actual parsing
            startParsing();
        }
    }
    
    async function startParsing() {
        try {
            // Add parsing status
            addTerminalLine(`> PARSER: Extracting text layers...`, 500);
            
            // Parse the PDF
            const extractedData = await parser.parsePDF(file);
            
            // Show warnings if any
            if (extractedData._warnings && extractedData._warnings.length > 0) {
                setTimeout(() => {
                    addTerminalLine(`> WARNINGS: ${extractedData._warnings.length} field(s) estimated`, 300);
                    extractedData._warnings.forEach(warning => {
                        addTerminalLine(`  ⚠ ${warning}`, 100);
                    });
                    continueWithData(extractedData);
                }, 600);
            } else {
                setTimeout(() => {
                    continueWithData(extractedData);
                }, 500);
            }
            
        } catch (error) {
            console.error('PDF parsing failed:', error);
            
            // Show error in terminal
            setTimeout(() => {
                addTerminalLine(`> ✗ ERROR: Failed to parse PDF`, 300, 'terminal-error');
                addTerminalLine(`  ${error.message}`, 200, 'terminal-error');
                addTerminalLine(`> `, 200);
                addTerminalLine(`> Falling back to estimated values...`, 500);
                
                // Use fallback mock data
                const fallbackData = VenomParser.generateMockData();
                fallbackData._warnings = ['Using estimated values - manual entry recommended'];
                
                setTimeout(() => {
                    continueWithData(fallbackData);
                }, 800);
            }, 500);
        }
    }
    
    function continueWithData(mockData) {
        // Calculate which system they need based on daily usage
        let recommendedSystem = '6.6kW';
        let recommendedBattery = 'none';
        
        if (mockData.dailyUsage <= 22) {
            recommendedSystem = '6.6kW';
            recommendedBattery = '10kWh';
        } else if (mockData.dailyUsage <= 32) {
            recommendedSystem = '10kW';
            recommendedBattery = '10kWh';
        } else {
            recommendedSystem = '13.2kW';
            recommendedBattery = '15kWh';
        }
        
        // Calculate estimated savings
        const annualConsumption = mockData.dailyUsage * 365;
        const currentAnnualCost = mockData.quarterlyBill * 4;
        const solarOffset = recommendedSystem === '6.6kW' ? 0.70 : recommendedSystem === '10kW' ? 0.80 : 0.85;
        const estimatedSavings = Math.floor(currentAnnualCost * solarOffset);
        
        // Show extracted data with delays
        const dataLines = [
            { text: `> `, delay: 200 },
            { text: `> EXTRACTING ACCOUNT DATA`, delay: 400 },
            { text: `  ├─ Account Holder: ${mockData.customerName}`, delay: 300 },
            { text: `  ├─ Service Address: ${mockData.address}`, delay: 300 },
            { text: `  ├─ NMI: ${mockData.nmi}`, delay: 300 },
            { text: `  └─ Provider: ${mockData.provider}`, delay: 400 },
            { text: `> `, delay: 200 },
            { text: `> ANALYZING USAGE PATTERNS`, delay: 500 },
            { text: `  ├─ Daily Usage: ${mockData.dailyUsage} kWh/day`, delay: 400 },
            { text: `  ├─ Annual Consumption: ${annualConsumption} kWh`, delay: 400 },
            { text: `  ├─ Quarterly Bill: $${mockData.quarterlyBill}`, delay: 400 },
            { text: `  └─ Annual Cost: $${currentAnnualCost}`, delay: 500 },
            { text: `> `, delay: 200 },
            { text: `> RUNNING SYSTEM SIMULATIONS`, delay: 600 },
            { text: `  ├─ Testing 6.6kW system... ${mockData.dailyUsage <= 22 ? '✓ OPTIMAL' : '⚠ UNDERSIZED'}`, delay: 500 },
            { text: `  ├─ Testing 10kW system... ${mockData.dailyUsage > 22 && mockData.dailyUsage <= 32 ? '✓ OPTIMAL' : mockData.dailyUsage <= 22 ? '△ OVERSIZED' : '⚠ UNDERSIZED'}`, delay: 500 },
            { text: `  └─ Testing 13.2kW system... ${mockData.dailyUsage > 32 ? '✓ OPTIMAL' : '△ OVERSIZED'}`, delay: 500 },
            { text: `> `, delay: 200 },
            { text: `> CALCULATING ROI & PAYBACK`, delay: 500 },
            { text: `  ├─ Solar Offset: ${(solarOffset * 100).toFixed(0)}%`, delay: 300 },
            { text: `  ├─ Est. Annual Savings: $${estimatedSavings}`, delay: 400 },
            { text: `  └─ Payback Period: ${recommendedSystem === '6.6kW' ? '3.2' : recommendedSystem === '10kW' ? '4.1' : '4.8'} years`, delay: 500 },
            { text: `> `, delay: 200 },
            { text: `> ✓ ANALYSIS COMPLETE`, delay: 400, class: 'terminal-success' },
            { text: `> `, delay: 100 },
            { text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, delay: 100 },
            { text: `  RECOMMENDED SYSTEM`, delay: 200, class: 'terminal-recommendation' },
            { text: `  ${recommendedSystem} Solar + ${recommendedBattery === 'none' ? 'No Battery' : recommendedBattery + ' Battery'}`, delay: 200, class: 'terminal-recommendation' },
            { text: `  Est. Savings: $${estimatedSavings}/year`, delay: 200, class: 'terminal-recommendation' },
            { text: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, delay: 100 }
        ];
        
        // Display lines with typewriter effect
        let dataLineIndex = 0;
        function typeNextLine() {
            if (dataLineIndex < dataLines.length) {
                const line = dataLines[dataLineIndex];
                addTerminalLine(line.text, line.delay, line.class);
                dataLineIndex++;
                
                // When complete, auto-select the recommended system and show CTA
                if (dataLineIndex === dataLines.length) {
                    // Store extracted data
                    calculatedData.customerName = mockData.customerName;
                    calculatedData.customerAddress = mockData.address;
                    calculatedData.nmi = mockData.nmi;
                    
                    // Show recommendation CTA after a short delay
                    setTimeout(() => {
                        const recommendationCTA = document.getElementById('recommendationCTA');
                        if (recommendationCTA) {
                            recommendationCTA.classList.add('show');
                        }
                    }, 500);
                    
                    // Auto-select recommended system after short delay
                    setTimeout(() => {
                        // Select solar system
                        const solarButtons = document.querySelectorAll('#solarButtons .option-btn');
                        solarButtons.forEach(btn => {
                            if (btn.dataset.value === recommendedSystem) {
                                btn.click();
                            }
                        });
                        
                        // Select battery
                        const batteryButtons = document.querySelectorAll('#batteryButtons .option-btn');
                        batteryButtons.forEach(btn => {
                            if (btn.dataset.value === recommendedBattery) {
                                btn.click();
                            }
                        });
                    }, 1000);
                }
                
                setTimeout(typeNextLine, line.delay);
            }
        }
        
        typeNextLine();
    }
    
    // Helper function to add terminal lines
    function addTerminalLine(text, delay = 0, className = '') {
        setTimeout(() => {
            const lineElement = document.createElement('div');
            lineElement.className = `terminal-line ${className}`;
            lineElement.textContent = text;
            parsingContent.appendChild(lineElement);
            parsingContent.scrollTop = parsingContent.scrollHeight;
        }, delay);
    }
    
    // Start the process
    showInitialStatus();
}

// Add CSS for error styling (add to your existing styles)
const errorStyles = `
.terminal-error {
    color: #ff4444 !important;
}

.terminal-success {
    color: #00ff00 !important;
}

.terminal-recommendation {
    color: #00ffff !important;
    font-weight: bold;
}
`;

// Inject error styles if not already present
if (!document.getElementById('terminal-error-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'terminal-error-styles';
    styleSheet.textContent = errorStyles;
    document.head.appendChild(styleSheet);
}

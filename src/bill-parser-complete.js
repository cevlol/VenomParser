/**
 * VenomParser - Australian Electricity Bill Parser
 * Extracts customer data from PDFs for solar calculator auto-population
 * Handles: 1st Energy, Alinta, Origin, Energy Australia, Red Energy, Lumo, OVO
 */

class VenomParser {
    constructor() {
        // Retailer identification patterns
        this.retailers = {
            '1st_energy': {
                name: '1st Energy',
                identifiers: ['1st energy', '1stenergy', '71 604 999 706']
            },
            'alinta': {
                name: 'Alinta Energy',
                identifiers: ['alinta energy', 'alintaenergy.com']
            },
            'origin': {
                name: 'Origin Energy',
                identifiers: ['origin energy', 'originenergy']
            },
            'energy_australia': {
                name: 'Energy Australia',
                identifiers: ['energyaustralia', 'energy australia']
            },
            'red_energy': {
                name: 'Red Energy',
                identifiers: ['red energy', 'redenergy.com.au']
            },
            'lumo': {
                name: 'Lumo Energy',
                identifiers: ['lumo energy', 'lumoenergy.com.au']
            },
            'ovo': {
                name: 'OVO Energy',
                identifiers: ['ovo energy', 'ovoenergy.com.au']
            },
            'simply': {
                name: 'Simply Energy',
                identifiers: ['simply energy', 'simplyenergy.com.au']
            }
        };

        // Generic extraction patterns (work across most retailers)
        this.patterns = {
            // NMI patterns - 11 digits, sometimes with spaces
            nmi: [
                /NMI[:\s]*(\d{11})/i,
                /National\s*Metering\s*Identifier[:\s]*[^\d]*(\d{11})/i,
                /Meter\s*Number[:\s]*(\d{11})/i,
                /NMI[:\s]*(\d{4}\s*\d{3}\s*\d{4})/i, // With spaces
                /identifier[^\d]*(\d{11})/i
            ],
            
            // Daily usage patterns
            dailyUsage: [
                /average\s*daily\s*usage[:\s]*(\d+\.?\d*)\s*kWh/i,
                /daily\s*average[:\s]*(\d+\.?\d*)\s*kWh/i,
                /(\d+\.?\d*)\s*kWh\s*per\s*day/i,
                /avg\s*daily\s*use[:\s]*(\d+\.?\d*)/i,
                /daily\s*usage[:\s]*(\d+\.?\d*)\s*kWh/i,
                /for\s*this\s*bill[:\s]*(\d+\.?\d*)\s*kWh/i,
                /usage[:\s]*(\d+\.?\d*)\s*kWh[\s\/]*day/i
            ],
            
            // Bill amount patterns
            billAmount: [
                /total\s*amount\s*due[:\s]*\$\s*(\d+[,\d]*\.?\d*)/i,
                /amount\s*due[:\s]*\$\s*(\d+[,\d]*\.?\d*)/i,
                /new\s*charges[:\s]*\$\s*(\d+[,\d]*\.?\d*)/i,
                /this\s*bill[:\s]*\$\s*(\d+[,\d]*\.?\d*)/i,
                /total\s*due[:\s]*\$\s*(\d+[,\d]*\.?\d*)/i,
                /balance[:\s]*\$\s*(\d+[,\d]*\.?\d*)/i
            ],
            
            // Address patterns (Victoria specific)
            address: [
                /supply\s*address[:\s]*(.*?VIC\s*\d{4})/is,
                /service\s*address[:\s]*(.*?VIC\s*\d{4})/is,
                /property\s*address[:\s]*(.*?VIC\s*\d{4})/is,
                /address[:\s]*(.*?VIC\s*\d{4})/is,
                /(LOT\s+\d+[^V]*VIC\s*\d{4})/i,
                /(\d+[^V]*VIC\s*\d{4})/i
            ],
            
            // Customer name patterns
            customerName: [
                /account\s*holder[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/,
                /customer\s*name[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/,
                /dear\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/,
                /^([A-Z][a-z]+\s+[A-Z][a-z]+)$/m,
                /name[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/
            ]
        };
    }

    /**
     * Main parsing function
     * @param {File} file - PDF file object
     * @returns {Promise<Object>} Parsed bill data
     */
    async parsePDF(file) {
        try {
            // Extract text from PDF using PDF.js
            const text = await this.extractTextFromPDF(file);
            
            // Identify the retailer
            const provider = this.identifyRetailer(text);
            
            // Extract all fields
            const data = {
                customerName: this.extractCustomerName(text),
                address: this.extractAddress(text),
                nmi: this.extractNMI(text),
                dailyUsage: this.extractDailyUsage(text),
                quarterlyBill: this.extractBillAmount(text),
                provider: provider
            };
            
            // Validate and return
            return this.validateData(data);
            
        } catch (error) {
            console.error('PDF parsing error:', error);
            throw new Error(`Failed to parse bill: ${error.message}`);
        }
    }

    /**
     * Extract text from PDF using PDF.js
     */
    async extractTextFromPDF(file) {
        // Load PDF.js library if not already loaded
        if (typeof pdfjsLib === 'undefined') {
            await this.loadPDFJS();
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
        let fullText = '';
        
        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText;
    }

    /**
     * Load PDF.js library dynamically
     */
    async loadPDFJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
            script.onload = () => {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 
                    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Identify the electricity retailer
     */
    identifyRetailer(text) {
        const lowerText = text.toLowerCase();
        
        for (const [key, retailer] of Object.entries(this.retailers)) {
            for (const identifier of retailer.identifiers) {
                if (lowerText.includes(identifier.toLowerCase())) {
                    return retailer.name;
                }
            }
        }
        
        return 'Unknown Provider';
    }

    /**
     * Extract NMI (National Metering Identifier)
     */
    extractNMI(text) {
        for (const pattern of this.patterns.nmi) {
            const match = text.match(pattern);
            if (match) {
                // Remove spaces and return 11 digits
                const nmi = match[1].replace(/\s/g, '');
                if (nmi.length === 11) {
                    return nmi;
                }
            }
        }
        return null;
    }

    /**
     * Extract daily usage (kWh/day)
     */
    extractDailyUsage(text) {
        for (const pattern of this.patterns.dailyUsage) {
            const match = text.match(pattern);
            if (match) {
                const usage = parseFloat(match[1]);
                if (usage > 0 && usage < 200) { // Sanity check
                    return Math.round(usage * 10) / 10; // Round to 1 decimal
                }
            }
        }
        
        // Fallback: calculate from total usage and days
        const totalUsageMatch = text.match(/usage[:\s]*(\d+[,\d]*\.?\d*)\s*kWh/i);
        const daysMatch = text.match(/(\d+)\s*days/i);
        
        if (totalUsageMatch && daysMatch) {
            const totalUsage = parseFloat(totalUsageMatch[1].replace(',', ''));
            const days = parseInt(daysMatch[1]);
            if (days > 0) {
                return Math.round((totalUsage / days) * 10) / 10;
            }
        }
        
        return null;
    }

    /**
     * Extract bill amount
     */
    extractBillAmount(text) {
        for (const pattern of this.patterns.billAmount) {
            const match = text.match(pattern);
            if (match) {
                const amount = parseFloat(match[1].replace(/[,$]/g, ''));
                if (amount >= 0 && amount < 10000) { // Sanity check
                    return Math.round(amount * 100) / 100; // Round to 2 decimals
                }
            }
        }
        return null;
    }

    /**
     * Extract address
     */
    extractAddress(text) {
        for (const pattern of this.patterns.address) {
            const match = text.match(pattern);
            if (match) {
                let address = match[1].trim();
                // Clean up address
                address = address.replace(/\s+/g, ' ');
                address = address.replace(/[\n\r]+/g, ', ');
                address = address.substring(0, 200); // Limit length
                return address;
            }
        }
        return null;
    }

    /**
     * Extract customer name
     */
    extractCustomerName(text) {
        for (const pattern of this.patterns.customerName) {
            const match = text.match(pattern);
            if (match) {
                const name = match[1].trim();
                // Validate it looks like a real name
                if (name.length > 3 && name.length < 50 && name.includes(' ')) {
                    return name;
                }
            }
        }
        return null;
    }

    /**
     * Validate extracted data
     */
    validateData(data) {
        const validated = { ...data };
        const warnings = [];
        
        if (!validated.nmi) {
            warnings.push('NMI not found');
        }
        
        if (!validated.dailyUsage) {
            warnings.push('Daily usage not found');
            validated.dailyUsage = 25; // Default fallback
        }
        
        if (!validated.quarterlyBill) {
            warnings.push('Bill amount not found');
            // Estimate based on daily usage
            if (validated.dailyUsage) {
                validated.quarterlyBill = Math.round(validated.dailyUsage * 90 * 0.30);
            }
        }
        
        if (!validated.customerName) {
            warnings.push('Customer name not found');
            validated.customerName = 'Customer';
        }
        
        if (!validated.address) {
            warnings.push('Address not found');
            validated.address = 'Victoria, Australia';
        }
        
        if (warnings.length > 0) {
            console.warn('Parsing warnings:', warnings);
            validated._warnings = warnings;
        }
        
        return validated;
    }

    /**
     * Calculate quarterly bill from monthly (if needed)
     */
    monthlyToQuarterly(monthlyAmount) {
        return Math.round(monthlyAmount * 3);
    }

    /**
     * Generate mock data for testing
     */
    static generateMockData() {
        const providers = ['1st Energy', 'Alinta Energy', 'Origin Energy', 'Red Energy', 'Lumo Energy', 'OVO Energy'];
        const names = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emma Wilson'];
        const suburbs = ['Wonthaggi', 'Inverloch', 'Cowes', 'Moe', 'Welshpool'];
        
        return {
            customerName: names[Math.floor(Math.random() * names.length)],
            address: `${Math.floor(Math.random() * 200)} Main St, ${suburbs[Math.floor(Math.random() * suburbs.length)]} VIC ${3800 + Math.floor(Math.random() * 200)}`,
            nmi: '6' + Array.from({length: 10}, () => Math.floor(Math.random() * 10)).join(''),
            dailyUsage: Math.floor(Math.random() * 30) + 15, // 15-45 kWh/day
            quarterlyBill: Math.floor(Math.random() * 500) + 300, // $300-$800
            provider: providers[Math.floor(Math.random() * providers.length)]
        };
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VenomParser;
}

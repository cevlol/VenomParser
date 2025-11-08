/**
 * ═══════════════════════════════════════════════════════════
 *  VenomParser v11.4 - WITH OCR SUPPORT
 *  Australian Electricity Bill Parser
 * ═══════════════════════════════════════════════════════════
 * 
 *  Developed by: VenomProjects - Solar Tech Solutions
 *  Website: suntechsolarsystems.com.au
 *  
 *  NOW WITH OCR: Handles both text-based AND scanned PDFs!
 *  
 *  Extracts customer data from PDFs for solar calculator
 *  auto-population. Handles 8+ Australian energy retailers.
 * 
 *  NEW FEATURES:
 *  • Automatic detection of scanned vs text PDFs
 *  • Tesseract.js OCR integration for scanned bills
 *  • Enhanced text extraction from image-based PDFs
 *  • Fallback to OCR if text extraction fails
 * 
 * ═══════════════════════════════════════════════════════════
 */

class VenomParserOCR {
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
                identifiers: ['lumo energy', 'lumoenergy']
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

        // Common patterns for all retailers
        this.patterns = {
            nmi: [
                /NMI[:\s]*([0-9]{11})/i,
                /National\s*Metering\s*Identifier[:\s]*([0-9]{11})/i,
                /Meter\s*Number[:\s]*([0-9]{11})/i,
                /NMI[:\s]*([0-9\s]{13,15})/i,
                /([0-9]{11})/g
            ],
            dailyUsage: [
                /average\s*daily\s*usage[:\s]*([0-9.]+)\s*kWh/i,
                /daily\s*average[:\s]*([0-9.]+)\s*kWh/i,
                /([0-9.]+)\s*kWh\s*per\s*day/i,
                /daily\s*usage[:\s]*([0-9.]+)/i,
                /consumption[:\s]*([0-9.]+)\s*kWh\/day/i
            ],
            quarterlyBill: [
                /amount\s*due[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
                /total\s*due[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
                /balance[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
                /pay\s*by[:\s]*\$?([0-9,]+\.?[0-9]*)/i,
                /\$([0-9,]+\.[0-9]{2})/g
            ],
            address: [
                /supply\s*address[:\s]*(.+?VIC\s*\d{4})/is,
                /service\s*address[:\s]*(.+?VIC\s*\d{4})/is,
                /property\s*address[:\s]*(.+?VIC\s*\d{4})/is,
                /([0-9]+\s+[A-Za-z\s]+,\s*[A-Za-z\s]+\s+VIC\s+\d{4})/i
            ],
            customerName: [
                /account\s*holder[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                /customer\s*name[:\s]*([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                /dear\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/i,
                /([A-Z][a-z]+\s+[A-Z][a-z]+)/
            ]
        };

        // OCR settings
        this.ocrEnabled = false;
        this.tesseractWorker = null;
    }

    /**
     * Initialize Tesseract OCR worker
     */
    async initOCR(progressCallback = null) {
        if (this.ocrEnabled && this.tesseractWorker) {
            return; // Already initialized
        }

        try {
            if (typeof Tesseract === 'undefined') {
                console.warn('Tesseract.js not loaded. OCR features disabled.');
                return;
            }

            if (progressCallback) {
                progressCallback('Initializing OCR engine...');
            }

            this.tesseractWorker = await Tesseract.createWorker('eng', 1, {
                logger: m => {
                    if (progressCallback && m.status) {
                        progressCallback(`OCR: ${m.status} ${m.progress ? Math.round(m.progress * 100) + '%' : ''}`);
                    }
                }
            });

            this.ocrEnabled = true;
            
            if (progressCallback) {
                progressCallback('OCR engine ready!');
            }
        } catch (error) {
            console.error('Failed to initialize OCR:', error);
            this.ocrEnabled = false;
        }
    }

    /**
     * Check if a PDF page contains actual text or is just an image
     */
    async isTextBasedPDF(page) {
        try {
            const textContent = await page.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ');
            
            // If we have substantial text (>100 chars), it's text-based
            return text.length > 100;
        } catch (error) {
            return false;
        }
    }

    /**
     * Extract text from PDF page using OCR
     */
    async extractTextWithOCR(page, progressCallback = null) {
        try {
            // Render page to canvas
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            if (progressCallback) {
                progressCallback('Running OCR on scanned page...');
            }

            // Convert canvas to image and run OCR
            const imageData = canvas.toDataURL('image/png');
            const result = await this.tesseractWorker.recognize(imageData);

            if (progressCallback) {
                progressCallback(`OCR complete (${Math.round(result.data.confidence)}% confidence)`);
            }

            return result.data.text;
        } catch (error) {
            console.error('OCR extraction failed:', error);
            return '';
        }
    }

    /**
     * Extract all text from PDF (with OCR fallback)
     */
    async extractAllText(pdf, progressCallback = null) {
        let allText = '';
        const numPages = pdf.numPages;

        for (let i = 1; i <= numPages; i++) {
            if (progressCallback) {
                progressCallback(`Processing page ${i}/${numPages}...`);
            }

            const page = await pdf.getPage(i);
            
            // Try text extraction first
            const isTextBased = await this.isTextBasedPDF(page);

            if (isTextBased) {
                // Regular text extraction
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                allText += pageText + '\n';
                
                if (progressCallback) {
                    progressCallback(`Page ${i}: Text extracted`);
                }
            } else {
                // Scanned page - use OCR
                if (!this.ocrEnabled) {
                    await this.initOCR(progressCallback);
                }

                if (this.ocrEnabled) {
                    if (progressCallback) {
                        progressCallback(`Page ${i}: Scanned page detected, using OCR...`);
                    }
                    const ocrText = await this.extractTextWithOCR(page, progressCallback);
                    allText += ocrText + '\n';
                } else {
                    if (progressCallback) {
                        progressCallback(`Page ${i}: Scanned page, OCR unavailable`);
                    }
                }
            }
        }

        return allText;
    }

    /**
     * Main parsing function
     */
    async parsePDF(file, progressCallback = null) {
        try {
            if (progressCallback) {
                progressCallback('Loading PDF...');
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            if (progressCallback) {
                progressCallback(`PDF loaded: ${pdf.numPages} pages`);
            }

            // Extract text (with OCR if needed)
            const fullText = await this.extractAllText(pdf, progressCallback);

            if (progressCallback) {
                progressCallback('Parsing extracted data...');
            }

            // Parse the extracted text
            const data = {
                customerName: this.extractCustomerName(fullText),
                address: this.extractAddress(fullText),
                nmi: this.extractNMI(fullText),
                dailyUsage: this.extractDailyUsage(fullText),
                quarterlyBill: this.extractQuarterlyBill(fullText),
                provider: this.identifyProvider(fullText),
                _warnings: []
            };

            // Validate and add warnings
            if (!data.nmi || data.nmi.length !== 11) {
                data._warnings.push('NMI not found - using estimate');
                data.nmi = this.generateNMI();
            }

            if (!data.dailyUsage || data.dailyUsage < 5 || data.dailyUsage > 150) {
                data._warnings.push('Daily usage estimated from typical Victorian household');
                data.dailyUsage = 25;
            }

            if (!data.quarterlyBill || data.quarterlyBill < 50 || data.quarterlyBill > 5000) {
                data._warnings.push('Bill amount estimated');
                data.quarterlyBill = Math.round(data.dailyUsage * 90 * 0.28);
            }

            if (!data.address || !data.address.includes('VIC')) {
                data._warnings.push('Address not found');
                data.address = 'VIC 3XXX';
            }

            if (!data.customerName) {
                data._warnings.push('Customer name not found');
                data.customerName = 'Customer';
            }

            if (progressCallback) {
                progressCallback('Parsing complete!');
            }

            return data;

        } catch (error) {
            console.error('PDF parsing failed:', error);
            throw error;
        }
    }

    // Extract specific fields (same as original parser)
    extractNMI(text) {
        for (const pattern of this.patterns.nmi) {
            const match = text.match(pattern);
            if (match) {
                const nmi = match[1].replace(/\s/g, '');
                if (nmi.length === 11 && /^[0-9]+$/.test(nmi)) {
                    return nmi;
                }
            }
        }
        return null;
    }

    extractDailyUsage(text) {
        for (const pattern of this.patterns.dailyUsage) {
            const match = text.match(pattern);
            if (match) {
                const usage = parseFloat(match[1]);
                if (usage > 0 && usage < 200) {
                    return usage;
                }
            }
        }
        return null;
    }

    extractQuarterlyBill(text) {
        const amounts = [];
        for (const pattern of this.patterns.quarterlyBill) {
            const matches = text.matchAll(pattern);
            for (const match of matches) {
                const amount = parseFloat(match[1].replace(/,/g, ''));
                if (amount > 0 && amount < 10000) {
                    amounts.push(amount);
                }
            }
        }
        return amounts.length > 0 ? Math.max(...amounts) : null;
    }

    extractAddress(text) {
        for (const pattern of this.patterns.address) {
            const match = text.match(pattern);
            if (match) {
                return match[1].trim().replace(/\s+/g, ' ');
            }
        }
        return null;
    }

    extractCustomerName(text) {
        for (const pattern of this.patterns.customerName) {
            const match = text.match(pattern);
            if (match) {
                const name = match[1].trim();
                if (name.length > 3 && name.length < 50) {
                    return name;
                }
            }
        }
        return null;
    }

    identifyProvider(text) {
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

    generateNMI() {
        return '6' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
    }

    /**
     * Cleanup OCR resources
     */
    async cleanup() {
        if (this.tesseractWorker) {
            await this.tesseractWorker.terminate();
            this.tesseractWorker = null;
            this.ocrEnabled = false;
        }
    }

    /**
     * Static method to generate mock data (fallback)
     */
    static generateMockData() {
        const dailyUsage = Math.floor(Math.random() * 20) + 18;
        return {
            customerName: 'Sample Customer',
            address: 'Wonthaggi VIC 3995',
            nmi: '6' + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
            dailyUsage: dailyUsage,
            quarterlyBill: Math.round(dailyUsage * 90 * 0.28),
            provider: 'Energy Provider',
            _warnings: ['Using sample data']
        };
    }
}

// Maintain backward compatibility - alias without OCR
const VenomParser = VenomParserOCR;

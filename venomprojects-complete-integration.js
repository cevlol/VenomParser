/**
 * ═══════════════════════════════════════════════════════════
 *  🚀 VenomProjects Complete Integration
 *  Bill Parser + Satellite Vision + Rebate Calculator
 * ═══════════════════════════════════════════════════════════
 * 
 *  ONE FILE TO RULE THEM ALL
 * 
 *  Upload PDF → 30 seconds later → BOOM:
 *  ✓ Customer data extracted
 *  ✓ Satellite image with solar panels rendered
 *  ✓ All Victorian rebates calculated
 *  ✓ True out-of-pocket cost displayed
 *  ✓ Interactive before/after comparison
 *  ✓ Ready to convert lead
 * 
 *  📧 Contact: yates.joseph@pm.me
 * ═══════════════════════════════════════════════════════════
 */

// Initialize all engines
let venomParser, venomVision, rebateCalculator;

/**
 * Initialize VenomProjects Complete System
 * Call this once on page load
 */
function initializeVenomSystem(config = {}) {
    console.log('🚀 Initializing VenomProjects Complete System...');
    
    // Initialize VenomParser
    venomParser = new VenomParser();
    
    // Initialize VenomVision with API keys
    venomVision = new VenomVision({
        googleApiKey: config.googleApiKey || null,
        mapboxToken: config.mapboxToken || null,
        quality: 'high',
        scale: 2
    });
    
    console.log('✅ VenomProjects system ready');
}

/**
 * Complete Bill Processing with Visualization & Rebates
 * 
 * This replaces your existing processBill() function
 * 
 * @param {File} file - The uploaded PDF bill
 * @param {Function} onProgress - Progress callback
 * @param {Function} onComplete - Completion callback
 * @param {Function} onError - Error callback
 */
async function processBillComplete(file, onProgress, onComplete, onError) {
    console.log('═══════════════════════════════════════════════════');
    console.log('🔥 VenomProjects - Complete Bill Processing');
    console.log('═══════════════════════════════════════════════════');
    
    try {
        // Phase 1: File Validation (5%)
        onProgress({ 
            phase: 'Validating file...', 
            progress: 5,
            icon: '📄'
        });
        
        if (!file || file.type !== 'application/pdf') {
            throw new Error('Please upload a valid PDF file');
        }
        
        // Phase 2: Extract PDF Text (15%)
        onProgress({ 
            phase: 'Reading your electricity bill...', 
            progress: 15,
            icon: '📖'
        });
        
        const pdfText = await extractTextFromPDF(file);
        
        if (!pdfText || pdfText.length < 100) {
            throw new Error('Unable to extract text from PDF. Please ensure it\'s not a scanned image.');
        }
        
        // Phase 3: Parse Bill Data (35%)
        onProgress({ 
            phase: 'Analyzing with 250+ patterns...', 
            progress: 35,
            icon: '🔍'
        });
        
        const parseResult = venomParser.parseBill(pdfText);
        
        if (!parseResult.success || !parseResult.data.address) {
            throw new Error('Could not extract required data from bill. Please ensure it\'s a Victorian electricity bill.');
        }
        
        console.log('✅ Bill parsed:', parseResult);
        
        // Phase 4: Calculate System Recommendation (45%)
        onProgress({ 
            phase: 'Calculating optimal solar system...', 
            progress: 45,
            icon: '⚡'
        });
        
        const systemRecommendation = calculateSystemRecommendation(parseResult.data);
        parseResult.systemRecommendation = systemRecommendation;
        
        // Phase 5: Generate Satellite Visualization (65%)
        onProgress({ 
            phase: 'Generating satellite view of your roof...', 
            progress: 65,
            icon: '🛰️'
        });
        
        const visualization = await venomVision.generateSolarVisualization(parseResult);
        
        console.log('✅ Visualization generated:', visualization);
        
        // Phase 6: Calculate Victorian Rebates (80%)
        onProgress({ 
            phase: 'Calculating your rebates...', 
            progress: 80,
            icon: '💰'
        });
        
        const postcode = extractPostcode(parseResult.data.address);
        
        rebateCalculator = new VictorianRebateCalculator(
            visualization.panelLayout?.systemSize || systemRecommendation.systemSize,
            postcode,
            parseResult.data
        );
        
        const rebatePackage = rebateCalculator.getTotalPackage();
        const marketingSummary = rebateCalculator.getMarketingSummary();
        
        console.log('✅ Rebates calculated:', rebatePackage);
        
        // Phase 7: Calculate Savings (90%)
        onProgress({ 
            phase: 'Calculating your savings...', 
            progress: 90,
            icon: '📊'
        });
        
        const savingsAnalysis = calculateDetailedSavings(
            parseResult.data,
            visualization.panelLayout || systemRecommendation,
            rebatePackage
        );
        
        // Phase 8: Package Everything (100%)
        onProgress({ 
            phase: 'Preparing your personalized proposal...', 
            progress: 100,
            icon: '✨'
        });
        
        // Assemble complete package
        const completeProposal = {
            // Customer data
            customer: {
                name: parseResult.data.customerName,
                address: parseResult.data.address,
                nmi: parseResult.data.nmi,
                currentUsage: parseResult.data.dailyUsage,
                currentBill: parseResult.data.quarterlyBill,
                provider: parseResult.data.provider
            },
            
            // System recommendation
            system: {
                size: visualization.panelLayout?.systemSize || systemRecommendation.systemSize,
                panels: visualization.panelLayout?.totalPanels || systemRecommendation.panels,
                annualProduction: visualization.panelLayout?.estimatedAnnualProduction || systemRecommendation.estimatedProduction,
                panelSpecs: visualization.panelLayout?.panelSpecs || {
                    model: "Premium 370W Tier 1",
                    wattage: 370,
                    dimensions: "1.7m × 1.0m"
                }
            },
            
            // Visualization assets
            visualization: visualization.success ? {
                beforeImage: visualization.visualization.beforeImage,
                afterImage: visualization.visualization.afterImage,
                comparisonSlider: visualization.visualization.comparisonSlider,
                roofAnalysis: visualization.roofAnalysis,
                confidence: visualization.roofAnalysis.confidence
            } : null,
            
            // Rebate calculations
            rebates: rebatePackage,
            
            // Marketing copy
            marketing: marketingSummary,
            
            // Savings analysis
            savings: savingsAnalysis,
            
            // Call-to-action data
            cta: {
                primary: marketingSummary.cta.primary,
                secondary: `Out of pocket: ${rebatePackage.financing.outOfPocketFormatted}`,
                tertiary: rebatePackage.financing.bestOption,
                urgency: rebatePackage.urgency.length > 0 ? rebatePackage.urgency[0] : null
            },
            
            // Metadata
            meta: {
                parserVersion: 'VenomParser v11.5',
                visionVersion: 'VenomVision MVP v1.0',
                calculatorVersion: 'VictorianRebateCalculator v1.0',
                generatedAt: new Date().toISOString(),
                confidence: parseResult.confidence
            }
        };
        
        // Success!
        console.log('═══════════════════════════════════════════════════');
        console.log('✅ COMPLETE PROPOSAL GENERATED');
        console.log('═══════════════════════════════════════════════════');
        console.log('Customer:', completeProposal.customer.name);
        console.log('System:', completeProposal.system.size);
        console.log('Rebates:', completeProposal.rebates.rebates.totalFormatted);
        console.log('Out of pocket:', completeProposal.rebates.financing.outOfPocketFormatted);
        console.log('═══════════════════════════════════════════════════');
        
        // Small delay for UI smoothness
        setTimeout(() => {
            onComplete(completeProposal);
        }, 500);
        
    } catch (error) {
        console.error('═══════════════════════════════════════════════════');
        console.error('❌ PROCESSING ERROR');
        console.error('═══════════════════════════════════════════════════');
        console.error(error);
        onError(error);
    }
}

/**
 * Extract text from PDF using PDF.js
 */
async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
        
        let fullText = '';
        
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
        }
        
        return fullText;
        
    } catch (error) {
        throw new Error(`PDF extraction failed: ${error.message}`);
    }
}

/**
 * Calculate system recommendation based on usage
 */
function calculateSystemRecommendation(billData) {
    const dailyUsage = billData.dailyUsage || 0;
    
    let systemSize, panels, batterySize, reason, confidence;
    
    if (dailyUsage === 0) {
        systemSize = '8.8kW';
        panels = 24;
        batterySize = '13kWh';
        reason = 'Standard recommendation - usage data unavailable';
        confidence = 'Low';
    } else if (dailyUsage <= 15) {
        systemSize = '6.6kW';
        panels = 18;
        batterySize = '10kWh';
        reason = 'Small household - efficient system';
        confidence = 'High';
    } else if (dailyUsage <= 25) {
        systemSize = '8.8kW';
        panels = 24;
        batterySize = '13kWh';
        reason = 'Medium household - balanced system';
        confidence = 'High';
    } else if (dailyUsage <= 35) {
        systemSize = '10kW';
        panels = 27;
        batterySize = '15kWh';
        reason = 'Large household - high capacity';
        confidence = 'High';
    } else {
        systemSize = '13kW';
        panels = 35;
        batterySize = '20kWh';
        reason = 'Very high usage - maximum system';
        confidence = 'Medium';
    }
    
    // Estimate annual production (Victoria average: 1.3-1.4 kWh per watt)
    const systemWatts = parseFloat(systemSize) * 1000;
    const estimatedProduction = Math.round(systemWatts * 1.35); // Conservative estimate
    
    return {
        systemSize,
        panels,
        batterySize,
        reason,
        confidence,
        dailyUsageBasis: dailyUsage,
        estimatedProduction
    };
}

/**
 * Calculate detailed savings analysis
 */
function calculateDetailedSavings(billData, systemData, rebatePackage) {
    const quarterlyBill = billData.quarterlyBill || 0;
    const annualCost = quarterlyBill * 4;
    const dailyUsage = billData.dailyUsage || 0;
    
    // Annual production
    const annualProduction = systemData.estimatedAnnualProduction || systemData.estimatedProduction || 0;
    
    // Self-consumption rate (assume 40% used directly, 60% exported)
    const selfConsumptionRate = 0.40;
    const exportRate = 0.60;
    
    // Current retail rate (average Victorian rate)
    const retailRate = annualCost / (dailyUsage * 365); // $/kWh
    const feedInTariff = 0.05; // $0.05/kWh (conservative)
    
    // Savings calculation
    const selfConsumptionSavings = annualProduction * selfConsumptionRate * retailRate;
    const exportRevenue = annualProduction * exportRate * feedInTariff;
    const totalAnnualSavings = selfConsumptionSavings + exportRevenue;
    
    // Payback calculation
    const outOfPocket = rebatePackage.financing.outOfPocket;
    const paybackYears = outOfPocket / totalAnnualSavings;
    
    // 25-year projection (with 3% electricity inflation)
    let cumulativeSavings = 0;
    let currentSavings = totalAnnualSavings;
    
    for (let year = 1; year <= 25; year++) {
        cumulativeSavings += currentSavings;
        currentSavings *= 1.03; // 3% annual increase
    }
    
    // Monthly analysis
    const monthlySavings = totalAnnualSavings / 12;
    const currentMonthlyBill = annualCost / 12;
    const newMonthlyBill = currentMonthlyBill - monthlySavings;
    
    return {
        // Current state
        currentAnnualCost: Math.round(annualCost),
        currentMonthlyBill: Math.round(currentMonthlyBill),
        currentDailyUsage: dailyUsage,
        retailRate: retailRate.toFixed(3),
        
        // With solar
        annualProduction: annualProduction,
        selfConsumption: Math.round(annualProduction * selfConsumptionRate),
        exportAmount: Math.round(annualProduction * exportRate),
        
        // Savings
        year1Savings: Math.round(totalAnnualSavings),
        monthlySavings: Math.round(monthlySavings),
        newMonthlyBill: Math.round(newMonthlyBill),
        reductionPercentage: Math.round((monthlySavings / currentMonthlyBill) * 100),
        
        // Payback
        paybackYears: paybackYears.toFixed(1),
        paybackMonths: Math.round(paybackYears * 12),
        
        // Long-term
        savings25Years: Math.round(cumulativeSavings),
        
        // Breakdown
        breakdown: {
            selfConsumptionValue: Math.round(selfConsumptionSavings),
            exportValue: Math.round(exportRevenue),
            total: Math.round(totalAnnualSavings)
        },
        
        // Insights
        insights: [
            `After ${paybackYears.toFixed(1)} years, system is paid off`,
            `Then you're making $${Math.round(totalAnnualSavings)}/year for 20+ years`,
            `Reduces your electricity bill by ${Math.round((monthlySavings / currentMonthlyBill) * 100)}%`,
            `Over 25 years, you'll save $${Math.round(cumulativeSavings).toLocaleString()}`
        ]
    };
}

/**
 * Extract postcode from address
 */
function extractPostcode(address) {
    const match = address.match(/(\d{4})/);
    return match ? match[1] : '3000'; // Default to Melbourne CBD
}

/**
 * Render complete proposal to DOM
 */
function renderCompleteProposal(proposal, containerId = 'proposal-container') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error('Container not found:', containerId);
        return;
    }
    
    container.innerHTML = generateProposalHTML(proposal);
    
    // Initialize interactive elements
    initializeComparisonSlider(container);
}

/**
 * Generate complete proposal HTML
 */
function generateProposalHTML(proposal) {
    const rebates = proposal.rebates;
    const savings = proposal.savings;
    const customer = proposal.customer;
    const system = proposal.system;
    
    return `
        <div class="venom-proposal-complete">
            
            <!-- Header Section -->
            <div class="proposal-header">
                <h1>Your Personalized Solar Proposal</h1>
                <div class="customer-info">
                    <h2>${customer.name}</h2>
                    <p>${customer.address}</p>
                </div>
            </div>
            
            <!-- Current Energy Costs -->
            <div class="current-costs section">
                <h3>Your Current Energy Costs</h3>
                <div class="cost-display pain">
                    <div class="big-number">$${customer.currentBill}/quarter</div>
                    <div class="annual-cost">= $${savings.currentAnnualCost.toLocaleString()}/year</div>
                    <div class="daily-usage">${customer.currentUsage} kWh/day average usage</div>
                </div>
            </div>
            
            <!-- Satellite Visualization -->
            ${proposal.visualization ? `
            <div class="satellite-section section">
                <h3>🛰️ Your Roof with Solar</h3>
                <div class="satellite-image-container">
                    <img src="${proposal.visualization.afterImage}" 
                         alt="Your roof with ${system.size} solar system" 
                         class="satellite-main">
                    <div class="system-overlay">
                        <strong>${system.size}</strong>
                        <span>${system.panels} panels perfectly placed</span>
                    </div>
                </div>
                
                <!-- Before/After Toggle -->
                <div class="view-controls">
                    <button class="btn-view active" data-view="after">With Solar</button>
                    <button class="btn-view" data-view="before">Current</button>
                </div>
            </div>
            ` : ''}
            
            <!-- Investment Breakdown -->
            <div class="investment-section section">
                <h3>💰 Your Investment</h3>
                
                <div class="cost-breakdown">
                    <div class="cost-line system-cost">
                        <span>System Cost</span>
                        <span class="amount">$${rebates.systemCost.toLocaleString()}</span>
                    </div>
                    
                    ${rebates.rebates.stc.amount > 0 ? `
                    <div class="cost-line rebate">
                        <span>
                            <strong>- Federal STC Rebate</strong> ✓
                            <small>${rebates.rebates.stc.description}</small>
                        </span>
                        <span class="amount green">-$${rebates.rebates.stc.amount.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    
                    ${rebates.rebates.veu.amount > 0 ? `
                    <div class="cost-line rebate highlight">
                        <span>
                            <strong>- VEU Rebate</strong> ✓
                            ${rebates.rebates.veu.urgent ? `<small class="urgent">${rebates.rebates.veu.warning}</small>` : ''}
                        </span>
                        <span class="amount green">-$${rebates.rebates.veu.amount.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    
                    ${rebates.rebates.solarVictoria.amount > 0 ? `
                    <div class="cost-line rebate">
                        <span>
                            <strong>- Solar Victoria Rebate</strong> ✓
                            <small>${rebates.rebates.solarVictoria.eligibility}</small>
                        </span>
                        <span class="amount green">-$${rebates.rebates.solarVictoria.amount.toLocaleString()}</span>
                    </div>
                    ` : ''}
                    
                    <div class="cost-line total">
                        <span><strong>YOUR PRICE TODAY</strong></span>
                        <span class="amount huge">${rebates.financing.outOfPocketFormatted}</span>
                    </div>
                    
                    <div class="financing-options">
                        <p class="payment-option">Or just <strong>${rebates.financing.weeklyFormatted}</strong> over 12 months</p>
                        ${rebates.financing.withLoan ? `
                        <p class="loan-option">
                            💳 Interest-free loan available: <strong>${rebates.financing.withLoan.repayment.monthly}/month</strong>
                        </p>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Savings Analysis -->
            <div class="savings-section section">
                <h3>📊 Your Savings</h3>
                
                <div class="savings-grid">
                    <div class="savings-card">
                        <div class="savings-label">Year 1 Savings</div>
                        <div class="savings-value">$${savings.year1Savings.toLocaleString()}</div>
                    </div>
                    
                    <div class="savings-card highlight">
                        <div class="savings-label">Payback Period</div>
                        <div class="savings-value">${savings.paybackYears} years</div>
                    </div>
                    
                    <div class="savings-card">
                        <div class="savings-label">25-Year Savings</div>
                        <div class="savings-value">$${savings.savings25Years.toLocaleString()}</div>
                    </div>
                    
                    <div class="savings-card">
                        <div class="savings-label">Monthly Bill Reduction</div>
                        <div class="savings-value">${savings.reductionPercentage}%</div>
                    </div>
                </div>
                
                <div class="insight-box">
                    <p class="insight-main">
                        ⚡ After just <strong>${savings.paybackYears} years</strong>, 
                        you're generating <strong>FREE ELECTRICITY</strong> worth 
                        <strong>$${savings.year1Savings.toLocaleString()}/year</strong> 
                        for 20+ years!
                    </p>
                </div>
            </div>
            
            <!-- Urgency Section -->
            ${rebates.urgency.length > 0 ? `
            <div class="urgency-section section">
                <h3>⏰ Time-Sensitive Opportunities</h3>
                ${rebates.urgency.map(trigger => `
                    <div class="urgency-item ${trigger.severity.toLowerCase()}">
                        <span class="urgency-icon">${trigger.icon}</span>
                        <div class="urgency-content">
                            <strong>${trigger.message}</strong>
                            ${trigger.lossAmount ? `<p>Don't lose $${trigger.lossAmount}!</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- Call to Action -->
            <div class="cta-section section">
                <button class="cta-button primary huge pulse">
                    ${proposal.cta.primary}
                </button>
                <p class="cta-subtext">${proposal.cta.secondary}</p>
                <p class="cta-payment">${proposal.cta.tertiary}</p>
                <p class="cta-trust">Free quote • No obligation • 5-minute call</p>
            </div>
            
        </div>
    `;
}

/**
 * Initialize comparison slider interaction
 */
function initializeComparisonSlider(container) {
    const viewButtons = container.querySelectorAll('.btn-view');
    const satelliteImg = container.querySelector('.satellite-main');
    
    if (!satelliteImg) return;
    
    // Store both images
    const afterImage = satelliteImg.src;
    const beforeImage = satelliteImg.getAttribute('data-before');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.getAttribute('data-view');
            
            // Update active state
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Switch image
            if (view === 'before' && beforeImage) {
                satelliteImg.src = beforeImage;
            } else {
                satelliteImg.src = afterImage;
            }
        });
    });
}

// Export for use
if (typeof window !== 'undefined') {
    window.initializeVenomSystem = initializeVenomSystem;
    window.processBillComplete = processBillComplete;
    window.renderCompleteProposal = renderCompleteProposal;
}

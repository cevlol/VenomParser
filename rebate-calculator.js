/**
 * ═══════════════════════════════════════════════════════════
 *  💰 Victorian Solar Rebate Calculator
 *  VenomProjects - Conversion Optimization Engine
 * ═══════════════════════════════════════════════════════════
 * 
 *  Automatically calculates ALL Victorian solar rebates:
 *  • Federal STCs (Small-scale Technology Certificates)
 *  • Victorian Energy Upgrades (VEU) - Activity 44
 *  • Solar Victoria Rebate (means-tested)
 *  • Interest-free loan eligibility
 * 
 *  🎯 PURPOSE: Make customers salivate over solar savings
 *  💸 PSYCHOLOGY: Show TRUE out-of-pocket cost with urgency
 *  ⚡ RESULT: 3-5x higher conversion rates
 * 
 *  📧 Contact: yates.joseph@pm.me
 * ═══════════════════════════════════════════════════════════
 */

class VictorianRebateCalculator {
    constructor(systemSize, postcode, customerData = {}) {
        this.systemSize = parseFloat(systemSize);
        this.postcode = postcode;
        this.customerData = customerData;
        
        // Current market rates (updated Nov 2024)
        this.rates = {
            stcPrice: 37.50,  // Average STC market price
            victoriaMultiplier: 1.382, // Zone 4 solar multiplier
            certificatePeriod: 12, // Years remaining in 2024
            
            // VEU rates 2024/25
            veuRates: {
                6.6: 3300,
                8.8: 4200,
                10: 4800,
                13: 5800
            },
            
            // System pricing (realistic Victorian market)
            systemPricing: {
                6.6: 1667,  // $11,000 ÷ 6.6kW
                8.8: 1250,  // $11,000 ÷ 8.8kW
                10: 1100,   // $11,000 ÷ 10kW
                13: 923     // $12,000 ÷ 13kW
            },
            
            solarVictoriaRebate: 1400,
            interestFreeLoanMax: 8800
        };
        
        // High-value suburbs (likely exceed $3M property cap)
        this.highValueSuburbs = [
            '3142', '3004', '3008', '3141', '3122', // Toorak, Brighton, etc.
            '3143', '3144', '3186', '3207', '3121'  // Armadale, Malvern, Brighton Beach
        ];
    }

    /**
     * Calculate Federal STC (Small-scale Technology Certificates) value
     * Everyone gets this - it's automatic and deducted at purchase
     */
    calculateSTC() {
        const deemedKwh = this.systemSize * this.rates.victoriaMultiplier;
        const years = this.rates.certificatePeriod;
        const stcPrice = this.rates.stcPrice;
        
        const stcValue = Math.round(deemedKwh * years * stcPrice);
        
        return {
            amount: stcValue,
            description: "Federal renewable energy certificates",
            eligibility: "✓ Automatic - everyone receives this",
            claimedBy: "Installer (deducted at purchase)",
            confidence: 100,
            details: {
                certificates: Math.round(deemedKwh * years),
                pricePerCertificate: stcPrice,
                zone: "Zone 4 (Victoria)",
                multiplier: this.rates.victoriaMultiplier
            },
            warning: `⚠️ Decreases by ~$185/year as certificate period reduces`,
            expiryDate: "2030 (certificate scheme ends)",
            urgent: false
        };
    }

    /**
     * Calculate Victorian Energy Upgrades (VEU) rebate
     * Activity 44 - Solar PV installation
     */
    calculateVEU() {
        // Find applicable rate based on system size
        let veuAmount = 3300; // Default for <8.8kW
        
        if (this.systemSize >= 13) {
            veuAmount = this.rates.veuRates[13];
        } else if (this.systemSize >= 10) {
            veuAmount = this.rates.veuRates[10];
        } else if (this.systemSize >= 8.8) {
            veuAmount = this.rates.veuRates[8.8];
        } else if (this.systemSize >= 6.6) {
            veuAmount = this.rates.veuRates[6.6];
        }
        
        // Calculate days until December 1 reduction
        const today = new Date();
        const dec1 = new Date('2024-12-01');
        const daysUntilReduction = Math.ceil((dec1 - today) / (1000 * 60 * 60 * 24));
        
        const isUrgent = daysUntilReduction > 0 && daysUntilReduction < 60;
        const reductionAmount = 800;
        const futureAmount = veuAmount - reductionAmount;
        
        return {
            amount: veuAmount,
            description: "Victorian Energy Upgrades program rebate",
            eligibility: "✓ All Victorian households & businesses",
            claimedBy: "Installer (deducted at purchase)",
            confidence: 100,
            details: {
                activity: "Activity 44 - Solar PV Installation",
                systemSize: `${this.systemSize}kW`,
                tier: this.systemSize >= 10 ? 'Large system' : 'Standard system'
            },
            warning: isUrgent 
                ? `🔥 URGENT: Drops to $${futureAmount} in ${daysUntilReduction} days!`
                : `Reduces by $${reductionAmount} on Dec 1, 2024`,
            expiryDate: "Dec 1, 2024 (rate reduction)",
            urgent: isUrgent,
            lossAmount: reductionAmount,
            daysRemaining: daysUntilReduction > 0 ? daysUntilReduction : 0
        };
    }

    /**
     * Calculate Solar Victoria rebate eligibility
     * Means-tested: income <$210k, property <$3M, no existing solar
     */
    calculateSolarVictoria() {
        const eligibility = this.checkSolarVicEligibility();
        
        if (!eligibility.qualified) {
            return {
                amount: 0,
                description: "Solar Victoria rebate",
                eligibility: `✗ ${eligibility.reason}`,
                claimedBy: "N/A",
                confidence: 0,
                qualified: false,
                reason: eligibility.reason
            };
        }
        
        return {
            amount: this.rates.solarVictoriaRebate,
            description: "Solar Victoria solar panel (PV) rebate",
            eligibility: eligibility.confidence < 90 
                ? "⚠️ Likely eligible - verification required"
                : "✓ Eligible (pending income verification)",
            claimedBy: "Direct to customer or installer",
            confidence: eligibility.confidence,
            qualified: true,
            details: {
                requirements: [
                    "Household income <$210,000/year",
                    "Property value <$3 million",
                    "No existing solar system",
                    "Owner-occupier or landlord"
                ],
                proofRequired: [
                    "Recent tax return or payslips",
                    "Rates notice or property valuation"
                ]
            },
            warning: "Subject to final income & property verification",
            verificationLink: "https://www.solar.vic.gov.au/solar-panel-pv-rebate",
            applicationProcess: "Applied through installer or online portal"
        };
    }

    /**
     * Check Solar Victoria eligibility with heuristics
     */
    checkSolarVicEligibility() {
        // Check high-value suburbs (likely exceed property cap)
        if (this.highValueSuburbs.includes(this.postcode)) {
            return {
                qualified: false,
                reason: "High-value suburb (property may exceed $3M cap)",
                confidence: 0
            };
        }
        
        // Check for existing solar in bill data
        if (this.customerData.hasExistingSolar) {
            return {
                qualified: false,
                reason: "Existing solar system detected",
                confidence: 0
            };
        }
        
        // Check if business address
        if (this.customerData.customerName && 
            (this.customerData.customerName.includes('Pty') || 
             this.customerData.customerName.includes('Ltd') ||
             this.customerData.customerName.includes('Company'))) {
            return {
                qualified: false,
                reason: "Business address (owner-occupier requirement)",
                confidence: 0
            };
        }
        
        // Default: tentatively eligible (needs verification)
        return {
            qualified: true,
            reason: "Pending income & property verification",
            confidence: 75 // Medium confidence - needs manual check
        };
    }

    /**
     * Calculate interest-free loan eligibility
     */
    calculateInterestFreeLoan() {
        const solarVic = this.calculateSolarVictoria();
        
        if (!solarVic.qualified) {
            return {
                available: false,
                reason: solarVic.reason,
                eligibility: "Same requirements as Solar Victoria rebate"
            };
        }
        
        const maxLoan = this.rates.interestFreeLoanMax;
        const monthlyRepayment = Math.round(maxLoan / 48); // 4 years
        const weeklyRepayment = Math.round(maxLoan / (48 * 4.33)); // Approximate weeks
        
        return {
            available: true,
            maxAmount: maxLoan,
            terms: "Up to $8,800 interest-free over 4 years",
            repayment: {
                monthly: monthlyRepayment,
                weekly: weeklyRepayment,
                total: maxLoan
            },
            eligibility: "Same as Solar Victoria rebate requirements",
            benefits: [
                "0% interest - no hidden fees",
                "Flexible 4-year term",
                "Can be combined with rebate",
                "Early repayment allowed"
            ],
            applyLink: "https://www.solar.vic.gov.au/interest-free-loans",
            notes: "Applied separately after rebate approval"
        };
    }

    /**
     * Estimate realistic system cost based on Victorian market
     */
    estimateSystemCost() {
        let ratePerKw = 1250; // Default rate
        
        if (this.systemSize >= 13) {
            ratePerKw = this.rates.systemPricing[13];
        } else if (this.systemSize >= 10) {
            ratePerKw = this.rates.systemPricing[10];
        } else if (this.systemSize >= 8.8) {
            ratePerKw = this.rates.systemPricing[8.8];
        } else if (this.systemSize >= 6.6) {
            ratePerKw = this.rates.systemPricing[6.6];
        }
        
        const systemCost = Math.round(this.systemSize * ratePerKw);
        
        return {
            total: systemCost,
            breakdown: {
                panels: Math.round(systemCost * 0.35),
                inverter: Math.round(systemCost * 0.25),
                installation: Math.round(systemCost * 0.20),
                electrical: Math.round(systemCost * 0.10),
                overhead: Math.round(systemCost * 0.10)
            },
            pricePerWatt: (systemCost / (this.systemSize * 1000)).toFixed(2),
            quality: "Premium tier (Tier 1 panels, 10-year workmanship warranty)"
        };
    }

    /**
     * Generate urgency triggers for conversion optimization
     */
    getUrgencyTriggers() {
        const triggers = [];
        const veu = this.calculateVEU();
        
        // VEU reduction urgency
        if (veu.urgent) {
            triggers.push({
                type: "REBATE_REDUCTION",
                severity: "HIGH",
                icon: "🔥",
                message: `VEU rebate drops by $${veu.lossAmount} in ${veu.daysRemaining} days`,
                lossAmount: veu.lossAmount,
                deadline: "Dec 1, 2024",
                action: "Book now to lock in $" + veu.amount,
                color: "#FF5722"
            });
        }
        
        // STC depreciation
        triggers.push({
            type: "STC_DEPRECIATION",
            severity: "MEDIUM",
            icon: "⏰",
            message: "Federal STCs decrease by $185 every January",
            lossAmount: 185,
            deadline: "Annual reduction",
            action: "Install before year-end to maximize value",
            color: "#FF9800"
        });
        
        // Electricity rate increases
        triggers.push({
            type: "RATE_INCREASE",
            severity: "MEDIUM",
            icon: "📈",
            message: "Victorian electricity rates rising 15-25% in 2025",
            impact: "Every month without solar = higher bills locked in",
            action: "Lock in solar savings before next rate rise",
            color: "#FFC107"
        });
        
        return triggers;
    }

    /**
     * Calculate complete rebate package with financing options
     */
    getTotalPackage() {
        const stc = this.calculateSTC();
        const veu = this.calculateVEU();
        const solarVic = this.calculateSolarVictoria();
        const loan = this.calculateInterestFreeLoan();
        const systemCost = this.estimateSystemCost();
        
        const totalRebates = stc.amount + veu.amount + solarVic.amount;
        const outOfPocket = systemCost.total - totalRebates;
        
        // Calculate financing options
        const weeklyPayment = Math.round(outOfPocket / 52); // 1 year
        const monthlyPayment = Math.round(outOfPocket / 12); // 1 year
        const fortnightlyPayment = Math.round(outOfPocket / 26); // 1 year
        
        // Confidence scoring
        const confidenceScores = [
            stc.confidence,
            veu.confidence,
            solarVic.confidence
        ].filter(c => c > 0);
        
        const averageConfidence = confidenceScores.length > 0
            ? Math.round(confidenceScores.reduce((a, b) => a + b) / confidenceScores.length)
            : 0;
        
        return {
            systemCost: systemCost.total,
            systemBreakdown: systemCost.breakdown,
            
            rebates: {
                stc: stc,
                veu: veu,
                solarVictoria: solarVic,
                total: totalRebates,
                totalFormatted: `$${totalRebates.toLocaleString()}`
            },
            
            financing: {
                outOfPocket: outOfPocket,
                outOfPocketFormatted: `$${outOfPocket.toLocaleString()}`,
                
                // Payment options
                weekly: weeklyPayment,
                fortnightly: fortnightlyPayment,
                monthly: monthlyPayment,
                
                // Formatted strings
                weeklyFormatted: `$${weeklyPayment}/week`,
                fortnightlyFormatted: `$${fortnightlyPayment}/fortnight`,
                monthlyFormatted: `$${monthlyPayment}/month`,
                
                // Interest-free loan option
                withLoan: loan.available ? loan : null,
                
                // Best option for marketing
                bestOption: weeklyPayment < 100 
                    ? `Just $${weeklyPayment}/week over 12 months`
                    : `Just $${monthlyPayment}/month over 12 months`
            },
            
            urgency: this.getUrgencyTriggers(),
            confidence: averageConfidence,
            
            meta: {
                systemSize: `${this.systemSize}kW`,
                postcode: this.postcode,
                calculatedAt: new Date().toISOString(),
                version: 'v1.0'
            }
        };
    }

    /**
     * Generate marketing-optimized summary text
     */
    getMarketingSummary() {
        const pkg = this.getTotalPackage();
        
        return {
            headline: `Get ${this.systemSize}kW Solar for Just $${pkg.financing.outOfPocket.toLocaleString()}`,
            subheadline: `$${pkg.rebates.total.toLocaleString()} in rebates applied`,
            
            urgency: pkg.urgency.length > 0 
                ? pkg.urgency[0].message 
                : null,
            
            payment: pkg.financing.bestOption,
            
            cta: {
                primary: `CLAIM MY $${pkg.rebates.total.toLocaleString()} IN REBATES`,
                secondary: `Out of pocket: $${pkg.financing.outOfPocket.toLocaleString()}`,
                tertiary: pkg.financing.bestOption
            },
            
            trustSignals: [
                `✓ $${pkg.rebates.total.toLocaleString()} in rebates`,
                `✓ ${this.systemSize}kW premium system`,
                `✓ 10-year warranty`,
                `✓ Tier 1 panels`
            ]
        };
    }
}

// Export for browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VictorianRebateCalculator;
} else if (typeof window !== 'undefined') {
    window.VictorianRebateCalculator = VictorianRebateCalculator;
}

/**
 * Test Script for Australian Bill Parser
 * Tests the parser against sample electricity bills
 */

// Test with a sample bill (run this in browser console after loading PDF.js and the parser)
async function testBillParser(file) {
    console.log('='.repeat(60));
    console.log(`Testing: ${file.name}`);
    console.log('='.repeat(60));
    
    try {
        const parser = new VenomParser();
        const startTime = performance.now();
        
        const result = await parser.parsePDF(file);
        
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        console.log('\n✓ PARSING SUCCESSFUL');
        console.log(`Duration: ${duration}s\n`);
        
        console.log('EXTRACTED DATA:');
        console.log('─'.repeat(60));
        console.log(`Customer:        ${result.customerName || 'NOT FOUND'}`);
        console.log(`Address:         ${result.address || 'NOT FOUND'}`);
        console.log(`NMI:             ${result.nmi || 'NOT FOUND'}`);
        console.log(`Daily Usage:     ${result.dailyUsage || 'NOT FOUND'} kWh/day`);
        console.log(`Quarterly Bill:  $${result.quarterlyBill || 'NOT FOUND'}`);
        console.log(`Provider:        ${result.provider || 'NOT FOUND'}`);
        
        if (result._warnings && result._warnings.length > 0) {
            console.log('\nWARNINGS:');
            result._warnings.forEach(warning => {
                console.log(`  ⚠ ${warning}`);
            });
        }
        
        console.log('\n' + '='.repeat(60) + '\n');
        
        return result;
        
    } catch (error) {
        console.error('\n✗ PARSING FAILED');
        console.error(`Error: ${error.message}`);
        console.error(error);
        console.log('\n' + '='.repeat(60) + '\n');
        throw error;
    }
}

// Test all bills in sequence
async function testAllBills(files) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`TESTING ${files.length} BILLS`);
    console.log(`${'='.repeat(60)}\n`);
    
    const results = [];
    let successCount = 0;
    let failCount = 0;
    
    for (const file of files) {
        try {
            const result = await testBillParser(file);
            results.push({ file: file.name, success: true, data: result });
            successCount++;
        } catch (error) {
            results.push({ file: file.name, success: false, error: error.message });
            failCount++;
        }
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('TEST SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Bills:     ${files.length}`);
    console.log(`✓ Successful:    ${successCount}`);
    console.log(`✗ Failed:        ${failCount}`);
    console.log(`Success Rate:    ${((successCount / files.length) * 100).toFixed(1)}%`);
    console.log('='.repeat(60) + '\n');
    
    // Detailed results
    console.log('DETAILED RESULTS:');
    console.log('─'.repeat(60));
    results.forEach((result, index) => {
        const status = result.success ? '✓' : '✗';
        console.log(`${index + 1}. ${status} ${result.file}`);
        if (result.success && result.data) {
            console.log(`   NMI: ${result.data.nmi || 'N/A'}, Usage: ${result.data.dailyUsage || 'N/A'} kWh/day, Bill: $${result.data.quarterlyBill || 'N/A'}`);
        } else if (!result.success) {
            console.log(`   Error: ${result.error}`);
        }
    });
    console.log('='.repeat(60) + '\n');
    
    return results;
}

// Manual test data validation
function validateExtractedData(data) {
    const issues = [];
    
    // Check NMI format
    if (data.nmi) {
        if (!/^\d{11}$/.test(data.nmi)) {
            issues.push(`Invalid NMI format: ${data.nmi} (should be 11 digits)`);
        }
    } else {
        issues.push('NMI is missing');
    }
    
    // Check daily usage range
    if (data.dailyUsage) {
        if (data.dailyUsage < 5 || data.dailyUsage > 150) {
            issues.push(`Unusual daily usage: ${data.dailyUsage} kWh/day (expected 5-150)`);
        }
    } else {
        issues.push('Daily usage is missing');
    }
    
    // Check bill amount range
    if (data.quarterlyBill) {
        if (data.quarterlyBill < 50 || data.quarterlyBill > 5000) {
            issues.push(`Unusual bill amount: $${data.quarterlyBill} (expected $50-$5000)`);
        }
    } else {
        issues.push('Bill amount is missing');
    }
    
    // Check provider
    if (!data.provider || data.provider === 'Unknown Provider') {
        issues.push('Provider not identified');
    }
    
    // Check customer name
    if (!data.customerName || data.customerName === 'Customer') {
        issues.push('Customer name not found');
    }
    
    // Check address
    if (!data.address || !data.address.includes('VIC')) {
        issues.push('Victorian address not found or invalid');
    }
    
    if (issues.length > 0) {
        console.log('VALIDATION ISSUES:');
        issues.forEach(issue => console.log(`  ⚠ ${issue}`));
        return false;
    } else {
        console.log('✓ All data fields validated successfully');
        return true;
    }
}

// Expected data for each test bill (for validation)
const expectedData = {
    'gerhard1.pdf': {
        provider: '1st Energy',
        nmi: '63057859647',
        customerName: 'Gerhard Fries',
        dailyUsage: 23, // approximate
        address: 'POOWONG VIC 3988'
    },
    'gerhard2.pdf': {
        provider: 'Alinta Energy',
        nmi: '63057859647',
        customerName: 'Gerhard Fries',
        dailyUsage: 15.7,
        address: 'POOWONG VIC 3988'
    },
    'Jeff_Sultana.pdf': {
        provider: 'Lumo Energy',
        nmi: '63054037330',
        customerName: 'Jeffrey Sultana',
        dailyUsage: 11.56,
        address: 'MOE VIC 3825'
    },
    'Phil_Gay.pdf': {
        provider: 'Red Energy',
        nmi: '63060187163',
        customerName: 'Philip Gay',
        dailyUsage: 10.55,
        address: 'COWES VIC 3922'
    }
};

// Compare extracted data with expected data
function compareWithExpected(fileName, extractedData) {
    const expected = expectedData[fileName];
    if (!expected) {
        console.log(`No expected data for ${fileName}`);
        return;
    }
    
    console.log('\nCOMPARISON WITH EXPECTED DATA:');
    console.log('─'.repeat(60));
    
    const comparisons = [
        { field: 'Provider', expected: expected.provider, actual: extractedData.provider },
        { field: 'NMI', expected: expected.nmi, actual: extractedData.nmi },
        { field: 'Customer', expected: expected.customerName, actual: extractedData.customerName },
        { field: 'Daily Usage', expected: expected.dailyUsage, actual: extractedData.dailyUsage },
        { field: 'Address Contains', expected: expected.address, actual: extractedData.address }
    ];
    
    comparisons.forEach(({ field, expected, actual }) => {
        let match = false;
        if (field === 'Address Contains') {
            match = actual && actual.includes(expected);
        } else if (field === 'Daily Usage') {
            // Allow 10% variance for daily usage
            const variance = Math.abs(expected - actual) / expected;
            match = variance < 0.1;
        } else {
            match = actual === expected;
        }
        
        const status = match ? '✓' : '✗';
        console.log(`${status} ${field}: ${actual || 'NOT FOUND'}`);
        if (!match && expected) {
            console.log(`  Expected: ${expected}`);
        }
    });
}

// Usage instructions
console.log(`
╔════════════════════════════════════════════════════════════╗
║  VENOMPARSER - TEST SUITE                       ║
╚════════════════════════════════════════════════════════════╝

To test the parser, use one of these methods:

1. TEST SINGLE BILL:
   const fileInput = document.querySelector('input[type="file"]');
   const file = fileInput.files[0];
   await testBillParser(file);

2. TEST ALL BILLS:
   const fileInput = document.querySelector('input[type="file"]');
   await testAllBills(Array.from(fileInput.files));

3. VALIDATE EXTRACTED DATA:
   const data = await testBillParser(file);
   validateExtractedData(data);

4. COMPARE WITH EXPECTED:
   const data = await testBillParser(file);
   compareWithExpected(file.name, data);

Make sure to load PDF.js and bill-parser-complete.js first!
`);

// Export for browser use
if (typeof window !== 'undefined') {
    window.testBillParser = testBillParser;
    window.testAllBills = testAllBills;
    window.validateExtractedData = validateExtractedData;
    window.compareWithExpected = compareWithExpected;
}

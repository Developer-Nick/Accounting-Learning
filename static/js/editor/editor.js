
// Adding variables from Flask
function ImportVar() {
    console.log("imported_revenue:", imported_revenue);
    console.log("imported_openinginv:", imported_openinginv);
    console.log("imported_purchases:", imported_purchases);
    console.log("imported_purchasesreturns:", imported_purchasesreturns);
    console.log("imported_carriageinwards:", imported_carriageinwards);
    console.log("imported_closinginv:", imported_closinginv);
    console.log("imported_expenses:", imported_expenses);
    console.log("imported_sundryincome:", imported_sundryincome);
    console.log("imported_financecosts:", imported_financecosts);
    console.log("imported_tax:", imported_tax);
    console.log("limitedcompany:", limitedcompany);
    console.log("NCA:", NCA);
    console.log("NCL:", NCL);
    console.log("CA:", CA);
    console.log("CL:", CL);
    console.log("ISC:", ISC);
    console.log("CR:", CR);
    console.log("RR:", RR);
    console.log("openingcapital:", openingcapital);
    console.log("drawings:", drawings);
    console.log("companyoptions:", imported_companyoptions);

    return [
        Number(imported_revenue), 
        Number(imported_openinginv), 
        Number(imported_purchases), 
        Number(imported_purchasesreturns), 
        Number(imported_carriageinwards), 
        Number(imported_closinginv), 
        Number(imported_expenses), 
        Number(imported_sundryincome), 
        Number(imported_financecosts), 
        imported_sundryincome, 
        imported_expenses, 
        Number(imported_tax), 
        Number(limitedcompany), 
        NCA, 
        NCL, 
        CA, 
        CL, 
        ISC, 
        CR, 
        RR, 
        openingcapital, 
        drawings,
        imported_companyoptions
    ];
}

console.log(imported_companyoptions)
console.log("Imported Variables: ", ImportVar());

// Reset table function
function clearTable(tableId) {
    const table = document.getElementById(tableId);
    
    // Check if the table exists and has more than one row
    if (table && table.rows.length > 1) {
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }
}
let currentCompanyId = null;
let currentCompanyName = null;
let currentYear = null;
// Year and Company Dropdown Code
document.addEventListener("DOMContentLoaded", () => {
    // Get the dropdowns
    const companyDropdown = document.getElementById("company-id");
    const yearDropdown = document.getElementById("year");

    // Variables to store the current selections
    currentCompanyId = null;
    currentCompanyName = null;
    currentYear = null;

    // Function to get URL parameters
    function getUrlParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            companyId: params.get('company_id'),
            year: params.get('year')
        };
    }

    const { companyId, year } = getUrlParams();

    // Populate the company dropdown
    imported_companyoptions.forEach(company => {
        const option = document.createElement("option");
        option.value = company[0]; // Company ID
        option.textContent = company[1]; // Company Name
        companyDropdown.appendChild(option);
    });

    // Set default or URL specified values
    let defaultCompanyId = companyId ? parseInt(companyId) : 1;
    let defaultYear = year ? parseInt(year) : null;

    // Find the default company
    const defaultCompany = imported_companyoptions.find(company => company[0] === defaultCompanyId);

    if (defaultCompany) {
        companyDropdown.value = defaultCompanyId;
        populateYears(defaultCompany[2]);

        if (defaultYear && defaultCompany[2].includes(defaultYear)) {
            yearDropdown.value = defaultYear;
        } else {
            yearDropdown.value = defaultCompany[2][defaultCompany[2].length - 1]; // Latest year
        }

        // Set the current selections
        currentCompanyId = defaultCompanyId;
        currentCompanyName = defaultCompany[1];
        currentYear = yearDropdown.value;
    } else {
        console.warn("No matching company found!");
    }

    // Populate the year dropdown on change
    companyDropdown.addEventListener("change", () => {
        const selectedCompanyId = parseInt(companyDropdown.value);
        const selectedCompany = imported_companyoptions.find(company => company[0] === selectedCompanyId);

        if (selectedCompany) {
            populateYears(selectedCompany[2]);

            // Update the current selections
            currentCompanyId = selectedCompanyId;
            currentCompanyName = selectedCompany[1];
            currentYear = yearDropdown.value;
        } else {
            console.warn("No matching company found!");
        }
    });

    // Update the current year on change and reload the page with new parameters
    yearDropdown.addEventListener("change", () => {
        currentYear = yearDropdown.value;
        const newUrl = `http://127.0.0.1:5000/editor?company_id=${currentCompanyId}&year=${currentYear}`;
        window.location.href = newUrl;
    });

    // Function to populate years dropdown
    function populateYears(yearList) {
        // Clear current years
        yearDropdown.innerHTML = "<option value='' disabled selected>Select a year</option>";

        yearList.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            yearDropdown.appendChild(option);
        });

        // Set the current year to the latest year if not already set
        if (!currentYear || !yearList.includes(parseInt(currentYear))) {
            yearDropdown.value = yearList[yearList.length - 1];
            currentYear = yearDropdown.value;
        }
    }
});


// Income Statement
class BaseIncomeStatement {
    constructor(revenue, openinginv, purchases, purchasereturns, carriageinwards, closinginv) {
        this.revenue = revenue;
        this.openinginv = openinginv;
        this.purchases = purchases;
        this.purchasereturns = purchasereturns;
        this.carriageinwards = carriageinwards;
        this.closinginv = closinginv;
        this.costOfSales = 0; // calculated
        this.grossProfit = 0; // calculated
        this.sundryIncomes = []; // must be imported with function
        this.expenses = []; // must be imported with function
        this.totalincome = 0; // calculated
        this.totalexpenditure = 0; // calculated
        this.netProfit = 0; // calculated
        this.calculatedFigures = [];
    }

    calculateCostSales() {
        this.costOfSales = this.openinginv + this.purchases + this.carriageinwards - this.purchasereturns - this.closinginv;
    }

    calculateGrossProfit() {
        this.grossProfit = this.revenue - this.costOfSales;
    }

    calculateNetProfit() {
        this.netProfit = this.grossProfit + this.totalincome - this.totalexpenditure;
    }

    calculateMargins() {
        const grossProfitMargin = (this.grossProfit / this.revenue) * 100;
        const netProfitMargin = (this.netProfit / this.revenue) * 100;

        this.calculatedFigures.push(["Gross Profit Margin", grossProfitMargin]);
        this.calculatedFigures.push(["Net Profit Margin", netProfitMargin]);
    }

    calculateTotalIncomeandExpenses() {
        // Reset totals before calculation
        this.totalexpenditure = 0;
        this.totalincome = 0;

        // Calculate total expenses
        for (let i = 0; i < this.expenses.length; i++) {
            this.totalexpenditure += this.expenses[i][1];
        }

        // Calculate total income
        for (let i = 0; i < this.sundryIncomes.length; i++) {
            this.totalincome += this.sundryIncomes[i][1];
        }
    }

    calculateAllFigures() {
        this.calculateCostSales();
        this.calculateGrossProfit();
        this.calculateTotalIncomeandExpenses();
        this.calculateNetProfit();
        this.calculateMargins();
    }

    addSundryIncome(name, income) {
        this.sundryIncomes.push([name, income]);
    }

    addExpense(name, expense) {
        this.expenses.push([name, expense]);
    }

    PushToTable(ID, description, money1, money2) {
        const table = document.getElementById(ID);

        const newRow = table.insertRow();
        const descriptionCell = newRow.insertCell();
        const money1Cell = newRow.insertCell();
        const money2Cell = newRow.insertCell();

        // Set the content of the cells
        descriptionCell.textContent = description;
        money1Cell.textContent = money1;
        money2Cell.textContent = money2;
    }

    PushtoIncomeStatementTable(ID) {
        this.PushToTable(ID, "Revenue", "", this.revenue);
        this.PushToTable(ID, "Opening Inventory", this.openinginv, "");
        this.PushToTable(ID, "Purchases", this.purchases, "");
        this.PushToTable(ID, "Purchase Returns", this.purchasereturns, "");
        this.PushToTable(ID, "Carriage Inwards", this.carriageinwards, "");
        this.PushToTable(ID, "Closing Inventory", this.closinginv, "");
        this.PushToTable(ID, "Cost of Sales", "", this.costOfSales);
        this.PushToTable(ID, "Gross Profit", "", this.grossProfit);
        
        // Income
        this.PushToTable(ID, "add Sundry Income", "", "");
        for (let i = 0; i < this.sundryIncomes.length; i++) {
            this.PushToTable(ID, this.sundryIncomes[i][0], this.sundryIncomes[i][1], "");
        }
        this.PushToTable(ID, "", "", this.totalincome);

        // Expenses
        this.PushToTable(ID, "less Expenses", "", "");
        for (let i = 0; i < this.expenses.length; i++) {
            this.PushToTable(ID, this.expenses[i][0], this.expenses[i][1], "");
        }
        this.PushToTable(ID, "", "", this.totalexpenditure);
    }

    PushToMarginsTable(ID) {
        const table = document.getElementById(ID);

        for (let i = 0; i < this.calculatedFigures.length; i++) {
            const newRow = table.insertRow();
            const descriptionCell = newRow.insertCell();
            const marginCell = newRow.insertCell();

            // Set the content of the cells
            descriptionCell.textContent = this.calculatedFigures[i][0];
            marginCell.textContent = this.calculatedFigures[i][1];
        }
    }
}

class IncomeStatement extends BaseIncomeStatement {
    constructor(revenue, openinginv, purchases, purchasereturns, carriageinwards, closinginv) {
        super(revenue, openinginv, purchases, purchasereturns, carriageinwards, closinginv);
    }

    calculateAllFigures() {
        super.calculateAllFigures();
    }

    PushtoIncomeStatementTable(ID) {
        super.PushtoIncomeStatementTable(ID);
        this.PushToTable(ID, "Net Profit", "", this.netProfit);
    }
}

class LimitedCompanyIncomeStatement extends BaseIncomeStatement {
    constructor(revenue, openinginv, purchases, purchasereturns, carriageinwards, closinginv, financeCosts, tax) {
        super(revenue, openinginv, purchases, purchasereturns, carriageinwards, closinginv);
        this.financeCosts = financeCosts;
        this.tax = tax;
        this.operatingProfit = 0; // calculated
        this.profitBeforeTax = 0; // calculated
        this.operatingProfitMargin = 0; // calculated
    }

    calculateOperatingProfit() {
        this.operatingProfit = this.grossProfit + this.totalincome - this.totalexpenditure;
    }

    calculateProfitBeforeTax() {
        this.profitBeforeTax = this.operatingProfit - this.financeCosts;
    }

    calculateNetProfit() {
        this.netProfit = this.profitBeforeTax - this.tax;
    }

    calculateMargins() {
        // Clear existing margins to prevent duplication
        this.calculatedFigures = [];
    
        const grossProfitMargin = (this.grossProfit / this.revenue) * 100;
        const netProfitMargin = (this.netProfit / this.revenue) * 100;
        const operatingProfitMargin = (this.operatingProfit / this.revenue) * 100;
    
        this.calculatedFigures.push(["Gross Profit Margin", grossProfitMargin.toFixed(2) + "%"]);
        this.calculatedFigures.push(["Operating Profit Margin", operatingProfitMargin.toFixed(2) + "%"]);
        this.calculatedFigures.push(["Net Profit Margin", netProfitMargin.toFixed(2) + "%"]);
    }
    

    calculateAllFigures() {
        super.calculateAllFigures();
        this.calculateOperatingProfit();
        this.calculateProfitBeforeTax();
        this.calculateNetProfit();
        this.calculateMargins();
    }

    PushtoIncomeStatementTable(ID) {
        super.PushtoIncomeStatementTable(ID);
        this.PushToTable(ID, "Operating Profit", "", this.operatingProfit);
        this.PushToTable(ID, "Finance Costs", "", this.financeCosts);
        this.PushToTable(ID, "Profit Before Tax", "", this.profitBeforeTax);
        this.PushToTable(ID, "Tax", "", this.tax);
        this.PushToTable(ID, "Net Profit", "", this.netProfit);
    }
}


// Statement of Financial Position
class StatementOfFinancialPositionBase {
    constructor() {
        this.nonCurrentAssets = [];
        this.currentAssets = [];
        this.currentLiabilities = [];
        this.nonCurrentLiabilities = [];
        this.totalNCA = 0; // calculated
        this.totalCA = 0; // calculated
        this.totalCL = 0; // calculated
        this.totalNCL = 0; // calculated
        this.totalAssets = 0; // calculated
        this.totalLiabilities = 0; // calculated
        this.netCurrentAssets = 0; // calculated
        this.netAssets = 0; // calculated
        this.margins = [];
    }

    PushToTable(ID, description, money1, money2, money3) {
        const table = document.getElementById(ID);

        const newRow = table.insertRow();
        const descriptionCell = newRow.insertCell();
        const money1Cell = newRow.insertCell();
        const money2Cell = newRow.insertCell();
        const money3Cell = newRow.insertCell();

        // Set the content of the cells
        descriptionCell.textContent = description;
        money1Cell.textContent = money1;
        money2Cell.textContent = money2;
        money3Cell.textContent = money3;
    }

    PushToTableBold(ID, description, money1, money2, money3) {
        const table = document.getElementById(ID);

        const newRow = table.insertRow();
        const descriptionCell = newRow.insertCell();
        const money1Cell = newRow.insertCell();
        const money2Cell = newRow.insertCell();
        const money3Cell = newRow.insertCell();

        // Set the content of the cells
        descriptionCell.innerHTML = "<b>" + description + "</b>";
        money1Cell.innerHTML = "<b>" + money1 + "</b>";
        money2Cell.innerHTML = "<b>" + money2 + "</b>";
        money3Cell.innerHTML = "<b>" + money3 + "</b>";
    }

    addNCA(name, cprice, depr, nbv) {
        this.nonCurrentAssets.push([name, cprice, depr, nbv]);
    }

    addCA(name, value) {
        this.currentAssets.push([name, value]);
    }

    addCL(name, value) {
        this.currentLiabilities.push([name, value]);
    }

    addNCL(name, value) {
        this.nonCurrentLiabilities.push([name, value]);
    }

    calculateTotals() {
        this.totalNCA = 0;
        this.totalCA = 0;
        this.totalCL = 0;
        this.totalNCL = 0;

        for (let i = 0; i < this.nonCurrentAssets.length; i++) {
            this.totalNCA += this.nonCurrentAssets[i][3];
        }

        for (let i = 0; i < this.currentAssets.length; i++) {
            this.totalCA += this.currentAssets[i][1];
        }

        for (let i = 0; i < this.currentLiabilities.length; i++) {
            this.totalCL += this.currentLiabilities[i][1];
        }

        for (let i = 0; i < this.nonCurrentLiabilities.length; i++) {
            this.totalNCL += this.nonCurrentLiabilities[i][1];
        }

        this.totalAssets = this.totalNCA + this.totalCA;
        this.totalLiabilities = this.totalNCL + this.totalCL;
        this.netCurrentAssets = this.totalCA - this.totalCL;
        this.netAssets = this.totalAssets - this.totalLiabilities;

        const currentratio = this.totalCA / this.totalCL;
        const quickratio = (this.totalCA - (this.currentAssets.find(asset => asset[0] === "Inventory") ? this.currentAssets.find(asset => asset[0] === "Inventory")[1] : 0)) / this.totalCL;

        this.margins.push(["Current Ratio", currentratio]).toFixed(2);
        this.margins.push(["Quick Ratio", quickratio]).toFixed(2);
    }

    PushtoSofpTable(ID) {
        //NCAs
        this.PushToTableBold(ID, "Non-Current Assets", "Cost Price", "Depreciation", "Net Book Value")
        for (let i = 0; i < this.nonCurrentAssets.length; i++) {
            this.PushToTable(ID, (this.nonCurrentAssets[i][0]), this.nonCurrentAssets[i][1], this.nonCurrentAssets[i][2], this.nonCurrentAssets[i][3]);
        }

        this.PushToTable(ID, "", "", "", this.totalNCA);

        //CAs
        this.PushToTableBold(ID, "Current Assets", "", "", "")
        console.log(CA);
        for (let i = 0; i < this.currentAssets.length; i++) {
            this.PushToTable(ID, (this.currentAssets[i][0]), "", this.currentAssets[i][1], "", "");
        }
        this.PushToTableBold(ID, "", "", this.totalCA, "");

        //CLs
        this.PushToTableBold(ID, "Current Liabilities", "", "", "")
        for (let i = 0; i < this.currentLiabilities.length; i++) {
            this.PushToTable(ID, (this.currentLiabilities[i][0]), this.currentLiabilities[i][1], "", "", "");
        }
        this.PushToTableBold(ID, "", "", "(" + this.totalCL + ")", "");

        //Net current assets
        this.PushToTableBold(ID, "Net Current Assets", "", "", this.netCurrentAssets)

        this.PushToTable(ID, "", "", "", this.netCurrentAssets + this.totalNCA)

        //NCLs
        this.PushToTableBold(ID, "Non-Current Liabilities", "", "", "")
        for (let i = 0; i < this.nonCurrentLiabilities.length; i++) {
            this.PushToTable(ID, (this.nonCurrentLiabilities[i][0]), "", this.nonCurrentLiabilities[i][1], "");
        }
        this.PushToTable(ID, "", "", "", this.totalNCL);

        //Net Assets
        this.PushToTableBold(ID, "Net Assets", "", "", this.netAssets)
    }

    PushToMarginsTable(ID) {
        const table = document.getElementById(ID);

        for (let i = 0; i < this.margins.length; i++) {
            const newRow = table.insertRow();
            const descriptionCell = newRow.insertCell();
            const marginCell = newRow.insertCell();

            // Set the content of the cells
            descriptionCell.textContent = this.margins[i][0];
            marginCell.textContent = this.margins[i][1];
        }
    }
}

class StatementOfFinancialPosition extends StatementOfFinancialPositionBase {
    constructor(openingcapital, netProfit, drawings) {
        super();
        this.openingcapital = openingcapital;
        this.netProfit = netProfit;
        this.drawings = drawings;
        this.closingcapital = 0; // calculated
    }

    addUp() {
        this.calculateTotals();
        // Ensure values are numbers
        this.openingcapital = Number(this.openingcapital);
        this.netProfit = Number(this.netProfit);
        this.drawings = Number(this.drawings);

        // Calculate closing capital
        this.closingcapital = this.openingcapital + this.netProfit - this.drawings;

        // Format closing capital to avoid unnecessary decimals
        this.closingcapital = this.closingcapital.toFixed(2);
    }

    PushtoSofpTable(ID) {
        super.PushtoSofpTable(ID);

        //Financed By 
        this.PushToTableBold(ID, "Financed By", "", "", "")
        this.PushToTable(ID, "Opening Capital", "", "", this.openingcapital);
        this.PushToTable(ID, "Net Profit", "", "", this.netProfit);
        this.PushToTable(ID, "Drawings", "", "", "(" + this.drawings + ")");
        this.PushToTableBold(ID, "Closing Capital", "", "", this.closingcapital);
    }
}

class LimitedCompanyStatementOfFinancialPosition extends StatementOfFinancialPositionBase {
    constructor() {
        super();
        this.issuedShareCapital = [];
        this.capitalReserve = [];
        this.revenueReserve = [];
        this.totalIssuedShareCapital = 0; // calculated
        this.totalCapitalReserve = 0; // calculated
        this.totalRevenueReserve = 0; // calculated
        this.totalEquity = 0; // calculated
    }

    addIssuedShareCapital(name, value) {
        this.issuedShareCapital.push([name, value]);
    }

    addCapitalReserve(name, value) {
        this.capitalReserve.push([name, value]);
    }

    addRevenueReserve(name, value) {
        this.revenueReserve.push([name, value]);
    }

    addUp() {
        this.calculateTotals();

        this.totalIssuedShareCapital = this.issuedShareCapital.reduce((total, item) => total + item[1], 0);
        this.totalCapitalReserve = this.capitalReserve.reduce((total, item) => total + item[1], 0);
        this.totalRevenueReserve = this.revenueReserve.reduce((total, item) => total + item[1], 0);
        this.totalEquity = this.totalIssuedShareCapital + this.totalCapitalReserve + this.totalRevenueReserve;
    }

    PushtoSofpTable(ID) {
        super.PushtoSofpTable(ID);
    
        //Equity
        this.PushToTableBold(ID, "EQUITY", "", "", "")
        // Issued Share Capital
        this.PushToTableBold(ID, "Issued Share Capital", "", "", "")
        if (this.issuedShareCapital.length > 1) {
            for (let i = 0; i < this.issuedShareCapital.length; i++) {
                this.PushToTable(ID, this.issuedShareCapital[i][0], "", this.issuedShareCapital[i][1], "");
            }
            this.PushToTable(ID, "", "", "", this.totalIssuedShareCapital)
        } else if (this.issuedShareCapital.length == 1) {
            this.PushToTable(ID, this.issuedShareCapital[0][0], "", "", this.issuedShareCapital[0][1]);
        }

        // Capital Reserve
        this.PushToTableBold(ID, "Capital Reserve", "", "", "")
        if (this.capitalReserve.length > 1) {
            for (let i = 0; i < this.capitalReserve.length; i++) {
                this.PushToTable(ID, this.capitalReserve[i][0], "", this.capitalReserve[i][1], "");
            }
            this.PushToTable(ID, "", "", "", this.totalCapitalReserve)
        } else if (this.capitalReserve.length == 1) {
            this.PushToTable(ID, this.capitalReserve[0][0], "", "", this.capitalReserve[0][1]);
        }
        
        // Revenue Reserve
        this.PushToTableBold(ID, "Revenue Reserve", "", "", "")
        if (this.revenueReserve.length > 1) {
            for (let i = 0; i < this.revenueReserve.length; i++) {
                this.PushToTable(ID, this.revenueReserve[i][0], "", this.revenueReserve[i][1], "");
            }
            this.PushToTable(ID, "", "", "", this.totalRevenueReserve)
        } else if (this.revenueReserve.length == 1) {
            this.PushToTable(ID, this.revenueReserve[0][0], "", "", this.revenueReserve[0][1]);
        }

        this.PushToTableBold(ID, "TOTAL EQUITY", "", "", this.totalEquity)
    }
}
    
let incomeStatement;
let sofp;

// Produce the financial statements
function ProduceStatement() {
	// Clear tables
	clearTable('IncomeStm');
	clearTable('SofpTable');
	clearTable('MarginsTable');


	//Income Statement
	if (Number(limitedcompany) == 0) {
		incomeStatement = new IncomeStatement(
			Number(imported_revenue),
			Number(imported_openinginv),
			Number(imported_purchases),
			Number(imported_purchasesreturns),
			Number(imported_carriageinwards),
			Number(imported_closinginv)
		);
	} else {
		incomeStatement = new LimitedCompanyIncomeStatement(
			Number(imported_revenue),
			Number(imported_openinginv),
			Number(imported_purchases),
			Number(imported_purchasesreturns),
			Number(imported_carriageinwards),
			Number(imported_closinginv),
			Number(imported_financecosts),
			Number(imported_tax)
		);
	}

	for (let i = 0; i < imported_sundryincome.length; i++) {
		incomeStatement.addSundryIncome(imported_sundryincome[i][0], imported_sundryincome[i][1]);
	}

	for (let i = 0; i < imported_expenses.length; i++) {
		incomeStatement.addExpense(imported_expenses[i][0], imported_expenses[i][1]);
	}

	incomeStatement.calculateAllFigures();
	incomeStatement.PushtoIncomeStatementTable("IncomeStm");
	incomeStatement.PushToMarginsTable("MarginsTable");
	

    // Sofp
	if (Number(limitedcompany) == 1) { 
		sofp = new LimitedCompanyStatementOfFinancialPosition();
        
		for (let i = 0; i < ISC.length; i++) {
			sofp.addIssuedShareCapital(ISC[i][0], ISC[i][1]);
		}

		for (let i = 0; i < CR.length; i++) {
			sofp.addCapitalReserve(CR[i][0], CR[i][1]);
		}

		for (let i = 0; i < RR.length; i++) {
			sofp.addRevenueReserve(RR[i][0], RR[i][1]);
		}
	} else {
		sofp = new StatementOfFinancialPosition(openingcapital, incomeStatement.netProfit, drawings);
	}

	for (let i = 0; i < NCA.length; i++) {
		sofp.addNCA(NCA[i][0], NCA[i][1], NCA[i][2], NCA[i][3]);
	}

	for (let i = 0; i < CA.length; i++) {
		sofp.addCA(CA[i][0], CA[i][1]);
	}

	for (let i = 0; i < CL.length; i++) {
		sofp.addCL(CL[i][0], CL[i][1]);
	}

	for (let i = 0; i < NCL.length; i++) {
		sofp.addNCL(NCL[i][0], NCL[i][1]);
	}


	sofp.addUp();
	sofp.PushtoSofpTable("SofpTable");
	sofp.PushToMarginsTable("MarginsTable");
}

ProduceStatement()


// Edit functions
function edit_addexpense() {
    let name = prompt("Enter the name of the expense:");
    let value = prompt("Enter the value of the expense:");
  
    value = parseFloat(value);
  
    if (name && !isNaN(value)) {
      imported_expenses.push([name, value]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and value.");
    }
}
document.getElementById("addexpense").addEventListener("click", edit_addexpense);

function edit_addincome() {
    let incomeName = prompt("Enter the name of the expense:");
    let incomeAmount = prompt("Enter the amount of the expense:");
  
    incomeAmount = parseFloat(incomeAmount);
  
    if (incomeName && !isNaN(incomeAmount)) {
      imported_sundryincome.push([incomeName, incomeAmount]);
      console.log("Sundry Income added:", { name: incomeName, amount: incomeAmount });
      // Produce the statement again to refresh the table
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and amount.");
    }
}
document.getElementById("addincome").addEventListener("click", edit_addincome);

function edit_removeexpense() {
    let expenseName = prompt("Enter the name of the expense:");
    if (expenseName) {
        let index = imported_expenses.findIndex(expense => expense[0] === expenseName);
        if (index !== -1) {
            imported_expenses.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Expense not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeexpense").addEventListener("click", edit_removeexpense);

function edit_removeincome() {
    let incomeName = prompt("Enter the name of the income:");
    if (incomeName) {
        let index = imported_sundryincome.findIndex(income => income[0] === incomeName);
        if (index !== -1) {
            imported_sundryincome.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Income not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeincome").addEventListener("click", edit_removeincome);

function edit_figure() {
    let name = prompt("Enter the name of the entry:");
    let amount = prompt("Enter the amount:");
    name = name.toLowerCase();
    amount = parseFloat(amount);
  
    if (name && !isNaN(amount)) {
      if (name == "revenue") {
        imported_revenue = amount;
      } else if (name == "opening inventory") {
        imported_openinginv = amount;
      } else if (name == "purchases") {
        imported_purchases = amount;
      } else if (name == "purchases returns") {
        imported_purchasesreturns = amount;
      } else if (name == "carriage inwards") {
        imported_carriageinwards = amount;
      } else if (name == "closing inventory") {
        imported_closinginv = amount;
      } else if (name == "finance costs") {
        imported_financecosts = amount;
      } else if (name == "tax") {
        imported_tax = amount;
      } else if (name == "capital") {
        openingcapital = amount;
      } else if (name == "drawings") {
        drawings = amount;
      } else if (name == "opening capital") {
        openingcapital = amount;
      } else if (name == "drawings") {
        drawings = amount;
      } else {
        alert("Invalid input. Please enter a valid name.");
    }
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and amount.");
    }
}
document.getElementById("editfigure").addEventListener("click", edit_figure);
document.getElementById("editfigure2").addEventListener("click", edit_figure);

function edit_addNCA() {
    let name = prompt("Enter the name of the asset:");
    let cprice = prompt("Enter the cost price of the asset:");
    let depr = prompt("Enter the depreciation of the asset:");
  
    cprice = parseFloat(cprice);
    depr = parseFloat(depr);
    nbv = parseFloat(cprice - depr);
  
    if (name && !isNaN(cprice) && !isNaN(depr) && !isNaN(nbv)) {
      NCA.push([name, cprice, depr, nbv]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name, cost price, depreciation, and net book value.");
    }
}
document.getElementById("addNCA").addEventListener("click", edit_addNCA);

function edit_removeNCA() {
    let name = prompt("Enter the name of the asset:");
    if (name) {
        let index = NCA.findIndex(asset => asset[0] === name);
        if (index !== -1) {
            NCA.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Asset not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeNCA").addEventListener("click", edit_removeNCA);

function edit_addCA() {
    let name = prompt("Enter the name of the asset:");
    let value = prompt("Enter the value of the asset:");
  
    value = parseFloat(value);
  
    if (name && !isNaN(value)) {
      CA.push([name, value]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and value.");
    }
}
document.getElementById("addCA").addEventListener("click", edit_addCA);

function edit_removeCA() {
    let name = prompt("Enter the name of the asset:");
    if (name) {
        let index = CA.findIndex(asset => asset[0] === name);
        if (index !== -1) {
            CA.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Asset not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeCA").addEventListener("click", edit_removeCA);

function edit_addCL() {
    let name = prompt("Enter the name of the liability:");
    let value = prompt("Enter the value of the liability:");
  
    value = parseFloat(value);
  
    if (name && !isNaN(value)) {
      CL.push([name, value]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and value.");
    }
}
document.getElementById("addCL").addEventListener("click", edit_addCL);

function edit_removeCL() {
    let name = prompt("Enter the name of the liability:");
    if (name) {
        let index = CL.findIndex(liability => liability[0] === name);
        if (index !== -1) {
            CL.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Liability not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeCL").addEventListener("click", edit_removeCL);

function edit_addNCL() {
    let name = prompt("Enter the name of the liability:");
    let value = prompt("Enter the value of the liability:");
  
    value = parseFloat(value);
  
    if (name && !isNaN(value)) {
      NCL.push([name, value]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and value.");
    }
}
document.getElementById("addNCL").addEventListener("click", edit_addNCL);

function edit_removeNCL() {
    let name = prompt("Enter the name of the liability:");
    if (name) {
        let index = NCL.findIndex(liability => liability[0] === name);
        if (index !== -1) {
            NCL.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Liability not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeNCL").addEventListener("click", edit_removeNCL);

function edit_addISC() {
    let name = prompt("Enter the name of the share capital:");
    let value = prompt("Enter the value of the share capital:");
  
    value = parseFloat(value);
  
    if (name && !isNaN(value)) {
      ISC.push([name, value]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and value.");
    }
}
document.getElementById("addISC").addEventListener("click", edit_addISC);

function edit_removeISC() {
    let name = prompt("Enter the name of the share capital:");
    if (name) {
        let index = ISC.findIndex(capital => capital[0] === name);
        if (index !== -1) {
            ISC.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Share capital not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeISC").addEventListener("click", edit_removeISC);

function edit_addCR() {
    let name = prompt("Enter the name of the capital reserve:");
    let value = prompt("Enter the value of the capital reserve:");
  
    value = parseFloat(value);
  
    if (name && !isNaN(value)) {
      CR.push([name, value]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and value.");
    }
}
document.getElementById("addCR").addEventListener("click", edit_addCR);

function edit_removeCR() {
    let name = prompt("Enter the name of the capital reserve:");
    if (name) {
        let index = CR.findIndex(reserve => reserve[0] === name);
        if (index !== -1) {
            CR.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Capital reserve not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeCR").addEventListener("click", edit_removeCR);

function edit_addRR() {
    let name = prompt("Enter the name of the revenue reserve:");
    let value = prompt("Enter the value of the revenue reserve:");
  
    value = parseFloat(value);
  
    if (name && !isNaN(value)) {
      RR.push([name, value]);
      ProduceStatement();
    } else {
      alert("Invalid input. Please enter a valid name and value.");
    }
}
document.getElementById("addRR").addEventListener("click", edit_addRR);

function edit_removeRR() {
    let name = prompt("Enter the name of the revenue reserve:");
    if (name) {
        let index = RR.findIndex(reserve => reserve[0] === name);
        if (index !== -1) {
            RR.splice(index, 1);
            ProduceStatement();
        } else {
            alert("Revenue reserve not found.");
        }
    } else {
        alert("Invalid input. Please enter a valid name.");
    }
}
document.getElementById("removeRR").addEventListener("click", edit_removeRR);

function islimitedcompany() {
    if (this.checked) {
        limitedcompany = 1;
        document.getElementById("addISC").style.display = "inline";
        document.getElementById("addCR").style.display = "inline";
        document.getElementById("addRR").style.display = "inline";
        document.getElementById("removeISC").style.display = "inline";
        document.getElementById("removeCR").style.display = "inline";
        document.getElementById("removeRR").style.display = "inline";
    } else {
        limitedcompany = 0;
        document.getElementById("addISC").style.display = "none";
        document.getElementById("addCR").style.display = "none";
        document.getElementById("addRR").style.display = "none";
        document.getElementById("removeISC").style.display = "none";
        document.getElementById("removeCR").style.display = "none";
        document.getElementById("removeRR").style.display = "none";
    }
    ProduceStatement();
};
document.getElementById("limitedCompanyCheckbox").addEventListener("change", islimitedcompany);
islimitedcompany();

function newCompany() {
    let name = prompt("Enter the name of the company:");
    let year = prompt("Enter the year of the financial statement:");
  
    if (name && year) {
        let newUrl = window.location.href;
        newUrl += `&newcompanyname=${name}&newyear=${year}`;
        window.location.href = newUrl;
    } else {
        alert("Invalid input. Please enter a valid name and year.");
    }
}
document.getElementById("newcompany").addEventListener("click", newCompany);

function newYear() {
    let year = prompt("Enter the year of the financial statement:");
  
    if (year) {
        let newUrl = window.location.href;
        newUrl += `&addednewyear=${year}`;
        window.location.href = newUrl;
    } else {
        alert("Invalid input. Please enter a valid year.");
    }
}
document.getElementById("newyear").addEventListener("click", newYear);

function savestatement() {
    let newUrl = window.location.href;
    newUrl = "http://127.0.0.1:5000/alterstatement?&revenue=" + imported_revenue + "&openinginv=" + imported_openinginv + "&purchases=" + imported_purchases + "&purchasesreturns=" + imported_purchasesreturns + "&carriageinwards=" + imported_carriageinwards + "&closinginv=" + imported_closinginv + "&financecosts=" + imported_financecosts + "&tax=" + imported_tax + "&ISC=" + JSON.stringify(ISC) + "&CR=" + JSON.stringify(CR) + "&RR=" + JSON.stringify(RR) + "&NCA=" + JSON.stringify(NCA) + "&CA=" + JSON.stringify(CA) + "&CL=" + JSON.stringify(CL) + "&NCL=" + JSON.stringify(NCL) + "&sundryincome=" + JSON.stringify(imported_sundryincome) + "&expenses=" + JSON.stringify(imported_expenses) + "&limitedcompany=" + limitedcompany + "&openingcapital=" + openingcapital + "&drawings=" + drawings + "&companyid=" + currentCompanyId + "&year=" + currentYear;

    console.log("Constructed URL: ", newUrl);

    window.location.href = newUrl;
}
document.getElementById("save").addEventListener("click", savestatement);

function deleteyear() {
    let newUrl = window.location.href;
    newUrl = "http://127.0.0.1:5000/editor?&deleteyear=" + currentYear + "&deletecompanyid=" + currentCompanyId;
    window.location.href = newUrl;
}
document.getElementById("deleteyear").addEventListener("click", deleteyear);

function deletecompany() {
    let newUrl = window.location.href;
    newUrl = "http://127.0.0.1:5000/editor?&deletecompany=" + currentCompanyId;
    window.location.href = newUrl;
}
document.getElementById("deletecompany").addEventListener("click", deletecompany);
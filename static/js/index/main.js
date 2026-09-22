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

// Year and Company Dropdown Code
document.addEventListener("DOMContentLoaded", () => {
    // Get the dropdowns
    const companyDropdown = document.getElementById("company-id");
    const yearDropdown = document.getElementById("year");

    // Variables to store the current selections
    let currentCompanyId = null;
    let currentCompanyName = null;
    let currentYear = null;

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
        const newUrl = `http://127.0.0.1:5000/?company_id=${currentCompanyId}&year=${currentYear}`;
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
        const grossProfitMargin = ((this.grossProfit / this.revenue) * 100).toFixed(2);
        const netProfitMargin = ((this.netProfit / this.revenue) * 100).toFixed(2);

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

        const currentratio = (this.totalCA / this.totalCL).toFixed(2);;
        const quickratio = ((this.totalCA - (this.currentAssets.find(asset => asset[0] === "Inventory") ? this.currentAssets.find(asset => asset[0] === "Inventory")[1] : 0)) / this.totalCL).toFixed(2);;

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
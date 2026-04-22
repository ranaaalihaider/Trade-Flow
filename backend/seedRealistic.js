require('dotenv').config();
const mongoose = require('mongoose');

const Business = require('./models/Business');
const User = require('./models/User');
const Company = require('./models/Company');
const Category = require('./models/Category');
const Item = require('./models/Item');
const Sector = require('./models/Sector');
const Route = require('./models/Route');
const Salesman = require('./models/Salesman');
const Supplier = require('./models/Supplier');
const Customer = require('./models/Customer');
const Purchase = require('./models/Purchase');
const Sale = require('./models/Sale');
const Account = require('./models/Account');
const Ledger = require('./models/Ledger');
const Stock = require('./models/Stock');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/tradeflow');
        console.log('MongoDB Connected for Realistic Seeding...');

        // 1. Wipe Data (Except SuperAdmin)
        await Business.deleteMany();
        await User.deleteMany({ role: { $ne: 'SuperAdmin' } });
        await Company.deleteMany();
        await Category.deleteMany();
        await Item.deleteMany();
        await Sector.deleteMany();
        await Route.deleteMany();
        await Salesman.deleteMany();
        await Supplier.deleteMany();
        await Customer.deleteMany();
        await Purchase.deleteMany();
        await Sale.deleteMany();
        await Account.deleteMany();
        await Ledger.deleteMany();
        await Stock.deleteMany();
        
        console.log('Cleared existing data.');

        // 2. Create Business
        const business = await Business.create({
            name: 'TradeFlow National Distributors',
            address: 'Main Industrial Estate, Karachi',
            contactPhone: '021-111-222-333'
        });
        const bid = business._id;

        // 3. Create Accounts
        const bankAccount = await Account.create({ businessId: bid, name: 'HBL Main Account', type: 'Bank', accountNumber: '001122334455', balance: 500000 });
        const cashAccount = await Account.create({ businessId: bid, name: 'Main Cash Register', type: 'Cash', balance: 100000 });

        // 4. Create Companies
        const cCoke = await Company.create({ businessId: bid, name: 'Coca Cola Agency', description: 'Beverages and Juices' });
        const cVital = await Company.create({ businessId: bid, name: 'Vital Group', description: 'Tea and Soap products' });
        const cDalda = await Company.create({ businessId: bid, name: 'Dalda Foods', description: 'Cooking Oil and Banaspati' });

        // 5. Create Categories
        const catCokeBev = await Category.create({ businessId: bid, name: 'Carbonated Drinks', companyId: cCoke._id });
        const catCokeWater = await Category.create({ businessId: bid, name: 'Mineral Water', companyId: cCoke._id });
        const catVitalTea = await Category.create({ businessId: bid, name: 'Black Tea', companyId: cVital._id });
        const catDaldaOil = await Category.create({ businessId: bid, name: 'Canola Oil', companyId: cDalda._id });

        // 6. Create Items
        const iCoke15 = await Item.create({
            businessId: bid, companyId: cCoke._id, categoryId: catCokeBev._id,
            name: 'Coca Cola 1.5L', sku: 'CC-1500-REG',
            units: { carton: { quantityPerCarton: 6 }, box: { quantityPerCarton: 1, quantityPerBox: 6 }, piece: { quantityPerBox: 1 } },
            prices: { purchasePrice: 150, sellingPricePiece: 180, sellingPriceBox: 180, sellingPriceCarton: 1000 }
        });

        const iSprite500 = await Item.create({
            businessId: bid, companyId: cCoke._id, categoryId: catCokeBev._id,
            name: 'Sprite 500ml', sku: 'SP-500-REG',
            units: { carton: { quantityPerCarton: 12 }, box: { quantityPerCarton: 1, quantityPerBox: 12 }, piece: { quantityPerBox: 1 } },
            prices: { purchasePrice: 70, sellingPricePiece: 90, sellingPriceBox: 90, sellingPriceCarton: 1000 }
        });

        const iVital800 = await Item.create({
            businessId: bid, companyId: cVital._id, categoryId: catVitalTea._id,
            name: 'Vital Danedar 800g', sku: 'VT-800-DAN',
            units: { carton: { quantityPerCarton: 12 }, box: { quantityPerCarton: 1, quantityPerBox: 12 }, piece: { quantityPerBox: 1 } },
            prices: { purchasePrice: 850, sellingPricePiece: 950, sellingPriceBox: 950, sellingPriceCarton: 11000 }
        });

        const iDalda5L = await Item.create({
            businessId: bid, companyId: cDalda._id, categoryId: catDaldaOil._id,
            name: 'Dalda Canola Oil 5L Tin', sku: 'DL-5L-CAN',
            units: { carton: { quantityPerCarton: 4 }, box: { quantityPerCarton: 1, quantityPerBox: 4 }, piece: { quantityPerBox: 1 } },
            prices: { purchasePrice: 2400, sellingPricePiece: 2600, sellingPriceBox: 2600, sellingPriceCarton: 10200 }
        });

        // Initialize empty stock for all items
        await Stock.create({ businessId: bid, itemId: iCoke15._id, quantity: 0 });
        await Stock.create({ businessId: bid, itemId: iSprite500._id, quantity: 0 });
        await Stock.create({ businessId: bid, itemId: iVital800._id, quantity: 0 });
        await Stock.create({ businessId: bid, itemId: iDalda5L._id, quantity: 0 });

        // 7. Create Geography
        const secNorth = await Sector.create({ businessId: bid, name: 'North Zone' });
        const secSouth = await Sector.create({ businessId: bid, name: 'South Zone' });
        const routeA = await Route.create({ businessId: bid, name: 'Tariq Road', sectorId: secNorth._id });
        const routeB = await Route.create({ businessId: bid, name: 'DHA Phase 6', sectorId: secSouth._id });

        // 8. Create Salesmen
        const uSales1 = await User.create({ name: 'Ali Khan', email: 'ali@tradeflow.com', password: 'password123', role: 'Salesman', businessId: bid });
        const sSales1 = await Salesman.create({ businessId: bid, userId: uSales1._id, routes: [routeA._id] });

        // 9. Create Suppliers
        const supCoke = await Supplier.create({ businessId: bid, name: 'Coca Cola Beverages Pakistan', contactPhone: '111-222-333', address: 'SITE Area', openingBalance: 0 });
        const supVital = await Supplier.create({ businessId: bid, name: 'Vital Group of Companies', contactPhone: '111-222-444', address: 'Korangi Industrial', openingBalance: 0 });
        const supDalda = await Supplier.create({ businessId: bid, name: 'Dalda Foods Ltd', contactPhone: '111-222-555', address: 'Port Qasim', openingBalance: 0 });

        // 10. Create Customers
        const cust1 = await Customer.create({ businessId: bid, name: 'Imtiaz Super Market', contactPhone: '0300-1111111', address: 'Tariq Road', routeId: routeA._id, openingBalance: 0 });
        const cust2 = await Customer.create({ businessId: bid, name: 'Bismillah General Store', contactPhone: '0300-2222222', address: 'DHA Phase 6', routeId: routeB._id, openingBalance: 0 });

        console.log('Master data created. Simulating transactions...');

        // --- SIMULATING PURCHASES ---
        
        // Purchase 1: Coke items
        const pur1Items = [
            { itemId: iCoke15._id, unit: 'Carton', quantity: 100, baseQuantity: 600, price: 900, total: 90000 },
            { itemId: iSprite500._id, unit: 'Carton', quantity: 50, baseQuantity: 600, price: 840, total: 42000 }
        ];
        const pur1Total = 132000;
        const pur1 = await Purchase.create({ businessId: bid, supplierId: supCoke._id, date: new Date(Date.now() - 86400000 * 5), invoiceNumber: 'INV-PUR-001', items: pur1Items, totalAmount: pur1Total, status: 'Completed' });
        
        // Update stock & ledger
        await Stock.updateOne({ itemId: iCoke15._id }, { $inc: { quantity: 600 } });
        await Stock.updateOne({ itemId: iSprite500._id }, { $inc: { quantity: 600 } });
        await Ledger.create({ accountId: supCoke._id, accountModel: 'Supplier', transactionId: pur1._id, transactionType: 'Purchase', type: 'CREDIT', amount: pur1Total, balanceAfter: pur1Total, description: 'Purchase Invoice: INV-PUR-001', date: pur1.date, businessId: bid });

        // Purchase 2: Vital
        const pur2Items = [{ itemId: iVital800._id, unit: 'Carton', quantity: 50, baseQuantity: 600, price: 10200, total: 510000 }];
        const pur2Total = 510000;
        const pur2 = await Purchase.create({ businessId: bid, supplierId: supVital._id, date: new Date(Date.now() - 86400000 * 4), invoiceNumber: 'INV-PUR-002', items: pur2Items, totalAmount: pur2Total, status: 'Completed' });
        
        await Stock.updateOne({ itemId: iVital800._id }, { $inc: { quantity: 600 } });
        await Ledger.create({ accountId: supVital._id, accountModel: 'Supplier', transactionId: pur2._id, transactionType: 'Purchase', type: 'CREDIT', amount: pur2Total, balanceAfter: pur2Total, description: 'Purchase Invoice: INV-PUR-002', date: pur2.date, businessId: bid });

        // Purchase 3: Dalda
        const pur3Items = [{ itemId: iDalda5L._id, unit: 'Carton', quantity: 200, baseQuantity: 800, price: 9600, total: 1920000 }];
        const pur3Total = 1920000;
        const pur3 = await Purchase.create({ businessId: bid, supplierId: supDalda._id, date: new Date(Date.now() - 86400000 * 3), invoiceNumber: 'INV-PUR-003', items: pur3Items, totalAmount: pur3Total, status: 'Completed' });
        
        await Stock.updateOne({ itemId: iDalda5L._id }, { $inc: { quantity: 800 } });
        await Ledger.create({ accountId: supDalda._id, accountModel: 'Supplier', transactionId: pur3._id, transactionType: 'Purchase', type: 'CREDIT', amount: pur3Total, balanceAfter: pur3Total, description: 'Purchase Invoice: INV-PUR-003', date: pur3.date, businessId: bid });

        // --- SIMULATING SALES ---

        // Add 3 more customers for realistic coverage
        const cust3 = await Customer.create({ businessId: bid, name: 'Al-Fatah Departmental Store', contactPhone: '0321-3333333', address: 'Gulshan-e-Iqbal', routeId: routeA._id, openingBalance: 0 });
        const cust4 = await Customer.create({ businessId: bid, name: 'Metro Cash & Carry', contactPhone: '0322-4444444', address: 'Shahrah-e-Faisal', routeId: routeB._id, openingBalance: 0 });
        const cust5 = await Customer.create({ businessId: bid, name: 'Agha Supermarket', contactPhone: '0333-5555555', address: 'Defence Phase 5', routeId: routeB._id, openingBalance: 0 });

        // --- Sale 1: Imtiaz Super Market ---
        // Purchases: 100 ctn Coke, 50 ctn Sprite — sell 10 ctn Coke + 50 ctn Dalda
        const sale1Items = [
            { itemId: iCoke15._id, unit: 'Carton', quantity: 10, baseQuantity: 60, price: 1000, total: 10000 },
            { itemId: iDalda5L._id, unit: 'Carton', quantity: 50, baseQuantity: 200, price: 10200, total: 510000 }
        ];
        const sale1Total = 520000;
        const sale1 = await Sale.create({ businessId: bid, customerId: cust1._id, salesmanId: sSales1._id, date: new Date(Date.now() - 86400000 * 4), invoiceNumber: 'INV-SAL-001', items: sale1Items, totalAmount: sale1Total, status: 'Completed' });
        await Stock.updateOne({ itemId: iCoke15._id }, { $inc: { quantity: -60 } });
        await Stock.updateOne({ itemId: iDalda5L._id }, { $inc: { quantity: -200 } });
        await Ledger.create({ accountId: cust1._id, accountModel: 'Customer', transactionId: sale1._id, transactionType: 'Sale', type: 'DEBIT', amount: sale1Total, balanceAfter: sale1Total, description: 'Sale Invoice: INV-SAL-001', date: sale1.date, businessId: bid });

        // --- Sale 2: Bismillah General Store ---
        const sale2Items = [
            { itemId: iVital800._id, unit: 'Carton', quantity: 5, baseQuantity: 60, price: 11000, total: 55000 },
            { itemId: iSprite500._id, unit: 'Piece', quantity: 24, baseQuantity: 24, price: 90, total: 2160 }
        ];
        const sale2Total = 57160;
        const sale2 = await Sale.create({ businessId: bid, customerId: cust2._id, salesmanId: sSales1._id, date: new Date(Date.now() - 86400000 * 3), invoiceNumber: 'INV-SAL-002', items: sale2Items, totalAmount: sale2Total, status: 'Completed' });
        await Stock.updateOne({ itemId: iVital800._id }, { $inc: { quantity: -60 } });
        await Stock.updateOne({ itemId: iSprite500._id }, { $inc: { quantity: -24 } });
        await Ledger.create({ accountId: cust2._id, accountModel: 'Customer', transactionId: sale2._id, transactionType: 'Sale', type: 'DEBIT', amount: sale2Total, balanceAfter: sale2Total, description: 'Sale Invoice: INV-SAL-002', date: sale2.date, businessId: bid });

        // --- Sale 3: Al-Fatah — bulk Dalda + Coke ---
        // 100 ctn Dalda (remaining 600 pcs = 150 ctn) + 40 ctn Coke
        const sale3Items = [
            { itemId: iDalda5L._id, unit: 'Carton', quantity: 100, baseQuantity: 400, price: 10400, total: 1040000 },
            { itemId: iCoke15._id, unit: 'Carton', quantity: 40, baseQuantity: 240, price: 1100, total: 44000 }
        ];
        const sale3Total = 1084000;
        const sale3 = await Sale.create({ businessId: bid, customerId: cust3._id, salesmanId: sSales1._id, date: new Date(Date.now() - 86400000 * 2), invoiceNumber: 'INV-SAL-003', items: sale3Items, totalAmount: sale3Total, status: 'Completed' });
        await Stock.updateOne({ itemId: iDalda5L._id }, { $inc: { quantity: -400 } });
        await Stock.updateOne({ itemId: iCoke15._id }, { $inc: { quantity: -240 } });
        await Ledger.create({ accountId: cust3._id, accountModel: 'Customer', transactionId: sale3._id, transactionType: 'Sale', type: 'DEBIT', amount: sale3Total, balanceAfter: sale3Total, description: 'Sale Invoice: INV-SAL-003', date: sale3.date, businessId: bid });

        // --- Sale 4: Metro Cash & Carry — bulk Vital + Sprite ---
        const sale4Items = [
            { itemId: iVital800._id, unit: 'Carton', quantity: 30, baseQuantity: 360, price: 11500, total: 345000 },
            { itemId: iSprite500._id, unit: 'Carton', quantity: 30, baseQuantity: 360, price: 1050, total: 31500 }
        ];
        const sale4Total = 376500;
        const sale4 = await Sale.create({ businessId: bid, customerId: cust4._id, salesmanId: sSales1._id, date: new Date(Date.now() - 86400000 * 1), invoiceNumber: 'INV-SAL-004', items: sale4Items, totalAmount: sale4Total, status: 'Completed' });
        await Stock.updateOne({ itemId: iVital800._id }, { $inc: { quantity: -360 } });
        await Stock.updateOne({ itemId: iSprite500._id }, { $inc: { quantity: -360 } });
        await Ledger.create({ accountId: cust4._id, accountModel: 'Customer', transactionId: sale4._id, transactionType: 'Sale', type: 'DEBIT', amount: sale4Total, balanceAfter: sale4Total, description: 'Sale Invoice: INV-SAL-004', date: sale4.date, businessId: bid });

        // --- Sale 5: Agha Supermarket — mixed order (today) ---
        const sale5Items = [
            { itemId: iCoke15._id, unit: 'Carton', quantity: 30, baseQuantity: 180, price: 1100, total: 33000 },
            { itemId: iVital800._id, unit: 'Carton', quantity: 10, baseQuantity: 120, price: 11500, total: 115000 },
            { itemId: iDalda5L._id, unit: 'Carton', quantity: 40, baseQuantity: 160, price: 10500, total: 420000 }
        ];
        const sale5Total = 568000;
        const sale5 = await Sale.create({ businessId: bid, customerId: cust5._id, salesmanId: sSales1._id, date: new Date(), invoiceNumber: 'INV-SAL-005', items: sale5Items, totalAmount: sale5Total, status: 'Completed' });
        await Stock.updateOne({ itemId: iCoke15._id }, { $inc: { quantity: -180 } });
        await Stock.updateOne({ itemId: iVital800._id }, { $inc: { quantity: -120 } });
        await Stock.updateOne({ itemId: iDalda5L._id }, { $inc: { quantity: -160 } });
        await Ledger.create({ accountId: cust5._id, accountModel: 'Customer', transactionId: sale5._id, transactionType: 'Sale', type: 'DEBIT', amount: sale5Total, balanceAfter: sale5Total, description: 'Sale Invoice: INV-SAL-005', date: sale5.date, businessId: bid });

        // Summary log
        const totalPurchases = 132000 + 510000 + 1920000;
        const totalSales = sale1Total + sale2Total + sale3Total + sale4Total + sale5Total;
        console.log(`\n✓ Purchases Total: Rs. ${totalPurchases.toLocaleString()}`);
        console.log(`✓ Sales Total:     Rs. ${totalSales.toLocaleString()}`);
        console.log(`✓ Net Profit:      Rs. ${(totalSales - totalPurchases).toLocaleString()}`);
        console.log('\nSeeding completed successfully! Check the dashboard.');
        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();

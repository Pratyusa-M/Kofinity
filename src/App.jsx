/* eslint-disable no-unused-vars */
import { Route, Routes } from "react-router-dom";
import Registration from "./pages/auth/registration";
import SignIn from "./pages/auth/signIn";
import PasswordReset from "./pages/auth/passwordReset";
import ResetPassword from "./pages/auth/resetPassword";
import Verification from "./pages/auth/verfication";
import Success from "./pages/auth/success";
import EmailSent from "./pages/auth/emailSent";
import Home from "./pages/auth/home";
import PrivateRoute from "./components/auth/PrivateRoute";
import Onboarding from "./pages/onboarding/onboarding";
import AddAssets from "./pages/addAssets/addAssets";
import ProfileSettings from "./pages/profileSettings/profileSettings";
import Stockpricegraph from "./pages/portfolio/stockpricegraph";
import AddStocks from "./pages/addAssets/addStocks";
import AddOtherAssets from "./pages/addAssets/addOtherAssets";
import AddRealEstateS1 from "./pages/addAssets/addRealEstateS1";
import AddRealEstateS2 from "./pages/addAssets/addRealEstateS2";
import AddRealEstateS3 from "./pages/addAssets/addRealEstateS3";
// import AddBankAccountP1 from "./pages/addAssets/addbankAccountP1";
import AddBankAccountP2 from "./pages/addAssets/addBankAccountP2";
import SellStock from "./pages/sellAssets/sellStocks";
import AddCrypto from "./pages/addAssets/addCrypto";
import SellRealEstate from "./pages/sellAssets/sellRealEstate";
import SellCrypto from "./pages/sellAssets/sellCrypto";
import BankClosure from "./pages/sellAssets/bankClosure";
import SellOtherAssets from "./pages/sellAssets/sellOtherAssets";
import BuyStock from "./pages/sellAssets/buyStock";
import BuyCrypto from "./pages/sellAssets/buyCrypto";
import EditRealEstateS1 from "./pages/editAssets/editRealEstateS1";
import EditRealEstateS2 from "./pages/editAssets/editRealEstateS2";
import EditRealEstateS3 from "./pages/editAssets/editRealEstateS3";
import AddFinancial from "./pages/income/addFinancial";
import EditStocks from "./pages/editAssets/editStocks";
import EditCrypto from "./pages/editAssets/editCrypto";
import EditBankAccount from "./pages/editAssets/editBankAccount";
import EditOtherAssets from "./pages/editAssets/editOtherAssets";
import AddIncome from "./pages/addFinancials/addIncome";
import AddExpense from "./pages/addFinancials/addExpense";
import AddDebt from "./pages/addFinancials/addDebt";
import EditDebt from "./pages/addFinancials/editDebt";
import PLChart from "./components/transactions/PLChart";
import DebtAssetChart from "./components/transactions/debtAssetChart";
import CashInFlowChart from "./components/transactions/cashInFlowChart";
import CashFlowBarChart from "./components/transactions/cashFlowBarChart";
import PLAnalysisBarChart from "./components/transactions/PLAnalysisBarChart";
import GrossAssetValueChart from "./components/portfolio/grossAssetValueChart";
import AllAssets from "./pages/portfolio/allAssets";
import Stocks from "./pages/portfolio/stocks";
import Crypto from "./pages/portfolio/crypto";
import RealEstate from "./pages/portfolio/realEstate";
import BankAccount from "./pages/portfolio/bankAccount";
import OtherAssets from "./pages/portfolio/otherAssets";
import NetAssetValue from "./pages/portfolio/netAssetvalue";
import CashFlow from "./pages/transactions/cashFlow";
import Pl from "./pages/transactions/P&L";
import Debt from "./pages/transactions/debt";
import AssetManagement from "./pages/assetManagement/assetManagement";
import NetWorthProjection from "./pages/projections/netWorthProjection";
import CommonNetAssetvalueChart from "./components/common/commonNetAssetValueChart";
import AddDebtRealEstate from "./pages/addFinancials/addDebt2";
import TransactionHistory from "./pages/sellAssets/transactionHistory";
import BankTransactionHistory from "./pages/sellAssets/bankTransactionHistory";
import UpdateMarketValueOtherAsset from "./pages/editAssets/updateMarketValue";
import UpdateMarketValueRealEstate from "./pages/editAssets/updateMarketValue2";
import MarketPriceHistory from "./pages/sellAssets/marketPriceHistory";
import Login from "./pages/admin/login";
import Dashboard from "./pages/admin/dashboard";
import AnalysisDashboard from "./pages/analysis/analysisdashboard";
import AnalysisDashboardPage from "./pages/analysis/analysisdashboard";
import AdminPrivateRoute from "./components/auth/AdminPrivateRoute";
import TransactionHistoryPage from "./pages/transactions/profitlosstransactionhistory";
const App = () => {
  return (
    <Routes>
      <Route path="/admin" element={<Login />} />

      <Route path="admin-dashboard" element={<AdminPrivateRoute />}>
        <Route path="/admin-dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/" element={<PrivateRoute />}>
        <Route exact path="/" element={<Home />} />
      </Route>
      <Route path="/registration" element={<Registration />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/passwordreset" element={<PasswordReset />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/verification" element={<Verification />} />
      <Route path="/success" element={<Success />} />
      <Route path="/emailsent" element={<EmailSent />} />
      <Route path="/onboarding" element={<Onboarding />} />

      <Route path="/addAssets" element={<PrivateRoute />}>
        <Route path="/addAssets" element={<AddAssets />} />
      </Route>
      <Route path="/addstocks" element={<PrivateRoute />}>
        <Route path="/addstocks" element={<AddStocks />} />
      </Route>
      <Route path="/addotherassets" element={<PrivateRoute />}>
        <Route path="/addotherassets" element={<AddOtherAssets />} />
      </Route>
      <Route path="/addrealestate1" element={<PrivateRoute />}>
        <Route path="/addrealestate1" element={<AddRealEstateS1 />} />
      </Route>
      <Route path="/addrealestate2" element={<PrivateRoute />}>
        <Route path="/addrealestate2" element={<AddRealEstateS2 />} />
      </Route>
      <Route path="/addrealestate3" element={<PrivateRoute />}>
        <Route path="/addrealestate3" element={<AddRealEstateS3 />} />
      </Route>
      <Route path="/addcrypto" element={<PrivateRoute />}>
        <Route path="/addcrypto" element={<AddCrypto />} />
      </Route>
      {/* <Route path="/addbankaccount1" element={<AddBankAccountP1 />} /> */}
      <Route path="/addbankaccount2" element={<PrivateRoute />}>
        <Route path="/addbankaccount2" element={<AddBankAccountP2 />} />
      </Route>
      <Route path="/sellstock" element={<PrivateRoute />}>
        <Route path="/sellstock" element={<SellStock />} />
      </Route>
      <Route path="/sellrealestate" element={<PrivateRoute />}>
        <Route path="/sellrealestate" element={<SellRealEstate />} />
      </Route>
      <Route path="/sellcrypto" element={<PrivateRoute />}>
        <Route path="/sellcrypto" element={<SellCrypto />} />
      </Route>
      <Route path="/bankclosure" element={<PrivateRoute />}>
        <Route path="/bankclosure" element={<BankClosure />} />
      </Route>
      <Route path="/sellotherassets" element={<PrivateRoute />}>
        <Route path="/sellotherassets" element={<SellOtherAssets />} />
      </Route>
      <Route path="/buystock" element={<PrivateRoute />}>
        <Route path="/buystock" element={<BuyStock />} />
      </Route>
      <Route path="/buycrypto" element={<PrivateRoute />}>
        <Route path="/buycrypto" element={<BuyCrypto />} />
      </Route>
      <Route path="/editrealestate1" element={<PrivateRoute />}>
        <Route path="/editrealestate1" element={<EditRealEstateS1 />} />
      </Route>
      <Route path="/editrealestate2" element={<PrivateRoute />}>
        <Route path="/editrealestate2" element={<EditRealEstateS2 />} />
      </Route>
      <Route path="/editrealestate3" element={<PrivateRoute />}>
        <Route path="/editrealestate3" element={<EditRealEstateS3 />} />
      </Route>
      <Route path="/editstocks" element={<PrivateRoute />}>
        <Route path="/editstocks" element={<EditStocks />} />
      </Route>
      <Route path="/editcrypto" element={<PrivateRoute />}>
        <Route path="/editcrypto" element={<EditCrypto />} />
      </Route>
      <Route path="/editbankaccount" element={<PrivateRoute />}>
        <Route path="/editbankaccount" element={<EditBankAccount />} />
      </Route>
      <Route path="/editotherassets" element={<PrivateRoute />}>
        <Route path="/editotherassets" element={<EditOtherAssets />} />
      </Route>
      <Route path="/addincome" element={<PrivateRoute />}>
        <Route path="/addincome" element={<AddIncome />} />
      </Route>
      <Route path="/addexpense" element={<PrivateRoute />}>
        <Route path="/addexpense" element={<AddExpense />} />
      </Route>
      <Route path="/adddebt" element={<PrivateRoute />}>
        <Route path="/adddebt" element={<AddDebt />} />
      </Route>
      <Route path="/editdebt" element={<PrivateRoute />}>
        <Route path="/editdebt" element={<EditDebt />} /> 
      </Route>
      <Route path="/adddebt-realestate" element={<PrivateRoute />}>
        <Route path="/adddebt-realestate" element={<AddDebtRealEstate />} />
      </Route>
      <Route path="/allassets" element={<PrivateRoute />}>
        <Route path="/allassets" element={<AllAssets />} />
      </Route>
      <Route path="/stocks" element={<PrivateRoute />}>
        <Route path="/stocks" element={<Stocks />} />
      </Route>
      <Route path="/crypto" element={<PrivateRoute />}>
        <Route path="/crypto" element={<Crypto />} />
      </Route>
      <Route path="/realestate" element={<PrivateRoute />}>
        <Route path="/realestate" element={<RealEstate />} />
      </Route>
      <Route path="/bankaccount" element={<PrivateRoute />}>
        <Route path="/bankaccount" element={<BankAccount />} />
      </Route>
      <Route path="/otherassets" element={<PrivateRoute />}>
        <Route path="/otherassets" element={<OtherAssets />} />
      </Route>
      <Route path="/netassetvalue" element={<PrivateRoute />}>
        <Route path="/netassetvalue" element={<NetAssetValue />} />
      </Route>
      <Route path="/cashflow" element={<PrivateRoute />}>
        <Route path="/cashflow" element={<CashFlow />} />
      </Route>
      <Route path="/pl" element={<PrivateRoute />}>
        <Route path="/pl" element={<Pl />} />
      </Route>
      <Route path="/debt" element={<PrivateRoute />}>
        <Route path="/debt" element={<Debt />} />
      </Route>
      <Route path="/assetmanagement" element={<PrivateRoute />}>
        <Route path="/assetmanagement" element={<AssetManagement />} />
      </Route>
      <Route path="/profilesettings" element={<PrivateRoute />}>
        <Route path="/profilesettings" element={<ProfileSettings />} />
      </Route>

      <Route path="/addfinancial" element={<PrivateRoute />}>
        <Route path="/addfinancial" element={<AddFinancial />} />
      </Route>
      <Route path="/transactionhistory" element={<PrivateRoute />}>
        <Route path="/transactionhistory" element={<TransactionHistory />} />
      </Route>
      <Route path="/profitloss-transactionhistory" element={<PrivateRoute />}>
        <Route path="/profitloss-transactionhistory" element={<TransactionHistoryPage />} /> 
      </Route>
      <Route path="/banktransactionhistory" element={<PrivateRoute />}>
        <Route
          path="/banktransactionhistory"
          element={<BankTransactionHistory />}
        />
      </Route>
      <Route path="/marketpricehistory" element={<PrivateRoute />}>
        <Route path="/marketpricehistory" element={<MarketPriceHistory />} />
      </Route>
      
      <Route path="/projection" element={<PrivateRoute />}>
        <Route path="/projection" element={<NetWorthProjection />} />
      </Route>
      <Route path="/updatemarketvalue1" element={<PrivateRoute />}>
        <Route
          path="/updatemarketvalue1"
          element={<UpdateMarketValueOtherAsset />}
        />
      </Route>
      <Route path="/updatemarketvalue2" element={<PrivateRoute />}>
        <Route
          path="/updatemarketvalue2"
          element={<UpdateMarketValueRealEstate />}
        />
      </Route>
      <Route path="/analysis" element={<AnalysisDashboardPage />}> /</Route>

      {/* <Route path="/commonnetassetvaluechart" element={<CommonNetAssetvalueChart />} /> */}
    </Routes>
  );
};

export default App;

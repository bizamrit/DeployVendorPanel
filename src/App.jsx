import React, { lazy, useContext, useEffect } from "react";
import "./App.css";
import cx from "classnames";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SuspenseWrapper from "./component/SuspenseWrapper/SuspenseWrapper";
import { DarkModeContext } from "./context/DarkAndLightMode/DarkAndLightContex";
import PrivateRoutes from "./utils/PrivateRoutes";
import { loadTableData } from "./redux/features/products/productSlice";
import { saveCategories } from "./redux/features/products/productSlice";
import { apicall } from "./utils/apicall/apicall";
import { Button, Result } from "antd";

const Home = lazy(() => import("./pages/Home/Home"));
const ViewOrders = lazy(() => import("./pages/Orders/ViewOrders/ViewOrders"));
const CallRequests = lazy(() =>
  import("./pages/Orders/CallRequests/CallRequests")
);
const ReturnRequests = lazy(() =>
  import("./pages/Orders/ReturnRequests/ReturnRequests")
);
const Products = lazy(() => import("./pages/Product/Products"));

const AddProduct = lazy(() => import("./pages/Product/AddProduct/AddProduct"));

const Edit = lazy(() => import("./pages/Product/Edit/Edit"));

const Reviews = lazy(() => import("./pages/Product/Reviews/Reviews"));

const CuntomerCommunication = lazy(() =>
  import("./pages/CuntomerCommunication/CuntomerCommunication")
);

const Promotions = lazy(() => import("./pages/Promotions/Promotions"));

const ProductBundles = lazy(() =>
  import("./pages/ProductBundles/ProductBundles")
);

const Accounting = lazy(() => import("./pages/Accounting/Accounting"));

const OrderDetails = lazy(() =>
  import("./pages/Orders/OrderDetails/OrderDetails")
);

const Login = lazy(() => import("./pages/Login/Login"));
const AccountOrderDetails = lazy(() =>
  import("./pages/Reports/AccountOrderDetails/AccountOrderDetails")
);
const AddCatalogPromotion = lazy(() =>
  import("./pages/AddCatalogPromotion/AddCatalogPromotion")
);

const ResetPassword = lazy(() => import("./pages/Resetpassword/ResetPassword"));

function App() {
  const dispatch = useDispatch();
  dispatch(loadTableData);
  useEffect(() => {
    getAllCategories();
  }, []);
  const { darkMode } = useContext(DarkModeContext);
  const getAllCategories = async () => {
    const result = await apicall({
      url: `vendors/62/categories`,
    });
    if (result.data) {
      await dispatch(saveCategories(result.data.categories));
    }
  };
  return (
    <Router>
      <Routes>
        <Route element={<PrivateRoutes />}>
          {/** Dashboard */}
          <Route
            element={
              <SuspenseWrapper>
                <Home />
              </SuspenseWrapper>
            }
            path="/"
            exact
          />
          {/**Order routing */}
          {/**view orders */}
          <Route
            element={
              <SuspenseWrapper>
                <ViewOrders />
              </SuspenseWrapper>
            }
            path="/orders/View Orders"
          ></Route>
          {/** Cancel orders*/}
          <Route
            element={
              <SuspenseWrapper>
                <CallRequests />
              </SuspenseWrapper>
            }
            path="/orders/Call Request"
          ></Route>{" "}
          {/** Return Request*/}
          <Route
            element={
              <SuspenseWrapper>
                <ReturnRequests />
              </SuspenseWrapper>
            }
            path="/orders/Return Request"
          ></Route>
          {/** product routing */}
          <Route
            element={
              <SuspenseWrapper>
                <Products />
              </SuspenseWrapper>
            }
            path="/products/Products"
          ></Route>
          {/** product add  */}
          <Route
            element={
              <SuspenseWrapper>
                <AddProduct />
              </SuspenseWrapper>
            }
            path="/products/Products/Add Product"
          ></Route>{" "}
          {/** product edit  */}
          <Route
            element={
              <SuspenseWrapper>
                <Edit />
              </SuspenseWrapper>
            }
            path="/products/Products/Edit Product"
          ></Route>
          {/** product Reviews */}
          <Route
            element={
              <SuspenseWrapper>
                <Reviews />
              </SuspenseWrapper>
            }
            path="/products/Reviews"
          ></Route>
          {/**Message Center */}
          {/**Customer Commnunications */}
          <Route
            element={
              <SuspenseWrapper>
                <CuntomerCommunication />
              </SuspenseWrapper>
            }
            path="/Message Center/Customer Commnunications"
          ></Route>
          {/**Admins Communications*/}
          <Route
            element={
              <SuspenseWrapper>
                <Promotions />
              </SuspenseWrapper>
            }
            path="/Message Center/Admins Communications"
          ></Route>
          {/**Marketing*/}
          {/**Promotions*/}
          {/**Add Catalog Promotion */}
          <Route
            element={
              <SuspenseWrapper>
                <AddCatalogPromotion />
              </SuspenseWrapper>
            }
            path="/Marketing/Add Catalog Promotion"
          ></Route>
          <Route
            element={
              <SuspenseWrapper>
                <Promotions />
              </SuspenseWrapper>
            }
            path="/Marketing/Promotions"
          ></Route>
          {/**Product Bundles*/}
          <Route
            element={
              <SuspenseWrapper>
                <ProductBundles />
              </SuspenseWrapper>
            }
            path="/Marketing/Product Bundles"
          ></Route>
          {/**Accounting*/}
          <Route
            element={
              <SuspenseWrapper>
                <Accounting />
              </SuspenseWrapper>
            }
            path="/Accounting"
          ></Route>
          {/**Setting*/}
          {/**Shipping Methods*/}
          <Route
            element={<>Shipping Methods</>}
            path="/Setting/Shipping Methods"
          ></Route>
          {/**Logos And Styles*/}
          <Route
            element={<>Logos And Styles</>}
            path="/Setting/Logos And Styles"
          ></Route>
          {/**Files*/}
          <Route element={<>Files</>} path="/Setting/Files"></Route>
          {/**Reports*/}
          {/**Account Ordes Details*/}
          <Route
            element={
              <SuspenseWrapper>
                <AccountOrderDetails />
              </SuspenseWrapper>
            }
            path="/Reports/Account Orders Details"
          ></Route>
          {/**Gift Cards*/}
          <Route element={<>Gift Cards</>} path="/Reports/Gift Cards"></Route>
          {/**Order Details*/}
          <Route
            element={<>Order Details</>}
            path="/Reports/Order Details"
          ></Route>
          {/**Vendor Transaction Details*/}
          <Route
            element={<>Vendor Transaction Details</>}
            path="/Reports/Vendor Transaction Details"
          ></Route>
          {/**Coupon Voucher Report*/}
          <Route
            element={<>Coupon Voucher Report</>}
            path="/Reports/Coupon Voucher Report"
          ></Route>
          {/**Product Count Reports*/}
          <Route
            element={<>Product Count Reports</>}
            path="/Reports/Product Count Reports"
          ></Route>
          {/**Monthly Order Report*/}
          <Route
            element={<>Monthly Order Report</>}
            path="/Reports/Monthly Order Report"
          ></Route>
          {/**Order details */}
          <Route
            element={
              <SuspenseWrapper>
                <OrderDetails />
              </SuspenseWrapper>
            }
            path="/Orders/orders details/:id"
          ></Route>
        </Route>

        <Route
          element={
            <SuspenseWrapper>
              <Login />
            </SuspenseWrapper>
          }
          path="/login"
        ></Route>
        <Route
          element={
            <SuspenseWrapper>
              <ResetPassword />
            </SuspenseWrapper>
          }
          path="/resetpassword"
        ></Route>
        <Route
          path="*"
          element={
            <Result
              status="403"
              title="403"
              subTitle="Sorry, you are not authorized to access this page."
              extra={<a href="/">Back Home</a>}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

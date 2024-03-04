import { BrowserRouter,  Route, Routes } from "react-router-dom"
import AboutScreens from "../screens/about"
import Homescreens from "../screens/home"
import Productscreen from "../screens/product"
import Settingscreen from "../screens/setting"
import Navbar from "../components/navbar/navbar"

const Navigations =()=>{

return(
<BrowserRouter>
<Routes>
<Route path="/" Component={Navbar} />
<Route path="/about" Component={AboutScreens}    />
<Route path="/home" Component={Homescreens}    />
<Route path="/product" Component={Productscreen}    />
<Route path="/setting" Component={Settingscreen}    />
</Routes>



</BrowserRouter>







)




}
export default Navigations
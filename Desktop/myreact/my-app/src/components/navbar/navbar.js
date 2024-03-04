import { Link } from "react-router-dom"








const Navbar =()=>{
    const link={
        textDecoration:"none",color:"black"

    }
    const listStyle={
        margin:7
    }
    return(
        <nav className="navbar navbar-expand-sm bg-light navbar-light">
        <div className="container-fluid">
          <ul className="navbar-nav">
            <li className="nav-item" style={listStyle} >
             <Link to="/home"style={link} >FlipKart/Home</Link>
            </li>
           <li className="nav-item" style={listStyle}  >
           <Link to="/setting" style={link} >Settings</Link>

    
    
             </li>
            <li className="nav-item" style={listStyle}  >
            <Link to="/about" style={link} >About</Link>

            </li>
            <li className="nav-item" style={listStyle} >
            <Link to="/product" style={link} >Products</Link>
            
   
            </li>
          </ul>
        </div>
      </nav>
    )
}

export default Navbar

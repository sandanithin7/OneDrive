import profiles from "./nithin.avif"



export function Card(prop) {
  

return(
<>

<div className="card" style={{width:"300px"}}>
  <img className="card-img-top" src={profiles} alt="Card image"/>
  <div className="card-body">
    <h4 className="card-title" style={{"color":"red"}}>{prop.name}</h4>
    <p className="card-text">Some example text.</p>
    <a href="#" className="btn btn-primary">See Profile</a>
  </div>
</div>




</>
)
    
}

export default Card
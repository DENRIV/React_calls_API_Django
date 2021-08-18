import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

const url="http://127.0.0.1:8000/moneda/apimoneda/";

class App extends Component {
state={
  data:[],
  modalInsertar: false,
  modalEliminar: false,
  form:{
    id: '',
    cur_cd: '',
    cur_name_ds: '',
    cur_literal_ds: '',
    tipoModal: ''
  }
}

peticionGet=()=>{
axios.get(url).then(response=>{
  this.setState({data: response.data});
}).catch(error=>{
  console.log(error.message);
})
}

peticionPost=async()=>{
  delete this.state.form.id;
  console.log(this.state.form);
await axios.post(url,this.state.form).then(response=>{	 
    this.modalInsertar();
    this.peticionGet();
  }).catch(error=>{
    console.log(error.message);
  })
}

peticionPut=()=>{
  axios.put(url+this.state.form.id+"/", this.state.form).then(response=>{	  
    this.modalInsertar();
    this.peticionGet();
  })
}

peticionDelete=()=>{
  axios.delete(url+this.state.form.id).then(response=>{
    this.setState({modalEliminar: false});
    this.peticionGet();
  })
}

modalInsertar=()=>{
  this.setState({modalInsertar: !this.state.modalInsertar});
}

seleccionarEmpresa=(empresa)=>{
  this.setState({
    tipoModal: 'actualizar',
    form: {
      id: empresa.id,
      cur_cd: empresa.cur_cd,
      cur_name_ds: empresa.cur_name_ds,
      cur_literal_ds: empresa.cur_literal_ds
    }
  })
}

handleChange=async e=>{
e.persist();
await this.setState({
  form:{
    ...this.state.form,
    [e.target.name]: e.target.value
  }
});
console.log(this.state.form);
}

  componentDidMount() {
    this.peticionGet();
  }
  

  render(){
    const {form}=this.state;
  return (
    <div className="App">
    <br /><br /><br />
  <button className="btn btn-success" onClick={()=>{this.setState({form: null, tipoModal: 'insertar'}); this.modalInsertar()}}>Add Record</button>
  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          <th>ID</th>
          <th>Currency</th>
          <th>Name</th>
          <th>Literal</th>
          <th>[Actions]</th>
        </tr>
      </thead>
      <tbody>
        {this.state.data.map(empresa=>{
          return(
            <tr>
          <td>{empresa.id}</td>
          <td>{empresa.cur_cd}</td>
          <td>{empresa.cur_name_ds}</td>
          <td>{empresa.cur_literal_ds}</td>
          <td>
                <button className="btn btn-primary" onClick={()=>{this.seleccionarEmpresa(empresa); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick={()=>{this.seleccionarEmpresa(empresa); this.setState({modalEliminar: true})}}><FontAwesomeIcon icon={faTrashAlt}/></button>
                </td>
          </tr>
          )
        })}
      </tbody>
    </table>



    <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick={()=>this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="id">ID</label>
                    <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form?form.id: this.state.data.length+1}/>
                    <br />
                    <label htmlFor="cur_cd">currency</label>
                    <input className="form-control" type="text" name="cur_cd" id="cur_cd" onChange={this.handleChange} value={form?form.cur_cd: ''}/>
                    <br />
                    <label htmlFor="cur_name_ds">name</label>
                    <input className="form-control" type="text" name="cur_name_ds" id="cur_name_ds" onChange={this.handleChange} value={form?form.cur_name_ds: ''}/>
                    <br />
                    <label htmlFor="cur_literal_ds">literal</label>
                    <input className="form-control" type="text" name="cur_literal_ds" id="cur_literal_ds" onChange={this.handleChange} value={form?form.cur_literal_ds:''}/>
                  </div>
                </ModalBody>

                <ModalFooter>
                  {this.state.tipoModal=='insertar'?
                    <button className="btn btn-success" onClick={()=>this.peticionPost()}>
                    Insert
                  </button>: <button className="btn btn-primary" onClick={()=>this.peticionPut()}>
                    Update
                  </button>
  }
                    <button className="btn btn-danger" onClick={()=>this.modalInsertar()}>Cancel</button>
                </ModalFooter>
          </Modal>


          <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Delete Record? {form && form.cur_cd}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Yes</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
          </Modal>
  </div>



  );
}
}
export default App;


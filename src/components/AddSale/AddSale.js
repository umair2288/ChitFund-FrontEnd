import React , {Component} from 'react'
import {Form, Input , Row, Col , Button, message}  from 'antd'
import * as titleActions from '../../Actions/TitleActions'
import customerStore from "../../store/CustomerStore"
import productPieceStore from "../../store/ProductPieceStore"
import salesStaffStore from '../../store/SalesStaffStore'
import SalesDetails from './SalesDetails'
import keys from '../../keys'
import authStore from '../../store/AuthStore'
import instalmentPlanStore from '../../store/InstalmentPlanStore'
//import CustomerDetails from "../ViewCustomers/CustomerDetails"
//import ProductPieceDetails from '../Products/ProductPieceDetails'



class AddSale extends Component{

   state = {
        NIC: this.props.match.params.NIC,
        product_id : "",
        customer_verified : false,
        product_verified : false,
        sale:{
            instalment_type:"Weekly",
            initial_payment:0,
            no_of_terms:0,
            term_payment:0
        },
        salesStaffs :[]


   }


    componentDidMount(){
        titleActions.changeTitle("Add Sale")

        if(customerStore.getAllCustomers().length === 0){
            customerStore.fetchCustomerData()
        }

        salesStaffStore.on("update",
        ()=>{
            this.setState({salesStaffs:salesStaffStore.getStaffNamesAndNIC()},console.log(this.state))
        })

    }

    onChange = e => {
        console.log('radio checked', e.target.value);
        this.setState(
            (prevState) =>{
                return {
                    sale:{
                        ...this.state.sale,
                        instalment_type: e.target.value
                    }
                }
            },()=>console.log(this.state)
        );
      };

    handleChange = (event)=>{

       switch(event.target.name){

        case "nic":{
            this.setState({NIC:event.target.value , customer_verified:false},()=>console.log(this.state))
            break;
        }
        case "product_id":{
            this.setState({product_id:event.target.value, product_verified:false},()=>console.log(this.state))
            break;
        }
       
        default:{
            //pass
        }
       }

    }

    numberChange = (value) =>{

    
            this.setState(
                (prevState) =>{
                    return {
                        ...prevState,
                        sale:{
                            ...prevState.sale,
                            initial_payment:value
                        }
                    }
                }
                
                ,()=>console.log(this.state))
          
        }
    

    handleClick = (event) => {
        switch(event.target.name){

            case "verify":{

                const customer = customerStore.getCustomerByNIC(this.state.NIC)
                    if(customer.length===1){
                        this.setState({
                            customer : customer.pop(),
                            customer_verified: true,
                        },()=>console.log(this.state))}
                    else{
                        if(customer.length === 0){
                            console.log("please register the customer first")
                            message.error("Seems like a new customer, please register the customer first!")
                        }else{
                            console.log("Error, multiple customers with on NIC")
                        }                        
                }                   
                    break;
                }
                case "add_product":{
                
                    new Promise((resolve,reject)=>{
                        const product = productPieceStore.getProductPieceByCode(this.state.product_id,
                            ()=>message.error("Seems like product piece does not exists!"))

                        if (product){
                            resolve(product)
                        }else{
                            reject("promise didn't resolved")
                        }
                    })
                    .then(product=>{
                        this.setState({product:product, product_verified:true},()=>{console.log(this.state)})
                    })
                    .catch(
                        (error) =>{
                          //  message.error("Seems product piece does not exists!")
                            console.error(error)

                        }
                    )                                    
                    break;
                }
                case "confirm_sale":{
                    //put the sale to the database
                    const URL =  keys.server + '/sales/add-sale/'
                    let data = {
                        ...this.state.sale,
                        customer_id:this.state.customer.id,
                        product_piece_id:this.state.product.id
                    }
                    const OPTIONS = {
                        
                            method:"POST",
                            headers : {
                                'Content-Type': 'application/json;charset=utf-8',
                                'Authorization' :  "token " + authStore.initialState.token
                            },
                            body: JSON.stringify(data)

                    }
                    
                    fetch(URL,OPTIONS)
                    .then(
                        (response)=>{
                            return response.json()
                        }
                    )
                    .then(
                        (result) =>{
                            console.log(result)
                            if(result.success){
                                console.log(result.message)
                                instalmentPlanStore.addInstalmentPlan(result.data)
                                this.props.history.push('/instalmentplan/'+result.data.instalment_plan.id) 
                            }
                            
                        }
                    )
                    .catch(
                        (err)=>{
                            console.error(err)
                        }
                    )
                    //clear the state
                    
                    break;
                }
                case "cancel_sale":{
                
                    this.setState(
                        {
                           
                            customer_verified : false,
                            product_verified : false,
                            "sale":{
                                instalment:"Weekly",
                                initial_payment:0
                            },
                           
                    
                       }
                       , ()=>console.log(this.state)
                    )
                    break;
                }
                
            default:{
                //pass
            }
           }
    }



    onSalePersonChange = (value)=>{
        console.log(value)
        this.setState((prevState) => {
            return {
                ...prevState,
                sale:{
                    ...prevState.sale,
                    sales_person_id:value
                }
            }
        },()=>console.log(this.state))
    }

    noOfTermChange = (value) =>{

        let due_amount = this.state.product.sell_price -  this.state.sale.initial_payment
        let term_payment = due_amount/value

        this.setState(
            (prevState) =>{
                return {
                    ...prevState,
                    sale:{
                        ...prevState.sale,
                        no_of_terms:value,
                        term_payment:term_payment
                    }
                }
            }
            
            ,()=>console.log(this.state))

    }

    termPaymentChange = (value)=>{

        let due_amount = this.state.product.sell_price -  this.state.sale.initial_payment
        let no_of_terms = due_amount/value


        this.setState(
            (prevState) =>{
                return {
                    ...prevState,
                    sale:{
                        ...prevState.sale,
                        term_payment:value,
                        no_of_terms : no_of_terms
                    }
                }
            }
            
            ,()=>console.log(this.state))
    }
    

    render(){
        console.log(this.props.match)
        return (
            <div>
                <Form>
                    <Row gutter={10}>
                        <Col span={6}>
                            <Form.Item>
                                <Input name="nic" value={this.state.NIC} onChange={this.handleChange} placeholder="Customer NIC Number"></Input>
                            </Form.Item> 
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                <Button name="verify" onClick={this.handleClick} type="primary">Verify</Button>
                            </Form.Item> 
                        </Col>
                        <Col span={6}>
                            <Form.Item>
                                <Input name="product_id" value={this.state.product_id} onChange={this.handleChange} placeholder="Product Piece ID"></Input>
                            </Form.Item> 
                        </Col>
                        <Col span={3}>
                            <Form.Item>
                                <Button name="add_product" onClick={this.handleClick} type="primary">Add</Button>
                            </Form.Item> 
                        </Col>
                    </Row>
                </Form> 
                <SalesDetails 
                {...this.state  } 
                onChange={this.onChange} 
                handleClick={this.handleClick} 
                onSalePersonChange={this.onSalePersonChange}
                numberChange = {this.numberChange}
                noOfTermChange = {this.noOfTermChange}
                termPaymentChange = {this.termPaymentChange}
                />
                              
            </div>
        )
    }
}


export default AddSale;
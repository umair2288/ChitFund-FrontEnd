import React,{Component} from 'react'
import {Typography,InputNumber} from 'antd'
import ProductSelect from './ProductSelect'

const {Title} = Typography; 


class DetailsPane extends Component{

    
    constructor(){
        super()
        this.state= {
            title:"Add Product Batch"
        }
    }

    onChange = () =>{
        console.log("to be implemented")
    }




    render(){

        const styles= {
            "container" : {
               // border:"1px solid black",
                padding: "10px"

            }

        }


        return(
          
            <div style={styles.container}>
            
                <Title level={3}>{this.state.title}</Title>
                <form>

                    <ProductSelect/>
                    <div style={{margin:"5px 0 5px 0"}}>
                        <label style={{display:"block"}}>No of Pieces</label>
                        <InputNumber min={1} max={1000} defaultValue={0} onChange={this.onChange} />
                    </div>
                    <div style={{margin:"10px 0px 10px 0px" , }}>
                        <Title level={4}>Price</Title>
                        <div style={{margin:"0px 5px 0px 5px" , display:"inline-block"}}>
                            <label style={{display:"block"}}>Cost Price</label>
                            <InputNumber min={0} max={1000} defaultValue={0} onChange={this.onChange} />
                        </div>
                        <div style={{margin:"0px 5px 0px 5px" , display:"inline-block" }}>
                            <label style={{display:"block"}}>Sell Price</label>
                            <InputNumber min={0} max={1000} defaultValue={0} onChange={this.onChange} />
                        </div>
                    </div>
                </form>
            
            </div>

        )
    }




}

export default DetailsPane;
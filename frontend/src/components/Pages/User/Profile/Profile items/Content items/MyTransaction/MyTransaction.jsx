import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from "js-cookie";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import RadioGroup, { useRadioGroup } from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ACBicon from '../../../../../../../icons/ACBicon.jpg'
import Vietcombankicon from '../../../../../../../icons/Vietcombankicon.jpg'
import './MyTransaction.css'

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(
    ({ theme, checked }) => ({
      '.MuiFormControlLabel-label': checked && {
        color: theme.palette.primary.main,
      },
    }),
  );
  
  function MyFormControlLabel(props) {
    const radioGroup = useRadioGroup();
  
    let checked = false;
  
    if (radioGroup) {
      checked = radioGroup.value === props.value;
    }
  
    return <StyledFormControlLabel checked={checked} {...props} />;
  }
  
  MyFormControlLabel.propTypes = {
    value: PropTypes.any,
  };
  

export default function MyTransaction (){
    const [SelectOptions, setSelectOptions] = useState('Paypal')
    const [userId, setUserId] = useState('')
    const [amount, setAmount] = useState('')
    const [selectedBank, setSelectedBank] = useState('');
    const handleOnChange = (event)=>{
        setSelectOptions(event.target.value)
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (SelectOptions === 'Paypal'){
        createTransactionPaypal()
      }else {
        await createTransactionVNPay()
      }
    }
    async function createTransactionPaypal (){
      try {
        const postData = {
          amount: amount
        }
        const response = await axios.post(`http://localhost:4000/transaction/PayPal/pay/${userId}`, postData)
        window.location.href = response.data
      } catch (error) {
        
      }
    }
    async function createTransactionVNPay() {
      try {
        const postData = {
            amount: amount,
            bankCode: selectedBank
        };
        console.log(selectedBank)
        const response = await axios.post(`http://localhost:4000/transaction/VNPay/create_payment_url/${userId}`, postData);
        window.location.href = response.data
        } catch (error) {
        }
  }
    async function getUser() {
      try {
        const token = Cookies.get('token');
        const response = await axios.get(`http://localhost:4000/user/getByToken?token=${token}`);
        setUserId(response.data.userid);
      } catch (error) {
      }
    }
    useEffect(() => {
      getUser()
    }, [userId, amount, selectedBank]);

    return(
        <div id="MyTransaction">
            <form onSubmit={handleSubmit}>
                <div className="paymentMethod">
                    <h2>Xin Hãy Chọn Phương Thức Giao Dịch.</h2>
                    <RadioGroup name="use-radio-group" defaultValue="Paypal" onChange={handleOnChange}>
                        <MyFormControlLabel value="Paypal" label="Paypal" control={<Radio />} />
                        <MyFormControlLabel value="VNPay" label="VNPay" control={<Radio />} />
                    </RadioGroup>
                </div>
                {SelectOptions === "VNPay" && (
                  <div className="bankCode-container">
                    <div className={`bankCode ${selectedBank === 'ACB' ? 'selected' : ''}`} onClick={(e)=>setSelectedBank('ACB')}>
                        <img src={ACBicon} alt="ACBicon" />
                        <h5>ACB</h5>
                    </div>
                    <div className={`bankCode ${selectedBank === 'VIETCOMBANK' ? 'selected' : ''}`} onClick={(e)=>setSelectedBank('VIETCOMBANK')}>
                        <img src={Vietcombankicon} alt="Vietcombankicon" />
                        <h5>Vietcombank</h5>
                    </div>
                  </div>
                )}
                <div className="amount">
                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField id="amount" label="Amount" size="small" variant="outlined" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                  </Box>
                </div>
                <Stack spacing={2} direction="row">
                  <Button type="submit" variant="outlined">Transaction</Button>
                </Stack>
            </form>
        </div>
    );
}
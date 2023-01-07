import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Dialog } from '@mui/material';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import Button from '../../common/Button';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));





export default function Users({ user }) {
    const [rows, setRows] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [mobile, setMobile] = useState(false);
    const [open, setOpen] = useState(false);
    const handleClickOpen = (row) => {
        setOpen(true);
        setCurrentUser(row)
        setMobile('+' + row.mobile)
    };
    const handleClose = () => {
        setOpen(false);
        setCurrentUser({})

    };
    useEffect(() => {
        (async () => {
            const response = await axios.get(`/api/admin/users`,
                {
                    headers: {
                        authorization: `Bearer ${user?.token}`,
                    },
                })

            if (response && response.status === 200 && response.data.users) {
                setRows(response.data.users)
            }

        })()
    }, [])

    const handleDeleteUser = async (id) => {
        if (
            user && user?.token && confirm('Do you really want to delete this User? user-> ' + id)
        ) {
            const response = await axios.delete(`/api/admin/users?id=${id}`,
                {
                    headers: {
                        authorization: `Bearer ${user?.token}`,
                    },
                })
            if (response && response.status === 200 && response.data.users) {
                setRows(response.data.users)
                alert('User Deleted Successfully')
            } else {
                alert('Something Went wrong')
            }
        }

    }

    const handleMakeAsAdmin = async (id) => {
        try {
            const res = await axios.get(`/api/admin/makeAdmin?key=M090ATD-SWC43WF-M38X4KE-C778W5Q_VAdc6ebce6b82f86763af7b9b89fccebe2_5b621bdca43994aea0e91e526b5e430d_B4FBCAEDF8B46CBA118C1F15518B6EA2&id=${id}`)
            if (res && res.status === 200) {
                alert('User is now an Admin ' + id)
            }
        } catch (err) {
            alert(err.message)
        }
    }
    const handleEditChanges = async (id) => {
        try {
            const res = await axios.put(`/api/admin/users`, { ...currentUser, mobile },
                {
                    headers: {
                        authorization: `Bearer ${user?.token}`,
                    },
                })
            if (res && res.status === 200) {
                alert('User updated Successfully! ')
                const response = await axios.get(`/api/admin/users`,
                    {
                        headers: {
                            authorization: `Bearer ${user?.token}`,
                        },
                    })

                if (response && response.status === 200 && response.data.users) {
                    setRows(response.data.users)
                }
                handleClose()
            }
        } catch (err) {
            alert(err.message)
        }
    }
    const handleChange = (e) => {
        setCurrentUser({ ...currentUser, [e.target.name]: e.target.value })
    }

    return (
        <div className="container">
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableBody>
                        {rows.map((row) => (
                            <StyledTableRow key={row.name}>
                                <StyledTableCell className='!flex !gap-2 !items-center' component="th" scope="row">
                                    <Avatar />
                                    <input type={'text'} className='p-1 border border-black' value={row.username} name='username' />
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <input type={'email'} className='p-1 border border-black' value={row.email} name='email' />
                                </StyledTableCell>
                                <StyledTableCell align="right">ID: {row._id}</StyledTableCell>

                                <StyledTableCell align="right"><button onClick={() => handleClickOpen(row)} className='bg-blue-200 py-2 px-4 text-blue-700'>Edit</button></StyledTableCell>
                                {row.isAdmin ?
                                    <StyledTableCell align="right"><button className='bg-green-200 py-2 px-4 text-green-600'>Admin: true</button></StyledTableCell>
                                    :
                                    <StyledTableCell align="right"><button onClick={() => handleMakeAsAdmin(row._id)} className='bg-green-200 py-2 px-4 text-green-600'>Make as Admin</button></StyledTableCell>
                                }
                                <StyledTableCell align="right"><button onClick={() => handleDeleteUser(row._id)} className='bg-red-200 py-2 px-4 text-red-500'>Delete</button></StyledTableCell>
                            </StyledTableRow>

                        ))}
                        <Dialog
                            open={open}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <div className="flex flex-col !min-w-[600px] !w-full !p-6 gap-4">

                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email">
                                        Username
                                    </label>
                                    <input onChange={handleChange} value={currentUser.username} type="text" name="username" id="username" placeholder='Username' className='input' required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="mobile">
                                        Mobile Number
                                    </label>
                                    <div className="input focus-within:border-themeColor">
                                        <PhoneInput
                                            international
                                            defaultCountry="IN"
                                            placeholder="Enter phone number"
                                            value={mobile}
                                            onChange={setMobile} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email">
                                        Email Address
                                    </label>
                                    <input onChange={handleChange} value={currentUser.email} type="email" name="email" id="email" placeholder='Email Address' className='input' required />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="email">
                                        Admin
                                    </label>
                                    <select onChange={handleChange} name='isAdmin' className='input' value={currentUser.isAdmin}>
                                        <option value={true}>
                                            True
                                        </option>
                                        <option value={false}>
                                            False
                                        </option>
                                    </select>
                                </div>
                                <button onClick={() => handleEditChanges()} ><Button fluid text='Save Changes' /></button>
                                <button onClick={handleClose} ><Button fluid text='Cancel' gray /></button>
                            </div>


                        </Dialog>
                    </TableBody>
                </Table>
            </TableContainer>
        </div >
    );
}